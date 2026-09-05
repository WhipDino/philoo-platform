/**
 * Remove near-white backgrounds from flat coin art (white matte, not green chroma).
 * Usage: node scripts/white-key-sharp.mjs <input.png> [output.png]
 */
import sharp from "sharp";

const [input, output = input] = process.argv.slice(2);
if (!input) {
  console.error("Usage: node scripts/white-key-sharp.mjs <input.png> [output.png]");
  process.exit(1);
}

const threshold = 248;
const softness = 18;

const { data, info } = await sharp(input).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
const { width, height, channels } = info;
const out = Buffer.from(data);
let keyed = 0;

for (let i = 0; i < out.length; i += channels) {
  const r = out[i];
  const g = out[i + 1];
  const b = out[i + 2];
  const min = Math.min(r, g, b);
  const max = Math.max(r, g, b);
  const avg = (r + g + b) / 3;

  if (min >= threshold) {
    out[i + 3] = 0;
    keyed++;
    continue;
  }

  if (avg >= threshold - softness && max - min <= 12) {
    const alpha = Math.round(((threshold - avg) / softness) * 255);
    out[i + 3] = Math.min(out[i + 3], Math.max(0, alpha));
    if (out[i + 3] < 16) keyed++;
  }
}

await sharp(out, { raw: { width, height, channels } }).png().toFile(output);
console.log(`white-key: ${input} -> ${output} (${keyed} pixels keyed)`);
