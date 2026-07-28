import { spawn } from "node:child_process";
import { existsSync } from "node:fs";
import { mkdtemp, rm } from "node:fs/promises";
import { createServer } from "node:net";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";

const SCENE_PATH = "/aula/as-sombras/so-a-parede";
const MINIMUM_NODE = { major: 22, minor: 4 };
const NO_SCROLL_VIEWPORTS = [
  { label: "1280x720", width: 1280, height: 720 },
  { label: "1024x768", width: 1024, height: 768 },
];
const TABLET = { width: 768, height: 1024 };
const MOBILE = { width: 390, height: 844 };
const WAIT_TIMEOUT_MS = 45_000;

const [nodeMajor, nodeMinor] = process.versions.node.split(".").map(Number);
const supportsRequiredNode =
  nodeMajor > MINIMUM_NODE.major ||
  (nodeMajor === MINIMUM_NODE.major && nodeMinor >= MINIMUM_NODE.minor);

if (!supportsRequiredNode || typeof globalThis.WebSocket !== "function") {
  console.error(
    "The Story Folio viewport check requires Node.js >=22.4.0 with " +
      `global WebSocket enabled (current: ${process.versions.node}).`,
  );
  process.exit(1);
}

const NO_SCROLL_CHECK = String.raw`(() => ({
  viewport: { width: innerWidth, height: innerHeight },
  overflow: {
    horizontal:
      document.documentElement.scrollWidth >
      document.documentElement.clientWidth,
    vertical:
      document.documentElement.scrollHeight >
      document.documentElement.clientHeight,
  },
}))()`;

const TABLET_CHECK = String.raw`(() => {
  const layout = document.querySelector("[data-philoo-journey-layout]");
  const rail = document.querySelector("[data-philoo-journey-rail]");
  const action = document.querySelector(
    '[data-folio-slot="primary"] button, [data-folio-slot="primary"] a',
  );

  if (!layout || !rail || !action) {
    return { passed: false, reason: "missing fixture element" };
  }

  const actionRect = action.getBoundingClientRect();
  const railRect = rail.getBoundingClientRect();
  const center = {
    x: actionRect.left + actionRect.width / 2,
    y: actionRect.top + actionRect.height / 2,
  };
  const hit = document.elementFromPoint(center.x, center.y);

  return {
    passed: hit === action || action.contains(hit),
    journeyState: layout.getAttribute("data-journey-state"),
    viewport: { width: innerWidth, height: innerHeight },
    action: {
      left: Math.round(actionRect.left),
      right: Math.round(actionRect.right),
    },
    rail: {
      left: Math.round(railRect.left),
      right: Math.round(railRect.right),
    },
    center: {
      x: Math.round(center.x),
      y: Math.round(center.y),
    },
    hit: {
      tag: hit?.tagName ?? null,
      text: hit?.textContent?.trim() ?? null,
    },
    overflow: {
      horizontal:
        document.documentElement.scrollWidth >
        document.documentElement.clientWidth,
      vertical:
        document.documentElement.scrollHeight >
        document.documentElement.clientHeight,
    },
  };
})()`;

