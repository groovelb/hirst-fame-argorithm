import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';
import { TOKENS } from '../src/styles/themes/tokens.js';

const ROOT = process.cwd();
const SOURCE_DIR = path.join(ROOT, 'public/images/hirst/specimen-infographic');
const BACKUP_DIR = path.join(SOURCE_DIR, '_warm-original');

const TARGET_FILES = [
  'specimen-butterfly-reliquary.png',
  'specimen-shark-vitrine.png',
  'specimen-ruminant-plate.png',
  'specimen-pig.png',
  'specimen-zebra.png',
  'specimen-dove.png',
  'specimen-cockerel.png',
  'specimen-uncounted-cycle.png',
];

function hexToRgb(hex) {
  return hex
    .replace('#', '')
    .match(/.{1,2}/g)
    .map((value) => parseInt(value, 16));
}

const PALETTE = {
  background: hexToRgb(TOKENS.bg.page),
  coolWhite: hexToRgb(TOKENS.text.onDark),
  primaryBlue: hexToRgb(TOKENS.accent.brand),
  primaryLight: hexToRgb(TOKENS.accent.brandLight),
};

function clamp(value, min = 0, max = 255) {
  return Math.max(min, Math.min(max, value));
}

function mix(a, b, t) {
  return a + (b - a) * t;
}

function luma(r, g, b) {
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function mapPixel(r, g, b) {
  const y = luma(r, g, b);
  const normalized = clamp((y - 8) / 247, 0, 1);
  const etched = Math.pow(normalized, 1.12);
  const midAccent = Math.sin(etched * Math.PI);
  const blueAmount = 0.2 * etched + 0.18 * midAccent;
  const whiteAmount = etched;

  const base = PALETTE.background.map((bgChannel, index) => {
    const coolWhite = PALETTE.coolWhite[index];
    const primaryBlue = PALETTE.primaryBlue[index];
    const primaryLight = PALETTE.primaryLight[index];
    const line = mix(bgChannel, coolWhite, whiteAmount);
    const blue = mix(primaryBlue, primaryLight, etched);
    return mix(line, blue, blueAmount);
  });

  return [
    Math.round(clamp(base[0])),
    Math.round(clamp(base[1])),
    Math.round(clamp(base[2])),
  ];
}

async function ensureBackup(filePath, backupPath) {
  await fs.mkdir(path.dirname(backupPath), { recursive: true });
  try {
    await fs.access(backupPath);
  } catch {
    await fs.copyFile(filePath, backupPath);
  }
}

async function retintFile(filename) {
  const filePath = path.join(SOURCE_DIR, filename);
  const backupPath = path.join(BACKUP_DIR, filename);
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
    output[index + 3] = data[index + 3];
  }

  await sharp(output, {
    raw: {
      width: info.width,
      height: info.height,
      channels: 4,
    },
  })
    .png({ compressionLevel: 9 })
    .toFile(filePath);

  return filePath;
}

async function main() {
  const changed = [];
  for (const filename of TARGET_FILES) {
    changed.push(await retintFile(filename));
  }
  console.log(`Retinted ${ changed.length } specimen infographic images.`);
  changed.forEach((filePath) => console.log(path.relative(ROOT, filePath)));
  console.log(`Warm originals are backed up in ${ path.relative(ROOT, BACKUP_DIR) }.`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
