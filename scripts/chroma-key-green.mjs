/**
 * Remove a solid chromakey-green background from Plato cutouts.
 * Gemini often writes JPEG bytes into a .png filename, so this delegates
 * decode/key/encode to scripts/chroma-key-green.ps1 (System.Drawing).
 *
 * Usage:
 *   node scripts/chroma-key-green.mjs <input.png>
 *   node scripts/chroma-key-green.mjs --dir public/images/story/o-retorno
 *   node scripts/chroma-key-green.mjs --inspect <files...>
 */
import { spawnSync } from "node:child_process";
import { readFileSync, readdirSync } from "node:fs";
import { extname, join } from "node:path";
import { fileURLToPath } from "node:url";

const SCRIPT = fileURLToPath(new URL("./chroma-key-green.ps1", import.meta.url));

function inspect(path) {
  const header = readFileSync(path).subarray(0, 8);
  const isPng = header.equals(
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
  );
  const isJpeg = header[0] === 0xff && header[1] === 0xd8;
  return {
    path,
    kind: isPng ? "png" : isJpeg ? "jpeg" : "unknown",
    bytes: readFileSync(path).length,
  };
}

function parseTightArgs(argv) {
  const tight = argv.includes("--tight");
  const despillOnly = argv.includes("--despill-only");
  return {
    tight: tight
      ? {
          GreenMinG: 160,
          GreenMaxRB: 110,
          GreenDelta: 50,
          AlphaCutoff: 80,
          DespillStrength: 0.95,
        }
      : {},
    despillOnly,
  };
}

function processFile(input, opts = {}) {
  const { despillOnly = false, ...tightOpts } = opts;
  const psArgs = ["-NoProfile", "-File", SCRIPT, "-Path", input];
  if (despillOnly) psArgs.push("-DespillOnly");
  for (const [key, value] of Object.entries(tightOpts)) {
    psArgs.push(`-${key}`, String(value));
  }
  const result = spawnSync("powershell", psArgs, { encoding: "utf8" });
  if (result.stdout) process.stdout.write(result.stdout);
  if (result.stderr) process.stderr.write(result.stderr);
  if (result.status !== 0) {
    throw new Error(`chroma key failed for ${input}`);
  }
}

const args = process.argv.slice(2);
const { tight: tightOpts, despillOnly } = parseTightArgs(args);
const positional = args.filter((arg) => arg !== "--tight" && arg !== "--despill-only");
const fileOpts = { ...tightOpts, despillOnly };

if (positional[0] === "--inspect") {
  for (const file of positional.slice(1)) {
    console.log(JSON.stringify(inspect(file)));
  }
} else if (positional[0] === "--dir") {
  const dir = positional[1];
  const files = readdirSync(dir).filter((name) => {
    const ext = extname(name).toLowerCase() === ".png";
    return (
      ext &&
      (name.startsWith("plato-") ||
        name.startsWith("thales-") ||
        name.startsWith("tales-") ||
        name.startsWith("heraclitus-"))
    );
  });
  for (const name of files) {
    processFile(join(dir, name), fileOpts);
  }
} else if (positional.length >= 1) {
  processFile(positional[0], fileOpts);
} else {
  console.error(
    "Usage: node scripts/chroma-key-green.mjs [--tight] [--despill-only] <in.png> | --dir <folder> | --inspect <files...>",
  );
  process.exit(1);
}
