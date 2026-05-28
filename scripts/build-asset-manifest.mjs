/**
 * build-asset-manifest.mjs
 *
 * Storybook Assets 카테고리용 매니페스트 생성기.
 * public/ 와 src/assets/ 의 정적 자산을 스캔하여
 * src/data/assetManifest.json 으로 그룹핑된 매니페스트를 출력한다.
 *
 * 사용:
 *   node scripts/build-asset-manifest.mjs
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.resolve(__dirname, '..');

/**
 * 파일 확장자로 format / kind 결정.
 */
function classifyFile(filePath) {
  const ext = path.extname(filePath).toLowerCase().replace(/^\./, '');
  let kind = 'image';
  if (ext === 'mp4' || ext === 'mov' || ext === 'webm') kind = 'video';
  else if (ext === 'glb' || ext === 'gltf') kind = 'model';
  else if (ext === 'jpg' || ext === 'jpeg' || ext === 'png' || ext === 'webp' || ext === 'gif' || ext === 'svg') kind = 'image';
  return { format: ext, kind };
}

/**
 * 절대 파일 경로 → manifest 표기용 path 변환.
 * public/ 자산은 '/' 시작, src/ 자산은 '/src/...' (Vite import 경로).
 */
function toManifestPath(absPath) {
  const rel = path.relative(PROJECT_ROOT, absPath).split(path.sep).join('/');
  if (rel.startsWith('public/')) {
    return '/' + rel.slice('public/'.length);
  }
  if (rel.startsWith('src/')) {
    return '/' + rel;
  }
  return '/' + rel;
}

/**
 * 파일명 베이스(확장자 제외) 반환.
 */
function baseName(absPath) {
  return path.basename(absPath, path.extname(absPath));
}

/**
 * kebab-case → Title Case.
 */
function kebabToTitle(str) {
  return str
    .split('-')
    .filter(Boolean)
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join(' ');
}

/**
 * Wxxx_YEAR_slug.jpg 형식 베이스명을 사람이 읽을 수 있는 label 로 변환.
 *   W001_1986_untitled-wall-spots → '1986 — Untitled Wall Spots (W001)'
 */
function worksLabel(base) {
  const match = base.match(/^(W\d+[a-z]?)_(\d{4})_(.+)$/);
  if (!match) return kebabToTitle(base);
  const [, code, year, slug] = match;
  return `${year} — ${kebabToTitle(slug)} (${code})`;
}

/**
 * 디렉토리 안의 파일을 (선택적으로 필터링하여) 절대 경로 배열로 반환.
 */
function listFiles(dirRel, predicate) {
  const dirAbs = path.join(PROJECT_ROOT, dirRel);
  if (!fs.existsSync(dirAbs)) return [];
  return fs
    .readdirSync(dirAbs)
    .filter((name) => {
      const abs = path.join(dirAbs, name);
      if (!fs.statSync(abs).isFile()) return false;
      return predicate ? predicate(name) : true;
    })
    .sort()
    .map((name) => path.join(dirAbs, name));
}

/**
 * 단일 파일에서 manifest item 구성.
 */
function buildItem({ absPath, idOverride, labelOverride, usage, sourcePipeline, promptRef = null }) {
  const stat = fs.statSync(absPath);
  const { format, kind } = classifyFile(absPath);
  const id = idOverride || baseName(absPath);
  const label = labelOverride || kebabToTitle(baseName(absPath));
  return {
    id,
    label,
    path: toManifestPath(absPath),
    format,
    kind,
    fileSizeBytes: stat.size,
    usage,
    sourcePipeline,
    promptRef,
  };
}

/**
 * Hero Video — src/assets/video/hirst-scrub-*.mp4
 */
function buildHeroCategory() {
  const targets = ['hirst-scrub-graded.mp4', 'hirst-scrub-mobile.mp4'];
  const items = [];
  for (const name of targets) {
    const abs = path.join(PROJECT_ROOT, 'src/assets/video', name);
    if (!fs.existsSync(abs)) continue;
    items.push(
      buildItem({
        absPath: abs,
        usage: 'HeroSection.jsx — scrub video, desktop/mobile 분기',
        sourcePipeline: 'manual (blender + grade)',
      })
    );
  }
  return { id: 'hero', label: 'Hero Video', items };
}

