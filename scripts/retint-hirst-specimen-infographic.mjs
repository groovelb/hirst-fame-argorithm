import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

/**
 * Retint specimen infographic images to match `mortality-skull.png`:
 *   - sample reference's background (darkest 5% mean) + foreground (brightest 5% mean)
 *   - duotone-map each pixel's luma onto that bg→fg gradient
 *   - read from `_warm-original/` so repeated runs don't compound the shift
 */

const ROOT = process.cwd();
const SOURCE_DIR = path.join(ROOT, 'public/images/hirst/specimen-infographic');
const BACKUP_DIR = path.join(SOURCE_DIR, '_warm-original');
const REFERENCE_IMAGE = path.join(
  ROOT,
  'public/images/hirst/grotesque-bitmap-rgb-background-backup/mortality-skull.png',
);

const TARGET_FILES = [
  'specimen-butterfly-reliquary.png',
  'specimen-shark-vitrine.png',
  'specimen-ruminant-plate.png',
  'specimen-pig.png',
  'specimen-zebra.png',
  'specimen-dove.png',
  'specimen-cockerel.png',
  'specimen-uncounted-cycle.png',
  'specimen-minor-animals-strip.png',
];

function hexToRgb(hex) {
  return hex
    .replace('#', '')
    .match(/.{1,2}/g)
    .map((value) => parseInt(value, 16));
}

function clamp(value, min = 0, max = 255) {
  return Math.max(min, Math.min(max, value));
}

function mix(a, b, t) {
  return a + (b - a) * t;
}

function luma(r, g, b) {
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/**
 * Sample the reference image: collect every opaque pixel sorted by luma,
 * take the mean RGB of the bottom (background) and top (foreground) tails.
 */
async function sampleReferenceTones(filePath, tailRatio = 0.05) {
  const { data, info } = await sharp(filePath)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const pixels = [];
  for (let index = 0; index < data.length; index += 4) {
    const a = data[index + 3];
    if (a < 32) continue;
    const r = data[index];
    const g = data[index + 1];
    const b = data[index + 2];
    pixels.push({ r, g, b, y: luma(r, g, b) });
  }
  if (pixels.length === 0) {
    throw new Error(`Reference image has no opaque pixels: ${ filePath }`);
  }
  pixels.sort((a, b) => a.y - b.y);

  const tailCount = Math.max(1, Math.floor(pixels.length * tailRatio));
  const darkSlice = pixels.slice(0, tailCount);
  const lightSlice = pixels.slice(-tailCount);

  const meanRgb = (slice) => {
    const total = slice.reduce(
      (acc, pixel) => {
        acc.r += pixel.r;
        acc.g += pixel.g;
        acc.b += pixel.b;
        return acc;
      },
      { r: 0, g: 0, b: 0 },
    );
    return [
      Math.round(total.r / slice.length),
      Math.round(total.g / slice.length),
      Math.round(total.b / slice.length),
    ];
  };

  return {
    background: meanRgb(darkSlice),
    foreground: meanRgb(lightSlice),
    info: { width: info.width, height: info.height, totalSampled: pixels.length },
  };
}

function buildPixelMapper({ background, foreground }) {
  return function mapPixel(r, g, b) {
    const y = luma(r, g, b);
    const t = clamp(y / 255, 0, 1);
    const shaped = Math.pow(t, 1.08);
    return [
      Math.round(clamp(mix(background[0], foreground[0], shaped))),
      Math.round(clamp(mix(background[1], foreground[1], shaped))),
      Math.round(clamp(mix(background[2], foreground[2], shaped))),
    ];
  };
}

async function ensureBackup(filePath, backupPath) {
  await fs.mkdir(path.dirname(backupPath), { recursive: true });
  try {
    await fs.access(backupPath);
  } catch {
    await fs.copyFile(filePath, backupPath);
  }
}

async function retintFile(filename, mapPixel) {
  const filePath = path.join(SOURCE_DIR, filename);
  const backupPath = path.join(BACKUP_DIR, filename);
  try {
    await fs.access(filePath);
  } catch {
    return { filename, skipped: true, reason: 'missing source file' };
  }
  await ensureBackup(filePath, backupPath);

  const { data, info } = await sharp(backupPath)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const output = Buffer.allocUnsafe(data.length);
  for (let index = 0; index < data.length; index += 4) {
    const [r, g, b] = mapPixel(data[index], data[index + 1], data[index + 2]);
    output[index] = r;
    output[index + 1] = g;
    output[index + 2] = b;
    output[index + 3] = 255;
  }

  await sharp(output, {
    raw: { width: info.width, height: info.height, channels: 4 },
  })
    .png({ compressionLevel: 9 })
    .toFile(filePath);

  return { filename, filePath, skipped: false };
}

function rgbToHex([r, g, b]) {
  const toHex = (v) => v.toString(16).padStart(2, '0');
  return `#${ toHex(r) }${ toHex(g) }${ toHex(b) }`;
}

async function main() {
  const { background, foreground, info } = await sampleReferenceTones(REFERENCE_IMAGE);
  console.log(`Sampled reference: ${ path.relative(ROOT, REFERENCE_IMAGE) }`);
  console.log(`  size: ${ info.width } x ${ info.height }, opaque pixels: ${ info.totalSampled }`);
  console.log(`  background tone: rgb(${ background.join(', ') }) ${ rgbToHex(background) }`);
  console.log(`  foreground tone: rgb(${ foreground.join(', ') }) ${ rgbToHex(foreground) }`);

  const mapPixel = buildPixelMapper({ background, foreground });
  const results = [];
  for (const filename of TARGET_FILES) {
    results.push(await retintFile(filename, mapPixel));
  }

  const applied = results.filter((r) => !r.skipped);
  const skipped = results.filter((r) => r.skipped);
  console.log(`\nRetinted ${ applied.length } / ${ TARGET_FILES.length } files.`);
  applied.forEach((r) => console.log(`  ok ${ path.relative(ROOT, r.filePath) }`));
  skipped.forEach((r) => console.log(`  - skipped ${ r.filename } (${ r.reason })`));
  console.log(`\nOriginals are backed up in ${ path.relative(ROOT, BACKUP_DIR) }.`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
