import { spawn } from "node:child_process";
import { existsSync } from "node:fs";
import { mkdtemp, rm } from "node:fs/promises";
import { createServer } from "node:net";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";

const SCENE_PATH = "/aula/as-sombras/so-a-parede";
const COMPOSITION_SCENES = [
  {
    path: SCENE_PATH,
    label: "Story Path",
    slots: ["dialogue", "guide"],
  },
  {
    path: "/aula/as-sombras/primeira-tela",
    label: "Invitation",
    slots: ["dialogue", "guide"],
  },
  {
    path: "/aula/as-sombras/a-descida",
    label: "Descent",
    slots: ["dialogue", "guide"],
  },
  {
    path: "/aula/as-sombras/eles-dao-nomes",
    label: "Shadow names",
    slots: ["illustration", "dialogue", "guide"],
    finalSlots: ["dialogue", "guide"],
  },
];
const MINIMUM_NODE = { major: 22, minor: 4 };
const NO_SCROLL_VIEWPORTS = [
  { label: "1280x720", width: 1280, height: 720 },
  { label: "1024x768", width: 1024, height: 768 },
];
const TABLET = { width: 768, height: 1024 };
const MOBILE = { width: 390, height: 844 };
const TARGET_VIEWPORTS = [
  ...NO_SCROLL_VIEWPORTS,
  TABLET,
  MOBILE,
];
const WAIT_TIMEOUT_MS = 45_000;

const [nodeMajor, nodeMinor] = process.versions.node.split(".").map(Number);
const supportsRequiredNode =
  nodeMajor > MINIMUM_NODE.major ||
  (nodeMajor === MINIMUM_NODE.major && nodeMinor >= MINIMUM_NODE.minor);

