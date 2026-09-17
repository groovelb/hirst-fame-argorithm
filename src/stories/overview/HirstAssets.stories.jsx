import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import {
  DocumentTitle,
  PageContainer,
  SectionTitle,
} from '../../components/storybookDocumentation';
import { DocSurface } from '../fixtures/DocSurface.jsx';
import assetManifest from '../../data/assetManifest.json';
import assetInventory from '../../data/assetInventory.js';

export default {
  title: 'Overview/Fame Algorithm/07 Assets',
  parameters: {
    layout: 'padded',
  },
};

/**
 * src/assets 아래 파일의 번들 URL 맵.
 * public/ 은 url 필드를 그대로 쓰고, src/assets 는 이 맵으로 실제 경로를 얻는다.
 */
const SRC_ASSET_URLS = import.meta.glob(
  '../../assets/**/*.{png,jpg,jpeg,webp,gif,svg,avif,mp4,webm,mp3,wav,woff,woff2}',
  { eager: true, query: '?url', import: 'default' },
);

/** 이 크기를 넘는 영상은 메타데이터도 미리 받지 않는다 */
const HEAVY_VIDEO_BYTES = 5 * 1024 * 1024;

/**
 * 카테고리별 사용 판정.
 *
 * 판정 방법: manifest 의 usage 가 가리키는 소비 파일이
 * `grep -rl 'assets/video\|/images/' src` 결과에 있고,
 * 그 파일이 App.jsx 에서 도달하는가로 갈랐다. 판정 근거는 아래 표의 basis 칸.
 */
const CATEGORY_USAGE = {
  hero: { inUse: true, basis: 'HeroSection.jsx (grep 적중, App 도달)' },
  'loading-markers': { inUse: true, basis: 'LoadingScreen.jsx · TimelineAxis.jsx (grep 적중)' },
  'bridge-motion': { inUse: true, basis: 'bridgeNarrative.js (grep 적중)' },
  works: { inUse: true, basis: 'TimelineCanvas.jsx (grep 적중). manifest 의 usage 표기는 미연결 컴포넌트를 가리킨다' },
  bio: { inUse: true, basis: 'TimelineCanvas.jsx · SpecimenInfographicSection.jsx (grep 적중)' },
  'specimen-infographic': { inUse: true, basis: 'SpecimenInfographicSection.jsx (grep 적중)' },
  'shark-3d': { inUse: false, basis: 'SharkVitrine.jsx 는 grep 미적중이고 App 에서 도달하지 않는다' },
  portrait: { inUse: true, basis: 'TimelineCanvas.jsx (grep 적중)' },
  'rothko-reference': { inUse: false, basis: '앞선 코드베이스 잔존. 색 추출 스크립트 전용' },
};

/** 인벤토리 폴더별 한 줄 설명. 키는 summary 의 폴더 키. */
const FOLDER_NOTES = {
  'public/(root)': '상어 3D 모델 2점과 파비콘',
  'public/images/hirst': '작품 도판 72점과 작가 초상',
  'public/images/hirst/bio': '표본 작품 도판 9점',
  'public/images/hirst/grotesque-bitmap': '대기 화면과 축 마커 4점',
  'public/images/hirst/grotesque-bitmap-rgb-background-backup': '마커 리타이닝 기준 원본',
  'public/images/hirst/grotesque-bitmap-warm-original': '마커 리타이닝 전 따뜻한 원본',
  'public/images/hirst/grotesque-motion': '서사 장 픽토그램 영상 4점',
  'public/images/hirst/specimen-infographic': '표본 인포그래픽 도판 9점',
  'public/images/hirst/specimen-infographic/_warm-original': '표본 도판 리타이닝 전 원본',
  'public/images/rothko': '앞선 코드베이스 잔존 도판',
  'public/reference/galeocerdo-cuvier': '상어 모델링 참고 사진',
  'src/assets/(root)': '기본 로고',
  'src/assets/reference': '모델링 참고 이미지',
  'src/assets/video': '도입 스크럽 영상과 중간 렌더본',
};