/**
 * Loading & Worldview Markers — grotesque-bitmap PNG.
 */
function buildLoadingMarkersCategory() {
  const files = listFiles('public/images/hirst/grotesque-bitmap', (n) => n.toLowerCase().endsWith('.png'));
  const items = files.map((abs) =>
    buildItem({
      absPath: abs,
      usage: 'LoadingScreen.jsx fade cycle + TimelineAxis.jsx 축 마커',
      sourcePipeline: 'manual import',
    })
  );
  return { id: 'loading-markers', label: 'Loading & Worldview Markers', items };
}

/**
 * Bridge Motion Videos — grotesque-motion MP4.
 * motion-morality → kling-vitrine-forms.md, 나머지는 TODO.
 */
function buildBridgeMotionCategory() {
  const promptMap = {
    'motion-morality': 'scripts/prompts/kling-vitrine-forms.md',
    // TODO: motion-vanitas / motion-system / motion-ritual 전용 prompt 파일이 작성되면 매핑 업데이트.
    'motion-vanitas': 'scripts/prompts/kling-vitrine-forms.md',
    'motion-system': 'scripts/prompts/kling-vitrine-forms.md',
    'motion-ritual': 'scripts/prompts/kling-vitrine-forms.md',
  };
  const files = listFiles('public/images/hirst/grotesque-motion', (n) => n.toLowerCase().endsWith('.mp4'));
  const items = files.map((abs) => {
    const base = baseName(abs);
    return buildItem({
      absPath: abs,
      usage: 'BridgeSection.jsx — bridgeNarrative 4개 매핑',
      sourcePipeline: 'fal.ai Kling O1 (scripts/generate-hirst-kling-motion.mjs)',
      promptRef: promptMap[base] || null,
    });
  });
  return { id: 'bridge-motion', label: 'Bridge Motion Videos', items };
}

/**
 * Works Thumbnails (Hirst 72) — public/images/hirst/W*.jpg
 */
function buildWorksCategory() {
  const files = listFiles('public/images/hirst', (n) => /^W\d+[a-z]?_/.test(n) && n.toLowerCase().endsWith('.jpg'));
  const items = files.map((abs) => {
    const base = baseName(abs);
    return buildItem({
      absPath: abs,
      idOverride: base,
      labelOverride: worksLabel(base),
      usage: 'HirstWorldviewTimeline.jsx via hirst_works.json',
      sourcePipeline: 'scripts/fetch-hirst-images.mjs',
    });
  });
  return { id: 'works', label: 'Works Thumbnails (Hirst 72)', items };
}

/**
 * Bio Gallery — public/images/hirst/bio/*.jpg
 */
function buildBioCategory() {
  const files = listFiles('public/images/hirst/bio', (n) => n.toLowerCase().endsWith('.jpg'));
  const items = files.map((abs) =>
    buildItem({
      absPath: abs,
      usage: 'Bio section (TimelineCanvas/SpecimenInfographicSection 컨텍스트)',
      sourcePipeline: 'scripts/fetch-bio-specimen-images.mjs',
    })
  );
  return { id: 'bio', label: 'Bio Gallery', items };
}

/**
 * Specimen Infographics — public/images/hirst/specimen-infographic/*.png
 */
function buildSpecimenInfographicCategory() {
  const files = listFiles('public/images/hirst/specimen-infographic', (n) => n.toLowerCase().endsWith('.png'));
  const items = files.map((abs) =>
    buildItem({
      absPath: abs,
      usage: 'SpecimenInfographicSection.jsx',
      sourcePipeline: 'scripts/retint-hirst-specimen-infographic.mjs (duotone retint)',
    })
  );
  return { id: 'specimen-infographic', label: 'Specimen Infographics', items };
}

