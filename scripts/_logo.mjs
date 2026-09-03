// Rebuild the Anjoom logo with a real alpha channel from the flattened JPEG.
//
// The naive approach fails twice over:
//   - deleting white globally erases the white script in the wordmark;
//   - flooding white from the edges also erases it, because the white halo
//     around the cloud bridges the outside background and the letters.
//
// So: protect any light pixel sitting close to the logo's saturated cyan/blue.
// That turns the halo into a wall the flood cannot cross, the letters stay
// sealed inside it, and the checkerboard — which is nowhere near a saturated
// colour — clears normally.
import sharp from "sharp";

const [, , SRC, OUT] = process.argv;
const HALO = 11; // px around saturated colour treated as part of the mark

const { data, info } = await sharp(SRC).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
const { width: w, height: h, channels: ch } = info;
const N = w * h;

const light = new Uint8Array(N);
const sat = new Uint8Array(N);
for (let p = 0; p < N; p++) {
  const i = p * ch;
  const r = data[i],
    g = data[i + 1],
    b = data[i + 2];
  const max = Math.max(r, g, b),
    min = Math.min(r, g, b);
  if (min > 190 && max - min < 30) light[p] = 1;
  if (max - min > 45) sat[p] = 1; // cyan and blue, not the greys
}

// Chamfer distance transform of the saturated mask. A square box filter here
// leaves stepped, blocky edges around the strapline; measuring real distance
// keeps the halo round and following the letters.
const INF = 1e9;
const dist = new Float64Array(N);
for (let p = 0; p < N; p++) dist[p] = sat[p] ? 0 : INF;
const relax = (p, q, cost) => {
  const d = dist[q] + cost;
  if (d < dist[p]) dist[p] = d;
};
for (let y = 0; y < h; y++) {
  for (let x = 0; x < w; x++) {
    const p = y * w + x;
    if (x > 0) relax(p, p - 1, 1);
    if (y > 0) relax(p, p - w, 1);
    if (x > 0 && y > 0) relax(p, p - w - 1, Math.SQRT2);
    if (x < w - 1 && y > 0) relax(p, p - w + 1, Math.SQRT2);
  }
}
for (let y = h - 1; y >= 0; y--) {
  for (let x = w - 1; x >= 0; x--) {
    const p = y * w + x;
    if (x < w - 1) relax(p, p + 1, 1);
    if (y < h - 1) relax(p, p + w, 1);
    if (x < w - 1 && y < h - 1) relax(p, p + w + 1, Math.SQRT2);
    if (x > 0 && y < h - 1) relax(p, p + w - 1, Math.SQRT2);
  }
}
const protectedMask = new Uint8Array(N);
for (let p = 0; p < N; p++) protectedMask[p] = dist[p] <= HALO ? 1 : 0;

const seen = new Uint8Array(N);
const stack = [];
for (let x = 0; x < w; x++) stack.push(x, (h - 1) * w + x);
for (let y = 0; y < h; y++) stack.push(y * w, y * w + w - 1);

let cleared = 0;
while (stack.length) {
  const p = stack.pop();
  if (seen[p]) continue;
  seen[p] = 1;
  if (!light[p] || protectedMask[p]) continue;
  data[p * ch + 3] = 0;
  cleared++;
  const x = p % w,
    y = (p / w) | 0;
  if (x > 0) stack.push(p - 1);
  if (x < w - 1) stack.push(p + 1);
  if (y > 0) stack.push(p - w);
  if (y < h - 1) stack.push(p + w);
}
console.log(`${w}x${h} — cleared ${((cleared / N) * 100).toFixed(1)}% to transparent`);

const INSET = 4; // the source is a screenshot and carries a hairline frame
const trimmed = await sharp(data, { raw: { width: w, height: h, channels: ch } })
  .trim({ threshold: 1 })
  .png()
  .toBuffer({ resolveWithObject: true });

await sharp(trimmed.data)
  .extract({
    left: INSET,
    top: INSET,
    width: trimmed.info.width - INSET * 2,
    height: trimmed.info.height - INSET * 2,
  })
  .resize({ width: 640, withoutEnlargement: true })
  .png()
  .toFile(OUT);
console.log("wrote", OUT);