/** 07 안으로 옮겨온 자산 생성 파이프라인 6종 (이전 Overview/Asset Pipelines) */
const PIPELINES = [
  {
    id: 'hirst-fetch',
    name: 'Hirst works fetch',
    script: 'scripts/fetch-hirst-images.mjs',
    rerun: '수동: node scripts/fetch-hirst-images.mjs',
    inputs: 'src/data/hirst/hirst_works.json',
    outputs: 'public/images/hirst/W***.jpg (72개)',
    external: 'Wikipedia / Commons / Bing / Google Image Search (auth 없음)',
    notes:
      '다중 소스 후보 랭킹 후 MD5 hash dedupe + banned hash list. 프롬프트 패턴: scripts/prompts/image-search-queries.md',
  },
  {
    id: 'bio-fetch',
    name: 'Bio specimen fetch',
    script: 'scripts/fetch-bio-specimen-images.mjs',
    rerun: '수동: node scripts/fetch-bio-specimen-images.mjs',
    inputs: '하드코딩 TARGETS 배열',
    outputs:
      'public/images/hirst/bio/*.jpg (9개) + src/data/hirst/hirst_bio_artwork_images.json',
    external: 'Wikipedia / Commons / Bing / Google Image Search',
    notes:
      '같은 쿼리 랭킹 알고리즘 재사용. 프롬프트 패턴: scripts/prompts/image-search-queries.md',
  },
  {
    id: 'specimen-retint',
    name: 'Specimen infographic retint',
    script: 'scripts/retint-hirst-specimen-infographic.mjs',
    rerun: '수동: node scripts/retint-hirst-specimen-infographic.mjs',
    inputs: 'public/images/hirst/specimen-infographic/_warm-original/ (백업)',
    outputs: 'public/images/hirst/specimen-infographic/*.png (9개, in-place)',
    external: '없음 (sharp만)',
    notes:
      '듀오톤: ref 이미지의 dark/bright 5% 평균 RGB로 luma 매핑. 원본은 _warm-original/에 백업되어 재실행 가능.',
  },
  {
    id: 'kling-motion',
    name: 'Kling motion generation',
    script: 'scripts/generate-hirst-kling-motion.mjs',
    rerun:
      'npm run generate:hero-motion (옵션 --one-shot, --duration, --dry-run)',
    inputs: 'generated-images/hero-keyframes-v2/*.png (Blender 사전 렌더)',
    outputs:
      'generated-videos/hero-motion-kling-o1/*.mp4 를 public/images/hirst/grotesque-motion/ 으로 수동 이동',
    external: 'fal.ai · kling-video / o1 (FAL_AI_KEY or FAL_KEY in .env.local)',
    notes:
      '모드: default(vitrine-fill 2-step) / --one-shot / mouth-to-portrait. 프롬프트: scripts/prompts/kling-vitrine-forms.md, kling-water-fills.md, kling-mouth-to-portrait.md',
  },
  {
    id: 'rothko-colors',
    name: 'Rothko color extraction',
    script: 'scripts/extract-rothko-colors.mjs',
    rerun: 'npm run extract-colors',
    inputs:
      'src/data/rothko/rothko_works.json, public/images/rothko/*.jpg, scripts/rothko-manual-overrides.json',
    outputs:
      'src/data/rothko/rothko_works.json (in-place) + scripts/output/color-extraction-report.html',
    external: '없음',
    notes:
      '수평 밴드 분석 (luma profile + ΔE) + k-means / 전략 셀렉터로 작품별 핵심 색상 추출.',
  },
  {
    id: 'blender-shark',
    name: 'Blender shark pose',
    script: 'scripts/blender/pose_shark_hirst.py',
    rerun: 'Blender CLI / GUI 수동',
    inputs: 'crysis_shark.glb',
    outputs: 'generated-images/hero-keyframes-v2/*.png (Kling 입력 키프레임)',
    external: 'Blender (수동 작업)',
    notes:
      'Kling motion generation 단계의 선행 파이프라인. 포즈 + 카메라 키프레임 렌더링.',
  },
];

/** 바이트를 사람이 읽는 크기로 */
function formatBytes(n) {
  if (!Number.isFinite(n)) {
    return '';
  }
  if (n >= 1024 * 1024) {
    return `${ (n / 1024 / 1024).toFixed(1) }MB`;
  }
  return `${ Math.round(n / 1024) }KB`;
}

/** 인벤토리 항목에서 실제로 불러올 수 있는 주소를 얻는다 */
function srcOf(item) {
  if (item.url) {
    return item.url;
  }
  return SRC_ASSET_URLS[item.importKey] ?? null;
}

/** 폴더 키를 만든다. summary 키와 같은 규칙. */
const folderKey = (item) => `${ item.root }/${ item.folder || '(root)' }`;

/**
 * 이미지 한 장. 원본 비율을 보존하되 격자 높이를 맞춘다.
 *
 * Props:
 * @param {Object} item - assetInventory 항목 [Required]
 *
 * Example usage:
 * <ImageCell item={ item } />
 */
