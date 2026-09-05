/**
 * macOS/Linux fallback for chroma-key-green.ps1 using sharp.
 * Usage: node scripts/chroma-key-green-sharp.mjs <input.png> [output.png]
 */
import sharp from "sharp";

const [input, output = input] = process.argv.slice(2);
if (!input) {
  console.error("Usage: node scripts/chroma-key-green-sharp.mjs <input.png> [output.png]");
  process.exit(1);
}

const GreenMinG = 160;
const GreenMaxRB = 110;
const GreenDelta = 50;
const AlphaCutoff = 80;
const DespillStrength = 0.95;

const { data, info } = await sharp(input).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
const { width, height, channels } = info;
const out = Buffer.from(data);
let keyed = 0;

for (let i = 0; i < out.length; i += channels) {
  const r = out[i];
  const g = out[i + 1];
  const b = out[i + 2];
  const a = out[i + 3];
  const isGreen =
    g >= GreenMinG &&
    r <= GreenMaxRB &&
    b <= GreenMaxRB &&
    g - r >= GreenDelta &&
    g - b >= GreenDelta;

  if (isGreen) {
    const closeness = Math.min(1, Math.max(0, (g - Math.max(r, b) - GreenDelta) / 100));
    const alpha = Math.round(a * (1 - closeness));
    if (alpha < AlphaCutoff) {
      out[i] = 0;
      out[i + 1] = 0;
      out[i + 2] = 0;
      out[i + 3] = 0;
      keyed++;
    } else {
      const despill = Math.min(g, 255 - alpha);
      out[i + 1] = Math.max(r, Math.max(b, g - Math.round(despill * DespillStrength)));
      out[i + 3] = alpha;
    }
  }
}

for (let i = 0; i < out.length; i += channels) {
  const a = out[i + 3];
  if (a < 8) continue;
  const r = out[i];
  const g = out[i + 1];
  const b = out[i + 2];
  const maxRB = Math.max(r, b);
  const avgRB = (r + b) / 2;
  let ng = g;
  if (g > maxRB + 2) {
    ng = maxRB;
  } else if (g - r >= 6 && g - b >= 6 && g >= 70) {
    ng = Math.round(avgRB);
  }
  if (ng !== g) {
    out[i + 1] = ng;
  }
}

await sharp(out, { raw: { width, height, channels } }).png().toFile(output);
console.log(`chroma-key: ${input} -> ${output} (${keyed} pixels keyed)`);
