#!/usr/bin/env node
/**
 * Walk Tales de Mileto from first beat to reward screen, screenshot each step,
 * then build a PDF with Python Pillow.
 *
 * Usage:
 *   PHILOO_BASE_URL=http://localhost:3000 node tools/playwright-check/tales-lesson-pdf.mjs
 */
import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";
import { chromium } from "playwright";

const root = dirname(fileURLToPath(import.meta.url));
const outDir = join(root, "out", "tales-lesson-screens");
const pdfPath = join(root, "out", "tales-de-mileto-completo.pdf");
const base = process.env.PHILOO_BASE_URL ?? "http://localhost:3000";
const viewport = { width: 1280, height: 900 };

let shot = 0;

async function capture(page, label) {
  shot += 1;
  const slug = String(shot).padStart(2, "0");
  const safe = label
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 60);
  const file = `${slug}-${safe || "tela"}.png`;
  const path = join(outDir, file);
  await page.screenshot({ path, fullPage: false });
  console.log(`📸 ${file} — ${label}`);
  return path;
}

async function hideNextOverlay(page) {
  await page.addStyleTag({
    content: `
      nextjs-portal, [data-nextjs-dialog-overlay], [data-next-badge-root] {
        display: none !important;
      }
    `,
  });
}

async function clickNamed(page, pattern) {
  const button = page.getByRole("button", { name: pattern }).first();
  if (await button.isVisible().catch(() => false)) {
    await button.click();
    return "button";
  }
  const link = page.getByRole("link", { name: pattern }).first();
  if (await link.isVisible().catch(() => false)) {
    await link.click();
    return "link";
  }
  throw new Error(`Controle não encontrado: ${pattern}`);
}

async function continueStory(page) {
  await hideNextOverlay(page);
  const action = page.locator("[data-philoo-folio-action]").first();
  await action.waitFor({ state: "visible", timeout: 15_000 });
  const control = action
    .locator("button, a")
    .filter({ hasText: /continuar/i })
    .first();
  await control.waitFor({ state: "visible", timeout: 15_000 });
  await control.click();
  await page.waitForTimeout(350);
}

async function afterNavigation(page) {
  await page.waitForLoadState("networkidle");
  await hideNextOverlay(page);
  await page.waitForTimeout(450);
}

async function startExerciseBeat(page, storyPattern, briefingPattern, briefingLabel) {
  await clickNamed(page, storyPattern);
  const dialog = page.getByRole("dialog");
  await dialog.waitFor({ state: "visible", timeout: 10_000 });
  const briefingShot = await capture(page, briefingLabel);
  await dialog.getByRole("button", { name: briefingPattern }).click();
  await dialog.waitFor({ state: "hidden", timeout: 10_000 });
  await page.waitForTimeout(350);
  return briefingShot;
}

async function finishClassification(page) {
  const placements = [
    ["A ânfora está seca por fora.", /^cara\b/i],
    ["No cais as coisas mudam de cara.", /^cara\b/i],
    ["De que tudo isso é, no fundo?", /^pergunta\b/i],
    ["Existe um começo e um fundo comum?", /^pergunta\b/i],
    ["O princípio é a água.", /^resposta\b/i],
    ["A terra se apoia sobre água.", /^resposta\b/i],
  ];
  for (const [card, basket] of placements) {
    await page.getByRole("button", { name: card }).click();
    await page.getByRole("button", { name: basket }).click();
  }
  await page.getByRole("button", { name: /^conferir$/i }).click();
  await page.waitForTimeout(400);
}

async function finishPrediction(page) {
  await page
    .getByRole("radio", {
      name: /a água é origem e fundo, mesmo do que parece seco/i,
    })
    .click();
  await page.getByRole("button", { name: /^confirmar$/i }).click();
  await page.waitForTimeout(400);
}

async function connectPair(page, source, target) {
  const sourceBtn = page.getByRole("button", { name: `Ligar ${source}` });
  const targetBtn = page.getByRole("button", { name: `Conectar em ${target}` });
  await sourceBtn.dispatchEvent("pointerdown");
  await targetBtn.dispatchEvent("pointerup");
}

