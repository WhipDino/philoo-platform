import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const root = dirname(fileURLToPath(import.meta.url));
const outDir = join(root, "out");
const base = process.env.PHILOO_BASE_URL ?? "http://localhost:3000";
const height = 900;
const widths = [320, 375, 768, 1024, 1280, 1440, 1920];
const keyWidths = [320, 768, 1024, 1440];

const pages = [
  { id: "inicio", path: "/inicio", after: null },
  { id: "meu-caminho", path: "/inicio", after: "journey" },
  { id: "biblioteca", path: "/inicio", after: "explore" },
  { id: "licao", path: "/inicio", after: "homework" },
  { id: "caderno", path: "/inicio", after: "notebook" },
  { id: "avisos", path: "/inicio", after: "announcements" },
  { id: "perfil", path: "/inicio", after: "profile" },
  { id: "doxa", path: "/aula/as-sombras/doxa", after: null },
  { id: "a-subida", path: "/aula/a-subida/depois-da-virada", after: null },
  { id: "primeira-tela", path: "/aula/as-sombras/primeira-tela", after: null },
  { id: "a-descida", path: "/aula/as-sombras/a-descida", after: null },
  { id: "periagoge", path: "/aula/a-subida/periagoge", after: null },
  { id: "a-decisao", path: "/aula/a-subida/a-decisao", after: null },
];

const OVERFLOW_JS = `(() => {
  const root = document.documentElement;
  const body = document.body;
  const width = Math.max(root.scrollWidth, body.scrollWidth);
  const story = document.querySelector("[data-philoo-story-shell]");
  const storyBox = story?.getBoundingClientRect();
  const tooSmall = [];
  for (const el of document.querySelectorAll("a, button, [role='button']")) {
    const r = el.getBoundingClientRect();
    if (r.width < 1 || r.height < 1) continue;
    const style = getComputedStyle(el);
    if (style.visibility === "hidden" || style.display === "none") continue;
    if (r.height + 0.5 < 44 || r.width + 0.5 < 44) {
      tooSmall.push({
        tag: el.tagName,
        name: (el.getAttribute("aria-label") || el.textContent || "").trim().slice(0, 80),
        w: Math.round(r.width),
        h: Math.round(r.height),
      });
    }
  }
  return {
    innerWidth,
    innerHeight,
    scrollWidth: width,
    overflowX: width > innerWidth + 1,
    extra: width - innerWidth,
    storyWidth: storyBox ? Math.round(storyBox.width) : null,
    storyHidden: Boolean(story) && storyBox.width < 160,
    smallTargets: tooSmall.slice(0, 12),
    smallCount: tooSmall.length,
  };
})()`;

async function hideNextOverlay(page) {
  await page.addStyleTag({
    content: `
      nextjs-portal, [data-nextjs-dialog-overlay], [data-next-badge-root] {
        display: none !important;
      }
    `,
  });
}

async function clickVisible(page, role, name) {
  await page.getByRole(role, { name }).locator("visible=true").first().click();
}

async function applyAfter(page, after) {
  if (!after) return;
  if (after === "bell") {
    await clickVisible(page, "button", /avisos não lidos/i);
    await page.getByRole("complementary", { name: /prévia dos avisos/i }).waitFor({ timeout: 10_000 });
    return;
  }
  if (after === "announcements") {
    await clickVisible(page, "button", /avisos não lidos/i);
    await clickVisible(page, "button", /ver todos os avisos/i);
    await page.getByRole("heading", { name: /novidade/i }).waitFor({ timeout: 10_000 });
    return;
  }
  if (after === "profile") {
    await clickVisible(page, "button", /abrir perfil/i);
    await page.getByRole("heading", { name: /seu perfil acompanha/i }).waitFor({ timeout: 10_000 });
    return;
  }
  const labels = {
    journey: /^meu caminho$/i,
    explore: /^biblioteca$/i,
    homework: /^lição de casa/i,
    notebook: /^caderno/i,
  };
  const waits = {
    journey: /módulo 1/i,
    explore: /escolha por onde sua curiosidade/i,
    homework: /o que marina pediu/i,
    notebook: /palavras que você foi guardando/i,
  };
  await clickVisible(page, "button", labels[after]);
  await page.getByRole("heading", { name: waits[after] }).waitFor({ timeout: 15_000 });
}

async function main() {
  await mkdir(outDir, { recursive: true });
  const browser = await chromium.launch({ headless: true });
  const report = [];

  try {
    for (const spec of pages) {
      const useWidths =
        spec.id === "inicio" ||
        spec.id === "doxa" ||
        spec.id === "a-subida" ||
        spec.id === "meu-caminho" ||
        spec.id === "biblioteca" ||
        spec.id === "licao" ||
        spec.id === "avisos" ||
        spec.id === "perfil"
          ? widths
          : keyWidths;
      for (const width of useWidths) {
        const page = await browser.newPage({
          viewport: { width, height },
        });
        const url = `${base}${spec.path}`;
        await page.goto(url, { waitUntil: "domcontentloaded", timeout: 45_000 });
        await page.waitForTimeout(500);
        await hideNextOverlay(page);
        if (spec.after) {
          await applyAfter(page, spec.after);
          await hideNextOverlay(page);
        }
        await page.waitForTimeout(350);
        const metrics = await page.evaluate(OVERFLOW_JS);
        const file = `${spec.id}-${width}x${height}.png`;
        await page.screenshot({
          path: join(outDir, file),
          fullPage: false,
        });
        report.push({
          id: spec.id,
          width,
          height,
          file,
          ...metrics,
        });
        await page.close();
        const mark = metrics.overflowX
          ? "OVERFLOW"
          : metrics.storyHidden
            ? "STORY-HIDDEN"
            : "ok";
        console.log(
          `${spec.id} ${width}x${height} ${mark} extra=${metrics.extra} small=${metrics.smallCount}`,
        );
      }
    }
  } finally {
    await browser.close();
  }

  await writeFile(join(outDir, "report.json"), JSON.stringify(report, null, 2));
  const failed = report.filter((row) => row.overflowX || row.storyHidden);
  if (failed.length) {
    console.error(`\n${failed.length} viewport(s) failed overflow or story visibility.`);
    process.exitCode = 1;
  } else {
    console.log("\nNo horizontal overflow at listed widths.");
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