function ImageCell({ item }) {
  const src = srcOf(item);
  return (
    <Stack spacing={ 0.5 }>
      <Box
        sx={ {
          width: '100%',
          aspectRatio: '1 / 1',
          backgroundColor: 'grey.100',
          overflow: 'hidden',
          lineHeight: 0,
        } }
      >
        { src && (
          <Box
            component="img"
            src={ src }
            alt={ item.name }
            loading="lazy"
            sx={ { width: '100%', height: '100%', objectFit: 'contain', display: 'block' } }
          />
        ) }
      </Box>
      <Typography
        variant="caption"
        sx={ {
          fontFamily: 'monospace',
          fontSize: 10,
          color: 'text.secondary',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        } }
      >
        { item.name }
      </Typography>
      <Typography variant="caption" sx={ { fontSize: 9, color: 'text.disabled' } }>
        { formatBytes(item.bytes) }
      </Typography>
    </Stack>
  );
}

/**
 * 영상 한 편. 용량이 큰 것은 메타데이터도 미리 받지 않는다.
 *
 * Props:
 * @param {Object} item - assetInventory 항목 [Required]
 *
 * Example usage:
 * <VideoCell item={ item } />
 */
function VideoCell({ item }) {
  const src = srcOf(item);
  const heavy = item.bytes > HEAVY_VIDEO_BYTES;
  return (
    <Stack spacing={ 0.5 }>
      <Box sx={ { width: '100%', backgroundColor: 'grey.900', lineHeight: 0 } }>
        { src && (
          <Box
            component="video"
            src={ src }
            controls
            muted
            playsInline
            preload={ heavy ? 'none' : 'metadata' }
            sx={ { width: '100%', height: 'auto', display: 'block' } }
          />
        ) }
      </Box>
      <Typography
        variant="caption"
        sx={ { fontFamily: 'monospace', fontSize: 10, color: 'text.secondary' } }
      >
        { item.name }
      </Typography>
      <Typography variant="caption" sx={ { fontSize: 9, color: heavy ? 'warning.main' : 'text.disabled' } }>
        { formatBytes(item.bytes) }{ heavy ? ' · preload none' : '' }
      </Typography>
    </Stack>
  );
}