/**
 * 3D Shark + Reference — public/*.glb + reference 이미지.
 */
function buildShark3dCategory() {
  const items = [];
  const glbTargets = ['crysis_shark.glb', 'shark_hirst_pose.glb'];
  for (const name of glbTargets) {
    const abs = path.join(PROJECT_ROOT, 'public', name);
    if (!fs.existsSync(abs)) continue;
    items.push(
      buildItem({
        absPath: abs,
        usage: 'SharkVitrine.jsx / SharkVitrineScene.jsx',
        sourcePipeline: 'scripts/blender/pose_shark_hirst.py + Crysis 모델',
      })
    );
  }
  const refFiles = listFiles('public/reference/galeocerdo-cuvier', (n) => n.toLowerCase().endsWith('.png'));
  for (const abs of refFiles) {
    items.push(
      buildItem({
        absPath: abs,
        usage: 'SharkVitrine.jsx / SharkVitrineScene.jsx',
        sourcePipeline: 'scripts/blender/pose_shark_hirst.py + Crysis 모델',
      })
    );
  }
  return { id: 'shark-3d', label: '3D Shark + Reference', items };
}

/**
 * Artist Portrait — public/images/hirst/hirst-portrait.jpg
 */
function buildPortraitCategory() {
  const abs = path.join(PROJECT_ROOT, 'public/images/hirst/hirst-portrait.jpg');
  const items = [];
  if (fs.existsSync(abs)) {
    items.push(
      buildItem({
        absPath: abs,
        usage: 'TimelineCanvas.jsx',
        sourcePipeline: 'manual import',
      })
    );
  }
  return { id: 'portrait', label: 'Artist Portrait', items };
}

/**
 * Rothko Reference (50) — public/images/rothko/W*.jpg
 */
function buildRothkoCategory() {
  const files = listFiles('public/images/rothko', (n) => /^W\d+[a-z]?_/.test(n) && n.toLowerCase().endsWith('.jpg'));
  const items = files.map((abs) => {
    const base = baseName(abs);
    return buildItem({
      absPath: abs,
      idOverride: base,
      labelOverride: worksLabel(base),
      usage: 'Rothko 비교 컨텍스트 (TimelineCanvas / extract-rothko-colors)',
      sourcePipeline: 'scripts/fetch-hirst-images.mjs 동일 파이프라인',
    });
  });
  return { id: 'rothko-reference', label: 'Rothko Reference (50)', items };
}

/**
 * 전체 카테고리 어셈블 + totals 계산.
 */
function build() {
  const categories = [
    buildHeroCategory(),
    buildLoadingMarkersCategory(),
    buildBridgeMotionCategory(),
    buildWorksCategory(),
    buildBioCategory(),
    buildSpecimenInfographicCategory(),
    buildShark3dCategory(),
    buildPortraitCategory(),
    buildRothkoCategory(),
  ];

  const byKind = { image: 0, video: 0, model: 0 };
  let itemCount = 0;
  for (const cat of categories) {
    for (const item of cat.items) {
      itemCount += 1;
      if (byKind[item.kind] !== undefined) byKind[item.kind] += 1;
    }
  }

  return {
    version: 1,
    generatedAt: new Date().toISOString(),
    totals: {
      categoryCount: categories.length,
      itemCount,
      byKind,
    },
    categories,
  };
}

function main() {
  const manifest = build();
  const outDir = path.join(PROJECT_ROOT, 'src/data');
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }
  const outPath = path.join(outDir, 'assetManifest.json');
  fs.writeFileSync(outPath, JSON.stringify(manifest, null, 2) + '\n', 'utf8');

  const lines = [];
  lines.push(`[build-asset-manifest] wrote ${path.relative(PROJECT_ROOT, outPath)}`);
  lines.push(`  totals: ${JSON.stringify(manifest.totals)}`);
  for (const cat of manifest.categories) {
    lines.push(`  - ${cat.id} (${cat.label}): ${cat.items.length}`);
  }
  process.stdout.write(lines.join('\n') + '\n');
}

main();