const MOBILE_CHECK = String.raw`(() => {
  const layout = document.querySelector("[data-philoo-journey-layout]");
  const rail = document.querySelector("[data-philoo-journey-rail]");
  const action = document.querySelector(
    '[data-folio-slot="primary"] button, [data-folio-slot="primary"] a',
  );
  const arrow = action?.querySelector('[aria-hidden="true"]');

  if (!layout || !rail || !action || !arrow) {
    return { passed: false, reason: "missing fixture element" };
  }

  const actionRect = action.getBoundingClientRect();
  const arrowRect = arrow.getBoundingClientRect();
  const railRect = rail.getBoundingClientRect();
  const actionCenter = {
    x: actionRect.left + actionRect.width / 2,
    y: actionRect.top + actionRect.height / 2,
  };
  const arrowCenter = {
    x: arrowRect.left + arrowRect.width / 2,
    y: arrowRect.top + arrowRect.height / 2,
  };
  const actionHit = document.elementFromPoint(actionCenter.x, actionCenter.y);
  const arrowHit = document.elementFromPoint(arrowCenter.x, arrowCenter.y);
  const actionCenterHits =
    actionHit === action || action.contains(actionHit);
  const arrowCenterHits = arrowHit === action || action.contains(arrowHit);
  const actionClearsRail = actionRect.right < railRect.left;

  return {
    passed: actionCenterHits && arrowCenterHits && actionClearsRail,
    actionCenterHits,
    arrowCenterHits,
    actionClearsRail,
    journeyState: layout.getAttribute("data-journey-state"),
    viewport: { width: innerWidth, height: innerHeight },
    action: {
      left: Math.round(actionRect.left),
      right: Math.round(actionRect.right),
    },
    rail: {
      left: Math.round(railRect.left),
      right: Math.round(railRect.right),
    },
    actionCenter: {
      x: Math.round(actionCenter.x),
      y: Math.round(actionCenter.y),
    },
    arrowCenter: {
      x: Math.round(arrowCenter.x),
      y: Math.round(arrowCenter.y),
    },
    actionHit: {
      tag: actionHit?.tagName ?? null,
      text: actionHit?.textContent?.trim() ?? null,
    },
    arrowHit: {
      tag: arrowHit?.tagName ?? null,
      text: arrowHit?.textContent?.trim() ?? null,
    },
    overflow: {
      horizontal:
        document.documentElement.scrollWidth >
        document.documentElement.clientWidth,
      vertical:
        document.documentElement.scrollHeight >
        document.documentElement.clientHeight,
    },
  };
})()`;

function delay(milliseconds) {
  return new Promise((resolveDelay) => {
    setTimeout(resolveDelay, milliseconds);
  });
}

async function waitFor(probe, description, timeoutMs = WAIT_TIMEOUT_MS) {
  const deadline = Date.now() + timeoutMs;
  let lastError;

  while (Date.now() < deadline) {
    try {
      const value = await probe();
      if (value) {
        return value;
      }
    } catch (error) {
      lastError = error;
    }

    await delay(100);
  }

  throw new Error(
    `Timed out waiting for ${description}${
      lastError instanceof Error ? `: ${lastError.message}` : ""
    }`,
  );
}

async function getFreePort() {
  return new Promise((resolvePort, rejectPort) => {
    const server = createServer();

    server.once("error", rejectPort);
    server.listen(0, "127.0.0.1", () => {
      const address = server.address();

      if (!address || typeof address === "string") {
        server.close();
        rejectPort(new Error("Could not allocate a local port"));
        return;
      }

      server.close(() => resolvePort(address.port));
    });
  });
}

function captureOutput(child) {
  let output = "";
  const append = (chunk) => {
    output = `${output}${chunk}`.slice(-12_000);
  };

  child.stdout?.on("data", append);
  child.stderr?.on("data", append);

  return () => output.trim();
}

async function stopChild(child) {
  if (!child || child.exitCode !== null) {
    return;
  }

  child.kill("SIGTERM");
  await Promise.race([
    new Promise((resolveExit) => child.once("exit", resolveExit)),
    delay(2_000),
  ]);

  if (child.exitCode === null) {
    child.kill("SIGKILL");
  }
}

function findChrome() {
  const candidates = [
    process.env.CHROME_PATH,
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    "/Applications/Chromium.app/Contents/MacOS/Chromium",
    "/usr/bin/google-chrome",
    "/usr/bin/chromium",
    "/usr/bin/chromium-browser",
  ].filter(Boolean);

  const chrome = candidates.find((candidate) => existsSync(candidate));

  if (!chrome) {
    throw new Error(
      "Chrome was not found. Set CHROME_PATH to a Chrome or Chromium executable.",
    );
  }

  return chrome;
}

class CdpClient {
  constructor(socket) {
    this.socket = socket;
    this.nextId = 1;
    this.pending = new Map();

    socket.addEventListener("message", (event) => {
      const message = JSON.parse(String(event.data));

      if (!message.id) {
        return;
      }

      const pendingRequest = this.pending.get(message.id);
      if (!pendingRequest) {
        return;
      }

      this.pending.delete(message.id);
      clearTimeout(pendingRequest.timeout);

      if (message.error) {
        pendingRequest.reject(
          new Error(`${message.error.message} (${message.error.code})`),
        );
        return;
      }

      pendingRequest.resolve(message.result);
    });
  }

