import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const root = dirname(fileURLToPath(import.meta.url));
const outDir = join(root, "out");
const base = process.env.PHILOO_BASE_URL ?? "http://localhost:3000";
const height = 900;
const widths = [320, 375, 768, 1024, 1280, 1440, 1920];

const pages = [
  { id: "inicio", path: "/inicio", after: null },
  { id: "meu-caminho", path: "/inicio?view=journey", after: null },
  { id: "biblioteca", path: "/inicio?view=explore", after: null },
  { id: "doxa", path: "/aula/as-sombras/doxa", after: null },
  { id: "a-subida", path: "/aula/a-subida/depois-da-virada", after: null },
  { id: "o-retorno", path: "/aula/o-retorno/na-boca", after: null },
  { id: "tales-ola", path: "/aula/tales/ola", after: null },
  { id: "tales-mileto", path: "/aula/tales/mileto", after: null },
  { id: "tales-arche", path: "/aula/tales/arche", after: null },
  { id: "tales-cestos", path: "/aula/tales/tres-cestos", after: null },
];

const OVERFLOW_JS = `(() => {
  const root = document.documentElement;
  const body = document.body;
  const width = Math.max(root.scrollWidth, body.scrollWidth);
  const story = document.querySelector("[data-philoo-story-shell]");
  const storyBox = story?.getBoundingClientRect();
  return {
    innerWidth,
    innerHeight,
    scrollWidth: width,
    overflowX: width > innerWidth + 1,
    extra: width - innerWidth,
    storyWidth: storyBox ? Math.round(storyBox.width) : null,
    storyHidden: Boolean(story) && storyBox.width < 160,
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

async function openJourney(page) {
  const button = page.getByRole("button", { name: /^meu caminho$/i });
  await button.click();
  await page.getByRole("heading", { name: /módulo 1/i }).waitFor({ timeout: 15_000 });
}


async function main() {
  await mkdir(outDir, { recursive: true });
  const browser = await chromium.launch({ headless: true });
  const report = [];

  try {
    for (const spec of pages) {
      for (const width of widths) {
        const page = await browser.newPage({
          viewport: { width, height },
        });
        const url = `${base}${spec.path}`;
        await page.goto(url, { waitUntil: "networkidle", timeout: 60_000 });
        await hideNextOverlay(page);
        if (spec.after === "journey") {
          await openJourney(page);
          await hideNextOverlay(page);
        }
        await page.waitForTimeout(400);
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
        console.log(`${spec.id} ${width}x${height} ${mark} extra=${metrics.extra}`);
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
