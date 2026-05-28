#!/usr/bin/env node
import { fal } from '@fal-ai/client';
import { File } from 'node:buffer';
import { readFileSync } from 'node:fs';
import { access, mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const MODEL_ID = 'fal-ai/kling-video/o1/standard/image-to-video';
const VALID_DURATIONS = new Set(['3', '4', '5', '6', '7', '8', '9', '10']);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

/**
 * Load the prompt body from a markdown file under scripts/prompts/.
 * Convention: the prompt body is everything after the `## prompt` heading,
 * trimmed of surrounding whitespace. Header + meta block above are ignored.
 */
function loadPromptFromMarkdown(filename) {
  const filePath = path.join(__dirname, 'prompts', filename);
  const text = readFileSync(filePath, 'utf8');
  const marker = /^##\s+prompt\s*$/m;
  const match = marker.exec(text);
  if (!match) {
    throw new Error(`Prompt marker "## prompt" not found in ${filename}`);
  }
  const body = text.slice(match.index + match[0].length);
  return body.replace(/^\s*\n/, '').replace(/\s+$/, '');
}

const defaults = {
  start: 'generated-images/hero-keyframes-v2/02_front_shark_no_tank.png',
  mid: 'generated-images/hero-keyframes-v2/03_front_empty_frame_no_water.png',
  end: 'generated-images/hero-keyframes-v2/04_front_frame_water_filled_water_overlay.png',
  outDir: 'generated-videos/hero-motion-kling-o1',
  duration: '5',
  mode: 'vitrine-fill',
};

const prompts = {
  vitrineForms: loadPromptFromMarkdown('kling-vitrine-forms.md'),

  waterFills: loadPromptFromMarkdown('kling-water-fills.md'),

  oneShot: `Use @Image1 as the exact first frame and @Image2 as the exact last frame.

Locked-off front-facing clinical museum object shot on a pure white catalogue background. The preserved shark remains fixed in the exact same frontal pose, scale, anatomy, open mouth, fins, and unsettling taxidermy texture. Do not morph the shark.

Create one continuous physical transition: first a portrait-oriented Damien Hirst-style vitrine forms around the shark with thick white outer frame, square inner window, deep glass tunnel perspective, side glass planes, angled inner corners, rivet-like round details, smaller rear rectangle, and heavier bottom plinth. Then blue-green formaldehyde liquid fills the chamber from the lower/back area until the shark is fully submerged behind the front glass.

The water must read as real volume, not a flat blue overlay: cyan-green absorption over the shark, softened contrast, slight haze, subtle suspended particles, glass thickness, and mild refraction. Camera remains completely still. No zoom, no rotation, no pan, no gallery floor, no wall, no people, no labels, no text, no watermark.`,

  mouthToPortrait: loadPromptFromMarkdown('kling-mouth-to-portrait.md'),
};

function resolveProjectPath(value) {
  return path.isAbsolute(value) ? value : path.resolve(rootDir, value);
}

function toProjectRelative(value) {
  return path.relative(rootDir, value);
}

function parseArgs(argv) {
  const options = { ...defaults, oneShot: false, dryRun: false };

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--') continue;

    const next = () => {
      i += 1;
      if (!argv[i]) throw new Error(`Missing value for ${arg}`);
      return argv[i];
    };

    if (arg === '--start') options.start = next();
    else if (arg === '--mid') options.mid = next();
    else if (arg === '--end') options.end = next();
    else if (arg === '--out-dir') options.outDir = next();
    else if (arg === '--duration') options.duration = next();
    else if (arg === '--mode') options.mode = next();
    else if (arg === '--one-shot') options.oneShot = true;
    else if (arg === '--dry-run') options.dryRun = true;
    else if (arg === '--help' || arg === '-h') {
      printHelp();
      process.exit(0);
    } else {
      throw new Error(`Unknown argument: ${arg}`);
    }
  }

  if (!VALID_DURATIONS.has(String(options.duration))) {
    throw new Error(`Invalid duration "${options.duration}". Use one of: ${[...VALID_DURATIONS].join(', ')}`);
  }

  if (!['vitrine-fill', 'mouth-to-portrait'].includes(options.mode)) {
    throw new Error(`Invalid mode "${options.mode}". Use "vitrine-fill" or "mouth-to-portrait".`);
  }

  return {
    ...options,
    duration: String(options.duration),
    start: resolveProjectPath(options.start),
    mid: resolveProjectPath(options.mid),
    end: resolveProjectPath(options.end),
    outDir: resolveProjectPath(options.outDir),
  };
}

function printHelp() {
  console.log(`Generate Hirst shark hero motion with Kling O1 Standard via fal.ai.

Usage:
  pnpm generate:hero-motion
  pnpm generate:hero-motion -- --one-shot
  pnpm generate:hero-motion -- --duration 7 --dry-run

Default two-step sequence:
  1. 02_front_shark_no_tank.png -> 03_front_empty_frame_no_water.png
  2. 03_front_empty_frame_no_water.png -> 04_front_frame_water_filled_water_overlay.png

Options:
  --start <path>       First frame image
  --mid <path>         Midpoint image for default two-step mode
  --end <path>         Last frame image
  --out-dir <path>     Output folder
  --duration <3-10>    Clip duration in seconds, default 5
  --mode <mode>        vitrine-fill or mouth-to-portrait
  --one-shot           Generate one clip directly from start to end
  --dry-run            Print planned prompts and inputs without calling fal.ai
`);
}

