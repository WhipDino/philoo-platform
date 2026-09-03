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

function processFile(input) {
  const result = spawnSync(
    "powershell",
    ["-NoProfile", "-File", SCRIPT, "-Path", input],
    { encoding: "utf8" },
  );
  if (result.stdout) process.stdout.write(result.stdout);
  if (result.stderr) process.stderr.write(result.stderr);
  if (result.status !== 0) {
    throw new Error(`chroma key failed for ${input}`);
  }
}

const args = process.argv.slice(2);
if (args[0] === "--inspect") {
  for (const file of args.slice(1)) {
    console.log(JSON.stringify(inspect(file)));
  }
} else if (args[0] === "--dir") {
  const dir = args[1];
  const files = readdirSync(dir).filter(
    (name) => name.startsWith("plato-") && extname(name).toLowerCase() === ".png",
  );
  for (const name of files) {
    processFile(join(dir, name));
  }
} else if (args.length >= 1) {
  processFile(args[0]);
} else {
  console.error(
    "Usage: node scripts/chroma-key-green.mjs <in.png> | --dir <folder> | --inspect <files...>",
  );
  process.exit(1);
}