  static async connect(url) {
    const socket = new globalThis.WebSocket(url);

    await new Promise((resolveConnection, rejectConnection) => {
      socket.addEventListener("open", resolveConnection, { once: true });
      socket.addEventListener(
        "error",
        () => rejectConnection(new Error("Chrome DevTools connection failed")),
        { once: true },
      );
    });

    return new CdpClient(socket);
  }

  send(method, params = {}) {
    const id = this.nextId;
    this.nextId += 1;

    return new Promise((resolveRequest, rejectRequest) => {
      const timeout = setTimeout(() => {
        this.pending.delete(id);
        rejectRequest(new Error(`Chrome DevTools command timed out: ${method}`));
      }, 10_000);

      this.pending.set(id, {
        resolve: resolveRequest,
        reject: rejectRequest,
        timeout,
      });
      this.socket.send(JSON.stringify({ id, method, params }));
    });
  }

  close() {
    this.socket.close();
  }
}

async function evaluate(client, expression) {
  const response = await client.send("Runtime.evaluate", {
    expression,
    awaitPromise: true,
    returnByValue: true,
  });

  if (response.exceptionDetails) {
    throw new Error(
      response.exceptionDetails.exception?.description ??
        response.exceptionDetails.text,
    );
  }

  return response.result.value;
}

async function setViewport(client, viewport) {
  await client.send("Emulation.setDeviceMetricsOverride", {
    ...viewport,
    deviceScaleFactor: 1,
    mobile: false,
  });
}

function assertCheck(condition, message, evidence) {
  if (!condition) {
    throw new Error(`${message}\n${JSON.stringify(evidence, null, 2)}`);
  }
}

function assertNoPageScroll(label, evidence) {
  assertCheck(
    !evidence.overflow.horizontal && !evidence.overflow.vertical,
    `The Story Folio page scrolls at ${label}`,
    evidence,
  );
}

let devServer;
let chrome;
let cdp;
let chromeProfile;
let getDevServerOutput = () => "";
let getChromeOutput = () => "";