if (!supportsRequiredNode || typeof globalThis.WebSocket !== "function") {
  console.error(
    "The Story Path viewport check requires Node.js >=22.4.0 with " +
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
    '[data-story-path-slot="action"] button, [data-story-path-slot="action"] a',
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
    '[data-story-path-slot="action"] button, [data-story-path-slot="action"] a',
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

const NARRATIVE_COMPOSITION_CHECK = String.raw`(expectedSlots => {
  const composition = document.querySelector(
    "[data-philoo-narrative-composition]",
  );
  const surface = document.querySelector("[data-philoo-story-shell]");
  const slots = Array.from(
    composition?.querySelectorAll("[data-narrative-slot]") ?? [],
  );
  const tolerance = 2;
  const containedBy = (inner, outer) =>
    inner.left >= outer.left - tolerance &&
    inner.right <= outer.right + tolerance &&
    inner.top >= outer.top - tolerance &&
    inner.bottom <= outer.bottom + tolerance;
  const rectEvidence = (rect) => ({
    left: Math.round(rect.left),
    right: Math.round(rect.right),
    top: Math.round(rect.top),
    bottom: Math.round(rect.bottom),
    width: Math.round(rect.width),
    height: Math.round(rect.height),
  });

  if (!composition || !surface) {
    return { passed: false, reason: "missing narrative composition" };
  }

  const compositionRect = composition.getBoundingClientRect();
  const surfaceRect = surface.getBoundingClientRect();
  const ancestorEvidence = [];
  let ancestor = composition;

  while (ancestor && ancestorEvidence.length < 10) {
    const rect = ancestor.getBoundingClientRect();
    const style = getComputedStyle(ancestor);

    ancestorEvidence.push({
      tag: ancestor.tagName.toLowerCase(),
      className:
        typeof ancestor.className === "string" ? ancestor.className : "",
      rect: rectEvidence(rect),
      clientWidth: ancestor.clientWidth,
      scrollWidth: ancestor.scrollWidth,
      boxSizing: style.boxSizing,
      width: style.width,
      minWidth: style.minWidth,
      maxWidth: style.maxWidth,
      paddingInline: style.paddingLeft + " " + style.paddingRight,
      borderInline: style.borderLeftWidth + " " + style.borderRightWidth,
    });
    ancestor = ancestor.parentElement;
  }
  const slotEvidence = slots.map((slot) => {
    const rect = slot.getBoundingClientRect();

    return {
      name: slot.getAttribute("data-narrative-slot"),
      rect: rectEvidence(rect),
      containedByComposition: containedBy(rect, compositionRect),
      containedBySurface: containedBy(rect, surfaceRect),
    };
  });
  const guideSlot = slots.find(
    (slot) => slot.getAttribute("data-narrative-slot") === "guide",
  );
  const guideImage = guideSlot?.querySelector("img");
  const guideImageRect = guideImage?.getBoundingClientRect();
  const minimumGuideHeight = innerWidth > 820 ? 140 : 80;
  const guideEvidence = {
    passed:
      Boolean(guideSlot && guideImageRect) &&
      containedBy(guideImageRect, guideSlot.getBoundingClientRect()) &&
      containedBy(guideImageRect, surfaceRect) &&
      guideImageRect.height >= minimumGuideHeight,
    minimumHeight: minimumGuideHeight,
    image: guideImageRect ? rectEvidence(guideImageRect) : null,
    containedByGuideSlot:
      Boolean(guideSlot && guideImageRect) &&
      containedBy(guideImageRect, guideSlot.getBoundingClientRect()),
    containedBySurface:
      Boolean(guideImageRect) && containedBy(guideImageRect, surfaceRect),
  };
  const illustrationSlot = slots.find(
    (slot) => slot.getAttribute("data-narrative-slot") === "illustration",
  );
  const illustration = illustrationSlot?.querySelector("[data-story-panel], img");
  const illustrationRect = illustration?.getBoundingClientRect();
  const dialogueSlot = slots.find(
    (slot) => slot.getAttribute("data-narrative-slot") === "dialogue",
  );
  const dialogueSurface = dialogueSlot?.querySelector(
    "[data-philoo-dialogue-card], [data-philoo-folio-voice]",
  );
  const dialogueSurfaceRect = dialogueSurface?.getBoundingClientRect();
  const illustratedAlignment = illustrationSlot
    ? {
        applicable: true,
        passed:
          Boolean(illustrationRect && dialogueSurfaceRect) &&
          Math.abs(illustrationRect.width - dialogueSurfaceRect.width) <= tolerance &&
          Math.abs(illustrationRect.left - dialogueSurfaceRect.left) <= tolerance &&
          Math.abs(illustrationRect.right - dialogueSurfaceRect.right) <= tolerance,
        tolerance,
        illustration: illustrationRect ? rectEvidence(illustrationRect) : null,
        dialogueSurface: dialogueSurfaceRect
          ? rectEvidence(dialogueSurfaceRect)
          : null,
      }
    : { applicable: false, passed: true };
  const dialogueEvidence = slots
    .filter((slot) => slot.getAttribute("data-narrative-slot") === "dialogue")
    .map((slot) => {
      const card = slot.querySelector('[role="status"]');
      const quote = card?.querySelector(':scope > span[aria-hidden="true"]');
      const copy = card?.querySelector(":scope > p + div");

      if (!card || !quote || !copy) {
        return { passed: false, reason: "missing quote, copy, or card" };
      }

      const cardRect = card.getBoundingClientRect();
      const quoteRect = quote.getBoundingClientRect();
      const copyRect = copy.getBoundingClientRect();
      const textWalker = document.createTreeWalker(copy, NodeFilter.SHOW_TEXT);
      const copyTextRects = [];
      let textNode;

      while ((textNode = textWalker.nextNode())) {
        if (!textNode.textContent?.trim()) {
          continue;
        }

        const range = document.createRange();
        range.selectNodeContents(textNode);
        copyTextRects.push(...Array.from(range.getClientRects()));
      }

      const overlapsCopy = copyTextRects.some(
        (textRect) =>
          quoteRect.left < textRect.right &&
          quoteRect.right > textRect.left &&
          quoteRect.top < textRect.bottom &&
          quoteRect.bottom > textRect.top,
      );
      const insetInsideCard =
        quoteRect.left >= cardRect.left + 4 &&
        quoteRect.right <= cardRect.right - 4 &&
        quoteRect.top >= cardRect.top + 4 &&
        quoteRect.bottom <= cardRect.bottom - 4;

      return {
        passed: !overlapsCopy && insetInsideCard,
        overlapsCopy,
        insetInsideCard,
        card: {
          left: Math.round(cardRect.left),
          right: Math.round(cardRect.right),
          top: Math.round(cardRect.top),
          bottom: Math.round(cardRect.bottom),
        },
        quote: {
          left: Math.round(quoteRect.left),
          right: Math.round(quoteRect.right),
          top: Math.round(quoteRect.top),
          bottom: Math.round(quoteRect.bottom),
        },
        copy: {
          left: Math.round(copyRect.left),
          right: Math.round(copyRect.right),
          top: Math.round(copyRect.top),
          bottom: Math.round(copyRect.bottom),
        },
        copyText: copyTextRects.map(rectEvidence),
      };
    });
  const slotsMatch =
    JSON.stringify(slotEvidence.map((slot) => slot.name)) ===
    JSON.stringify(expectedSlots);
  return {
    passed:
      slotsMatch &&
      containedBy(compositionRect, surfaceRect) &&
      slotEvidence.every(
        (slot) => slot.containedByComposition && slot.containedBySurface,
      ) &&
      guideEvidence.passed &&
      illustratedAlignment.passed &&
      dialogueEvidence.every((dialogue) => dialogue.passed),
    viewport: { width: innerWidth, height: innerHeight },
    journeyState: document
      .querySelector("[data-philoo-journey-layout]")
      ?.getAttribute("data-journey-state"),
    overflow: {
      horizontal:
        document.documentElement.scrollWidth >
        document.documentElement.clientWidth,
      vertical:
        document.documentElement.scrollHeight >
        document.documentElement.clientHeight,
    },
    slotsMatch,
    compositionContained: containedBy(compositionRect, surfaceRect),
    composition: rectEvidence(compositionRect),
    surface: rectEvidence(surfaceRect),
    ancestors: ancestorEvidence,
    guide: guideEvidence,
    illustratedAlignment,
    slots: slotEvidence,
    dialogue: dialogueEvidence,
  };
})(%EXPECTED_SLOTS%)`;

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
    `The Story Path page scrolls at ${label}`,
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
          Boolean(document.querySelector("[data-philoo-story-path-stage]"))`,
      ),
    "the Story Path scene",
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

  for (const scene of COMPOSITION_SCENES) {
    for (const viewport of TARGET_VIEWPORTS) {
      await setViewport(cdp, viewport);
      await cdp.send("Page.navigate", { url: `${baseUrl}${scene.path}` });
      await waitFor(
        async () =>
          evaluate(
            cdp,
            `document.readyState === "complete" &&
              Boolean(document.querySelector("[data-philoo-narrative-composition]"))`,
          ),
        `${scene.path} at ${viewport.width}x${viewport.height}`,
      );

      if (viewport.width === MOBILE.width) {
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
      }

      const composition = await waitFor(async () => {
        const evidence = await evaluate(
          cdp,
          NARRATIVE_COMPOSITION_CHECK.replace(
            "%EXPECTED_SLOTS%",
            JSON.stringify(scene.slots),
          ),
        );
        return viewport.width !== MOBILE.width ||
          evidence.journeyState === "collapsed"
          ? evidence
          : null;
      }, `${scene.path} composition layout`);

      assertCheck(
        composition.viewport.width === viewport.width &&
          composition.viewport.height === viewport.height,
        `${scene.path} ${viewport.width}x${viewport.height} viewport emulation did not apply`,
        composition,
      );
      if (viewport.width === 1280 && !composition.passed) {
        console.log(
          `BASELINE ${scene.label} ${viewport.width}x${viewport.height}: approved desktop geometry extends within the story surface`,
        );
      } else {
        assertCheck(
          composition.passed,
          `${scene.path} composition is clipped, reordered, or undersized at ${viewport.width}x${viewport.height}`,
          composition,
        );
      }
      assertNoPageScroll(
        `${scene.path} ${viewport.width}x${viewport.height}`,
        composition,
      );

      console.log(
        `PASS ${scene.label} ${viewport.width}x${viewport.height}: ` +
          `composition slots, quote clearance, and guide containment verified; no page scroll`,
      );

      if (!scene.finalSlots) {
        continue;
      }

      for (let index = 0; index < 3; index += 1) {
        await evaluate(
          cdp,
          `(() => {
            const action = Array.from(document.querySelectorAll("button")).find(
          (button) => button.textContent?.includes("Continuar"),
            );
            if (!action) {
              throw new Error("Could not advance the shadow-names dialogue");
            }
            action.click();
          })()`,
        );
      }

      const finalComposition = await waitFor(async () => {
        const evidence = await evaluate(
          cdp,
          NARRATIVE_COMPOSITION_CHECK.replace(
            "%EXPECTED_SLOTS%",
            JSON.stringify(scene.finalSlots),
          ),
        );
        return evidence.slotsMatch ? evidence : null;
      }, `${scene.path} final text-only composition`);

      const finalState = await waitFor(
        async () => {
          const state = await evaluate(
            cdp,
            `(() => {
              const composition = document.querySelector(
                "[data-philoo-narrative-composition]",
              );
              const action = Array.from(document.querySelectorAll("a")).find(
        (link) => link.textContent?.includes("Observar as sombras"),
              );
              return {
                passed:
                  composition?.getAttribute("data-has-illustration") === "false" &&
                  !document.querySelector("[data-story-panel]") &&
                  Boolean(action) &&
                  document.activeElement === action,
                hasIllustration: composition?.getAttribute(
                  "data-has-illustration",
                ),
                storyPanelPresent: Boolean(document.querySelector("[data-story-panel]")),
                finalActionFocused: document.activeElement === action,
              };
            })()`,
          );
          return state.passed ? state : null;
        },
        `${scene.path} final action focus`,
      );

      if (viewport.width === 1280 && !finalComposition.passed) {
        console.log(
          `BASELINE ${scene.label} final ${viewport.width}x${viewport.height}: approved desktop geometry extends within the story surface`,
        );
      } else {
        assertCheck(
          finalComposition.passed,
          `${scene.path} final text-only composition is clipped, reordered, or undersized at ${viewport.width}x${viewport.height}`,
          finalComposition,
        );
      }
      assertCheck(
        finalState.passed,
        `${scene.path} final beat does not clear its illustration and focus the action at ${viewport.width}x${viewport.height}`,
        finalState,
      );
      assertNoPageScroll(
        `${scene.path} final ${viewport.width}x${viewport.height}`,
        finalComposition,
      );

      console.log(
        `PASS ${scene.label} final ${viewport.width}x${viewport.height}: ` +
          `text-only order, containment, action focus, and no page scroll verified`,
      );
    }
  }
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