async function loadEnvFile(filePath) {
  try {
    const text = await readFile(filePath, 'utf8');
    const env = {};

    for (const rawLine of text.split(/\r?\n/)) {
      const line = rawLine.trim();
      if (!line || line.startsWith('#')) continue;

      const clean = line.startsWith('export ') ? line.slice(7).trim() : line;
      const index = clean.indexOf('=');
      if (index === -1) continue;

      const key = clean.slice(0, index).trim();
      let value = clean.slice(index + 1).trim();
      if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1);
      }
      env[key] = value;
    }

    return env;
  } catch (error) {
    if (error.code === 'ENOENT') return {};
    throw error;
  }
}

async function assertFileExists(filePath) {
  try {
    await access(filePath);
  } catch {
    throw new Error(`Input file not found: ${toProjectRelative(filePath)}`);
  }
}

function contentTypeFor(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  if (ext === '.jpg' || ext === '.jpeg') return 'image/jpeg';
  if (ext === '.webp') return 'image/webp';
  if (ext === '.png') return 'image/png';
  return 'application/octet-stream';
}

async function uploadImage(filePath) {
  const bytes = await readFile(filePath);
  const file = new File([bytes], path.basename(filePath), { type: contentTypeFor(filePath) });
  return fal.storage.upload(file);
}

async function downloadVideo(url, outputPath) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to download video: ${response.status} ${response.statusText}`);
  }
  const buffer = Buffer.from(await response.arrayBuffer());
  await writeFile(outputPath, buffer);
}

function formatLogMessage(clipName, message) {
  const clean = String(message || '').trim();
  return clean ? `[${clipName}] ${clean}` : null;
}

async function generateClip({ name, prompt, startPath, endPath, duration, outDir }) {
  console.log(`[${name}] uploading start frame: ${toProjectRelative(startPath)}`);
  const startImageUrl = await uploadImage(startPath);
  console.log(`[${name}] uploading end frame: ${toProjectRelative(endPath)}`);
  const endImageUrl = await uploadImage(endPath);

  console.log(`[${name}] submitting ${MODEL_ID} (${duration}s)`);
  const result = await fal.subscribe(MODEL_ID, {
    input: {
      prompt,
      start_image_url: startImageUrl,
      end_image_url: endImageUrl,
      duration,
    },
    logs: true,
    onQueueUpdate: (update) => {
      if (update.status !== 'IN_PROGRESS' || !Array.isArray(update.logs)) return;
      for (const log of update.logs) {
        const message = formatLogMessage(name, log.message);
        if (message) console.log(message);
      }
    },
  });

  const video = result?.data?.video;
  if (!video?.url) {
    throw new Error(`[${name}] fal.ai result did not include video.url`);
  }

  const outputPath = path.join(outDir, `${name}.mp4`);
  console.log(`[${name}] downloading video`);
  await downloadVideo(video.url, outputPath);

  return {
    name,
    requestId: result.requestId,
    duration,
    prompt,
    startImage: toProjectRelative(startPath),
    endImage: toProjectRelative(endPath),
    startImageUrl,
    endImageUrl,
    videoUrl: video.url,
    outputPath: toProjectRelative(outputPath),
  };
}

function buildPlan(options) {
  if (options.mode === 'mouth-to-portrait') {
    return [
      {
        name: '03-mouth-to-hirst-portrait',
        prompt: prompts.mouthToPortrait,
        startPath: options.start,
        endPath: options.end,
      },
    ];
  }

  if (options.oneShot) {
    return [
      {
        name: '01-one-shot-vitrine-and-water-fill',
        prompt: prompts.oneShot,
        startPath: options.start,
        endPath: options.end,
      },
    ];
  }

  return [
    {
      name: '01-vitrine-forms',
      prompt: prompts.vitrineForms,
      startPath: options.start,
      endPath: options.mid,
    },
    {
      name: '02-water-fills',
      prompt: prompts.waterFills,
      startPath: options.mid,
      endPath: options.end,
    },
  ];
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  const plan = buildPlan(options);

  for (const clip of plan) {
    await assertFileExists(clip.startPath);
    await assertFileExists(clip.endPath);
  }

  if (options.dryRun) {
    console.log(JSON.stringify({
      model: MODEL_ID,
      duration: options.duration,
      outputDir: toProjectRelative(options.outDir),
      clips: plan.map((clip) => ({
        name: clip.name,
        startImage: toProjectRelative(clip.startPath),
        endImage: toProjectRelative(clip.endPath),
        prompt: clip.prompt,
      })),
    }, null, 2));
    return;
  }

  const env = await loadEnvFile(path.join(rootDir, '.env.local'));
  const apiKey = process.env.FAL_AI_KEY || process.env.FAL_KEY || env.FAL_AI_KEY || env.FAL_KEY;
  if (!apiKey) {
    throw new Error('Missing FAL_AI_KEY or FAL_KEY. Add it to .env.local or export it before running.');
  }

  process.env.FAL_KEY = apiKey;
  fal.config({ credentials: apiKey });

  await mkdir(options.outDir, { recursive: true });

  const outputs = [];
  for (const clip of plan) {
    outputs.push(await generateClip({
      ...clip,
      duration: options.duration,
      outDir: options.outDir,
    }));
  }

  const manifestPath = path.join(options.outDir, 'manifest.json');
  await writeFile(manifestPath, JSON.stringify({
    model: MODEL_ID,
    createdAt: new Date().toISOString(),
    clips: outputs,
  }, null, 2));

  console.log(`Saved manifest: ${toProjectRelative(manifestPath)}`);
  for (const output of outputs) {
    console.log(`Saved video: ${output.outputPath}`);
  }
}

main().catch((error) => {
  console.error(error.message || error);
  process.exit(1);
});