try {
  const suppliedBaseUrl = process.env.PHILOO_BASE_URL;
  let baseUrl = suppliedBaseUrl;

  if (!baseUrl) {
    const devPort = await getFreePort();
    baseUrl = `http://127.0.0.1:${devPort}`;
    const nextEntry = resolve("node_modules/next/dist/bin/next");

    devServer = spawn(
      process.execPath,
      [nextEntry, "dev", "--hostname", "127.0.0.1", "--port", String(devPort)],
      {
        cwd: process.cwd(),
        env: { ...process.env, NEXT_TELEMETRY_DISABLED: "1" },
        stdio: ["ignore", "pipe", "pipe"],
      },
    );
    getDevServerOutput = captureOutput(devServer);

    await waitFor(async () => {
      if (devServer.exitCode !== null) {
        throw new Error(
          `Next.js exited with code ${devServer.exitCode}\n${getDevServerOutput()}`,
        );
      }

      const response = await fetch(`${baseUrl}${SCENE_PATH}`);
      return response.ok;
    }, "the Philoo lesson route");
  }

  const cdpPort = await getFreePort();
  chromeProfile = await mkdtemp(join(tmpdir(), "philoo-folio-chrome-"));
  chrome = spawn(
    findChrome(),
    [
      "--headless=new",
      "--disable-background-networking",
      "--disable-component-update",
      "--disable-default-apps",
      "--disable-extensions",
      "--disable-sync",
      "--hide-scrollbars",
      "--metrics-recording-only",
      "--no-default-browser-check",
      "--no-first-run",
      `--remote-debugging-port=${cdpPort}`,
      `--user-data-dir=${chromeProfile}`,
      "about:blank",
    ],
    { stdio: ["ignore", "pipe", "pipe"] },
  );
  getChromeOutput = captureOutput(chrome);

  const pageTarget = await waitFor(async () => {
    if (chrome.exitCode !== null) {
      throw new Error(
        `Chrome exited with code ${chrome.exitCode}\n${getChromeOutput()}`,
      );
    }

    const response = await fetch(`http://127.0.0.1:${cdpPort}/json/list`);
    const targets = await response.json();
    return targets.find(
      (target) => target.type === "page" && target.webSocketDebuggerUrl,
    );
  }, "a Chrome DevTools page target");

  cdp = await CdpClient.connect(pageTarget.webSocketDebuggerUrl);
  await cdp.send("Page.enable");
  await cdp.send("Runtime.enable");
  await setViewport(cdp, NO_SCROLL_VIEWPORTS[0]);
  await cdp.send("Page.navigate", { url: `${baseUrl}${SCENE_PATH}` });

  await waitFor(
    async () =>
      evaluate(
        cdp,
        `document.readyState === "complete" &&
          Boolean(document.querySelector("[data-philoo-story-folio]"))`,
      ),
    "the Story Folio scene",
  );

  for (const viewport of NO_SCROLL_VIEWPORTS) {
    await setViewport(cdp, viewport);
    const noScroll = await evaluate(cdp, NO_SCROLL_CHECK);

    assertCheck(
      noScroll.viewport.width === viewport.width &&
        noScroll.viewport.height === viewport.height,
      `${viewport.label} viewport emulation did not apply`,
      noScroll,
    );
    assertNoPageScroll(viewport.label, noScroll);
    console.log(`PASS ${viewport.label}: no page scroll`);
  }

  await setViewport(cdp, TABLET);
  const tablet = await evaluate(cdp, TABLET_CHECK);
  assertCheck(
    tablet.viewport.width === TABLET.width &&
      tablet.viewport.height === TABLET.height,
    "Tablet viewport emulation did not apply",
    tablet,
  );
  assertCheck(
    tablet.journeyState === "expanded",
    "The journey rail must be expanded for the tablet regression",
    tablet,
  );
  assertCheck(
    tablet.passed,
    "The expanded journey rail blocks the action center at 768x1024",
    tablet,
  );
  assertNoPageScroll("768x1024", tablet);

  console.log(
    `PASS 768x1024 expanded: action center (${tablet.center.x},${tablet.center.y}) ` +
      `hits ${tablet.hit.tag}; action ${tablet.action.left}..${tablet.action.right}; ` +
      `rail ${tablet.rail.left}..${tablet.rail.right}; no page scroll`,
  );

  await setViewport(cdp, MOBILE);
  await evaluate(
    cdp,
    `(() => {
      const layout = document.querySelector("[data-philoo-journey-layout]");
      if (layout?.getAttribute("data-journey-state") === "collapsed") {
        return "already collapsed";
      }

      const toggle = document.querySelector(
        '[data-philoo-journey-rail] button[aria-expanded="true"]',
      );
      if (!toggle) {
        throw new Error("Could not find the expanded journey toggle");
      }

      toggle.click();
      return "collapsed";
    })()`,
  );

  const mobile = await waitFor(async () => {
    const evidence = await evaluate(cdp, MOBILE_CHECK);
    return evidence.journeyState === "collapsed" ? evidence : null;
  }, "the collapsed mobile journey rail");

  assertCheck(
    mobile.viewport.width === MOBILE.width &&
      mobile.viewport.height === MOBILE.height,
    "Mobile viewport emulation did not apply",
    mobile,
  );
  assertCheck(
    mobile.passed,
    "The collapsed mobile journey rail veils the action or arrow",
    mobile,
  );
  assertNoPageScroll("390x844", mobile);

  console.log(
    `PASS 390x844 collapsed: action center hits ${mobile.actionHit.tag}; ` +
      `arrow center hits ${mobile.arrowHit.tag}; action right ${mobile.action.right} ` +
      `< rail left ${mobile.rail.left}; no page scroll`,
  );
} catch (error) {
  console.error(error instanceof Error ? error.message : error);

  if (getDevServerOutput()) {
    console.error(`\nNext.js output:\n${getDevServerOutput()}`);
  }
  if (getChromeOutput()) {
    console.error(`\nChrome output:\n${getChromeOutput()}`);
  }

  process.exitCode = 1;
} finally {
  cdp?.close();
  await stopChild(chrome);
  await stopChild(devServer);

  if (chromeProfile) {
    await rm(chromeProfile, { recursive: true, force: true });
  }
}