/** 에셋 매니페스트, 인벤토리 전량 갤러리, 생성 파이프라인 */
export const Default = {
  render: () => {
    const categories = assetManifest.categories || [];
    const inUse = categories.filter((c) => CATEGORY_USAGE[c.id]?.inUse);
    const unused = categories.filter((c) => !CATEGORY_USAGE[c.id]?.inUse);

    const items = assetInventory.items || [];
    const folders = Object.keys(assetInventory.summary || {});
    const byFolder = folders.map((key) => ({
      key,
      stat: assetInventory.summary[key],
      items: items.filter((it) => folderKey(it) === key),
    }));
    const models = items.filter((it) => it.kind === 'model');
    const totalBytes = items.reduce((s, it) => s + (it.bytes || 0), 0);

    return (
      <DocSurface>
        <DocumentTitle
          title="Assets"
          status="Available"
          note="인벤토리 전량 갤러리, 사용 판정, 생성 파이프라인"
          brandName="Design System"
          systemName="Fame Algorithm"
          version="1.0"
        />
        <PageContainer>
          <Typography variant="h4" sx={ { fontWeight: 700, mb: 1 } }>
            Assets
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={ { mb: 2 } }>
            <code>src/data/assetInventory.js</code> (재생성 <code>pnpm generate-assets</code>) ·
            <code>src/data/assetManifest.json</code> (재생성 <code>pnpm build-asset-manifest</code>)
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={ { mb: 3 } }>
            폴더별로 모든 이미지와 영상을 그린다. public 은 경로 문자열, src/assets 는 번들 URL 맵으로 부른다.
            이미지는 지연 로드하고, 5MB를 넘는 영상은 메타데이터도 미리 받지 않는다.
          </Typography>

          <Box sx={ { mb: 4 } }>
            <Chip label={ `files ${ items.length }` } size="small" sx={ { mr: 1 } } />
            <Chip label={ `folders ${ folders.length }` } size="small" sx={ { mr: 1 } } />
            <Chip label={ formatBytes(totalBytes) } size="small" sx={ { mr: 1 } } />
            <Chip label={ `image ${ items.filter((i) => i.kind === 'image').length }` } size="small" sx={ { mr: 1 } } />
            <Chip label={ `video ${ items.filter((i) => i.kind === 'video').length }` } size="small" sx={ { mr: 1 } } />
            <Chip label={ `model ${ models.length }` } size="small" sx={ { mr: 1 } } />
            <Chip label={ `generated ${ String(assetInventory.generatedAt).slice(0, 10) }` } size="small" />
          </Box>

          { byFolder.map(({ key, stat, items: list }) => {
            const images = list.filter((it) => it.kind === 'image');
            const videos = list.filter((it) => it.kind === 'video');
            const others = list.filter((it) => it.kind !== 'image' && it.kind !== 'video');
            return (
              <Box key={ key } sx={ { mb: 6 } }>
                <SectionTitle
                  title={ key }
                  description={ `${ stat.files }개 · ${ formatBytes(stat.bytes) }${ FOLDER_NOTES[key] ? ` · ${ FOLDER_NOTES[key] }` : '' }` }
                />
                { images.length > 0 && (
                  <Grid container spacing={ 1.5 } sx={ { mb: videos.length ? 3 : 0 } }>
                    { images.map((it) => (
                      <Grid key={ it.path } size={ { xs: 4, sm: 3, md: 2 } }>
                        <ImageCell item={ it } />
                      </Grid>
                    )) }
                  </Grid>
                ) }
                { videos.length > 0 && (
                  <Grid container spacing={ 2 }>
                    { videos.map((it) => (
                      <Grid key={ it.path } size={ { xs: 12, sm: 6, md: 4 } }>
                        <VideoCell item={ it } />
                      </Grid>
                    )) }
                  </Grid>
                ) }
                { others.length > 0 && (
                  <TableContainer>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell sx={ { fontWeight: 600, width: 280 } }>path</TableCell>
                          <TableCell sx={ { fontWeight: 600, width: 80 } }>kind</TableCell>
                          <TableCell sx={ { fontWeight: 600, width: 90 } } align="right">size</TableCell>
                          <TableCell sx={ { fontWeight: 600 } }>url</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        { others.map((it) => (
                          <TableRow key={ it.path }>
                            <TableCell sx={ { fontFamily: 'monospace', fontSize: 12 } }>{ it.path }</TableCell>
                            <TableCell sx={ { fontFamily: 'monospace', fontSize: 12 } }>{ it.kind }</TableCell>
                            <TableCell sx={ { fontFamily: 'monospace', fontSize: 12 } } align="right">
                              { formatBytes(it.bytes) }
                            </TableCell>
                            <TableCell sx={ { fontFamily: 'monospace', fontSize: 12, color: 'text.secondary' } }>
                              { it.url ?? '(번들 import)' }
                            </TableCell>
                          </TableRow>
                        )) }
                      </TableBody>
                    </Table>
                  </TableContainer>
                ) }
              </Box>
            );
          }) }

          <SectionTitle
            title="In Use"
            description={ `${ inUse.length }카테고리 · App.jsx 에서 도달하는 화면이 실제로 부른다` }
          />
          <TableContainer sx={ { mb: 4 } }>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell sx={ { fontWeight: 600, width: 170 } }>category</TableCell>
                  <TableCell sx={ { fontWeight: 600, width: 200 } }>label</TableCell>
                  <TableCell sx={ { fontWeight: 600, width: 70 } } align="right">items</TableCell>
                  <TableCell sx={ { fontWeight: 600, width: 80 } } align="right">size</TableCell>
                  <TableCell sx={ { fontWeight: 600 } }>판정 근거</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                { inUse.map((c) => (
                  <TableRow key={ c.id }>
                    <TableCell sx={ { fontFamily: 'monospace', fontSize: 12 } }>{ c.id }</TableCell>
                    <TableCell sx={ { fontSize: 12 } }>{ c.label }</TableCell>
                    <TableCell sx={ { fontFamily: 'monospace', fontSize: 12 } } align="right">
                      { c.items.length }
                    </TableCell>
                    <TableCell sx={ { fontFamily: 'monospace', fontSize: 12 } } align="right">
                      { formatBytes(c.items.reduce((s, it) => s + (it.fileSizeBytes || 0), 0)) }
                    </TableCell>
                    <TableCell sx={ { fontSize: 12, color: 'text.secondary' } }>
                      { CATEGORY_USAGE[c.id]?.basis }
                    </TableCell>
                  </TableRow>
                )) }
              </TableBody>
            </Table>
          </TableContainer>

          <SectionTitle
            title="Unused"
            description={ `${ unused.length }카테고리 · 파일은 있으나 현재 화면이 부르지 않는다` }
          />
          <TableContainer sx={ { mb: 4 } }>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell sx={ { fontWeight: 600, width: 170 } }>category</TableCell>
                  <TableCell sx={ { fontWeight: 600, width: 200 } }>label</TableCell>
                  <TableCell sx={ { fontWeight: 600, width: 70 } } align="right">items</TableCell>
                  <TableCell sx={ { fontWeight: 600, width: 80 } } align="right">size</TableCell>
                  <TableCell sx={ { fontWeight: 600 } }>판정 근거</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                { unused.map((c) => (
                  <TableRow key={ c.id }>
                    <TableCell sx={ { fontFamily: 'monospace', fontSize: 12 } }>{ c.id }</TableCell>
                    <TableCell sx={ { fontSize: 12 } }>{ c.label }</TableCell>
                    <TableCell sx={ { fontFamily: 'monospace', fontSize: 12 } } align="right">
                      { c.items.length }
                    </TableCell>
                    <TableCell sx={ { fontFamily: 'monospace', fontSize: 12 } } align="right">
                      { formatBytes(c.items.reduce((s, it) => s + (it.fileSizeBytes || 0), 0)) }
                    </TableCell>
                    <TableCell sx={ { fontSize: 12, color: 'text.secondary' } }>
                      { CATEGORY_USAGE[c.id]?.basis }
                    </TableCell>
                  </TableRow>
                )) }
              </TableBody>
            </Table>
          </TableContainer>

          <SectionTitle title="3D 모델" description={ `${ models.length }개 · 미리보기 대신 표로 적는다` } />
          <TableContainer sx={ { mb: 4 } }>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell sx={ { fontWeight: 600, width: 280 } }>path</TableCell>
                  <TableCell sx={ { fontWeight: 600, width: 90 } } align="right">size</TableCell>
                  <TableCell sx={ { fontWeight: 600, width: 90 } }>판정</TableCell>
                  <TableCell sx={ { fontWeight: 600 } }>판정 근거</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                { models.map((m) => (
                  <TableRow key={ m.path }>
                    <TableCell sx={ { fontFamily: 'monospace', fontSize: 12 } }>{ m.path }</TableCell>
                    <TableCell sx={ { fontFamily: 'monospace', fontSize: 12 } } align="right">
                      { formatBytes(m.bytes) }
                    </TableCell>
                    <TableCell sx={ { fontSize: 12 } }>Unused</TableCell>
                    <TableCell sx={ { fontSize: 12, color: 'text.secondary' } }>
                      SharkVitrine.jsx 전용. App 에서 도달하지 않는다
                    </TableCell>
                  </TableRow>
                )) }
              </TableBody>
            </Table>
          </TableContainer>

          <SectionTitle title="파이프라인" description={ `${ PIPELINES.length }종 · 정적 자산이 만들어지는 경로` } />
          { PIPELINES.map((p) => (
            <Box key={ p.id } sx={ { mb: 4 } }>
              <Typography variant="h6" sx={ { fontWeight: 700, mb: 0.5 } }>
                { p.name }
              </Typography>
              <Typography
                variant="body2"
                sx={ {
                  fontFamily: 'monospace',
                  fontSize: 12,
                  color: 'text.secondary',
                  mb: 1.5,
                } }
              >
                { p.script }
              </Typography>
              <TableContainer>
                <Table size="small">
                  <TableBody>
                    <TableRow>
                      <TableCell sx={ { fontWeight: 600, width: '20%' } }>Inputs</TableCell>
                      <TableCell sx={ { fontFamily: 'monospace', fontSize: 12 } }>{ p.inputs }</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell sx={ { fontWeight: 600 } }>Outputs</TableCell>
                      <TableCell sx={ { fontFamily: 'monospace', fontSize: 12 } }>{ p.outputs }</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell sx={ { fontWeight: 600 } }>External</TableCell>
                      <TableCell sx={ { fontSize: 13 } }>{ p.external }</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell sx={ { fontWeight: 600 } }>Re-run</TableCell>
                      <TableCell sx={ { fontFamily: 'monospace', fontSize: 12 } }>{ p.rerun }</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell sx={ { fontWeight: 600 } }>Notes</TableCell>
                      <TableCell sx={ { fontSize: 13 } }>{ p.notes }</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          )) }
        </PageContainer>
      </DocSurface>
    );
  },
};