async function finishPairConnect(page) {
  const pairs = [
    ["Muitas caras no cais", "Variedade na superfície"],
    ["Um começo e um fundo", "A pergunta da arché"],
    ["Eu digo que é a água", "A resposta, não a pergunta"],
    ["Pão, fruta, suco", "A mesma forma agora"],
  ];
  for (const [source, target] of pairs) {
    await connectPair(page, source, target);
  }
  await page.getByRole("button", { name: /^conferir$/i }).click();
  await page.waitForTimeout(400);
}

async function main() {
  await mkdir(outDir, { recursive: true });
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport });
  const images = [];

  const go = async (path, label) => {
    await page.goto(`${base}${path}`, { waitUntil: "networkidle", timeout: 60_000 });
    await hideNextOverlay(page);
    await page.waitForTimeout(400);
    images.push(await capture(page, label));
  };

  try {
    // 1 · Olá
    await go("/aula/tales/ola", "01-ola-apresentacao");
    await continueStory(page);
    images.push(await capture(page, "02-ola-mileto"));
    await clickNamed(page, /ver o porto/i);
    await afterNavigation(page);

    // 2 · Mileto
    images.push(await capture(page, "03-mileto-porto"));
    await continueStory(page);
    images.push(await capture(page, "04-mileto-muitas-caras"));
    await clickNamed(page, /ouvir a pergunta/i);
    await afterNavigation(page);

    // 3 · O princípio
    images.push(await capture(page, "05-principio-fundo-comum"));
    await continueStory(page);
    images.push(await capture(page, "06-principio-agua"));
    await continueStory(page);
    images.push(await capture(page, "07-principio-terra-sobre-agua"));
    await continueStory(page);
    images.push(await capture(page, "08-principio-porque"));
    await clickNamed(page, /ouvir o nome disso/i);
    await afterNavigation(page);

    // 4 · Arché
    images.push(await capture(page, "09-arche-palavra"));
    await continueStory(page);
    images.push(await capture(page, "10-arche-porto"));
    await continueStory(page);
    images.push(await capture(page, "11-arche-mesa"));
    await clickNamed(page, /separar as frases/i);
    await afterNavigation(page);

    // 5 · Três cestos
    images.push(await capture(page, "12-tres-cestos-intro"));
    images.push(
      await startExerciseBeat(
        page,
        /separar as frases/i,
        /^separar as frases$/i,
        "13-tres-cestos-briefing",
      ),
    );
    images.push(await capture(page, "14-tres-cestos-exemplo"));
    await page
      .getByRole("button", { name: /separar as frases do porto/i })
      .click();
    await page.waitForTimeout(350);
    images.push(await capture(page, "15-tres-cestos-exercicio"));
    await finishClassification(page);
    images.push(await capture(page, "16-tres-cestos-concluido"));
    await continueStory(page);
    images.push(await capture(page, "17-tres-cestos-nao-e-copo"));
    images.push(
      await startExerciseBeat(
        page,
        /escolher um jeito/i,
        /escolher um jeito/i,
        "18-predicao-briefing",
      ),
    );
    images.push(await capture(page, "19-predicao-exercicio"));
    await finishPrediction(page);
    images.push(await capture(page, "20-predicao-acerto"));
    await clickNamed(page, /ligar as caras/i);
    await afterNavigation(page);

    // 6 · O um e os muitos
    images.push(await capture(page, "21-um-e-muitos-intro"));
    images.push(
      await startExerciseBeat(
        page,
        /ligar os pares/i,
        /ligar os pares/i,
        "22-pares-briefing",
      ),
    );
    images.push(await capture(page, "23-pares-exercicio"));
    await finishPairConnect(page);
    images.push(await capture(page, "24-pares-concluido"));
    await continueStory(page);
    images.push(await capture(page, "25-se-o-fundo-e-um"));
    await continueStory(page);
    images.push(await capture(page, "26-o-que-voce-levou"));
    await continueStory(page);
    images.push(await capture(page, "27-recompensa-final"));
  } finally {
    await browser.close();
  }

  writeFile(
    join(outDir, "manifest.json"),
    JSON.stringify({ base, images, pdfPath }, null, 2),
  );

  const py = spawnSync(
    "python3",
    [
      join(root, "tales-lesson-pdf-build.py"),
      pdfPath,
      ...images,
    ],
    { encoding: "utf8" },
  );
  if (py.status !== 0) {
    console.error(py.stdout);
    console.error(py.stderr);
    process.exit(py.status ?? 1);
  }
  console.log(`\n✅ PDF pronto: ${pdfPath}`);
  console.log(`   ${images.length} telas capturadas`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
