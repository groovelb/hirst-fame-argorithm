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
import assetManifest from '../../data/assetManifest.json';

export default {
  title: 'Overview/Fame Algorithm/07 Assets',
  parameters: {
    layout: 'padded',
  },
};

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

/** 디렉터리 실측 (du, find 기준. 2026-09-17) */
const DIRECTORY_STATS = [
  { path: 'public/images/hirst/', files: 118, size: '88MB', note: '작품 도판, 표본 도판, 서사 픽토그램, 마커' },
  { path: 'public/images/rothko/', files: 61, size: '14MB', note: '앞선 코드베이스 잔존 도판' },
  { path: 'src/assets/video/', files: 5, size: '112MB', note: '도입 스크럽 영상과 중간 렌더본' },
  { path: 'public/ (루트 glb)', files: 2, size: '1.8MB', note: '상어 3D 모델 2점' },
];

/** public 루트의 3D 모델 2개. 매니페스트 shark-3d 카테고리와 같은 파일이다. */
const MODEL_FILES = [
  { path: 'public/crysis_shark.glb', size: '923KB', inUse: false, basis: 'SharkVitrine.jsx 전용. App 미도달' },
  { path: 'public/shark_hirst_pose.glb', size: '832KB', inUse: false, basis: 'Blender 포즈 결과물. SharkVitrine.jsx 전용' },
];

/** 5MB 를 넘는 파일. 번들에 import 하지 않고 경로만 적는다. */
const LARGE_FILES = [
  { path: 'src/assets/video/hirst-scrub.mp4', size: '33MB', registered: false },
  { path: 'src/assets/video/hirst-scrub-graded.mp4', size: '31MB', registered: true },
  { path: 'src/assets/video/hirst-30fps.mp4', size: '22MB', registered: false },
  { path: 'src/assets/video/hirst.mp4', size: '20MB', registered: false },
  { path: 'src/assets/video/hirst-scrub-mobile.mp4', size: '5.9MB', registered: true },
  { path: 'public/images/rothko/W001_1929_untitled-reclining-nude.jpg', size: '5.9MB', registered: true },
];

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

/** public/ 아래 경로만 스토리북에서 바로 그릴 수 있다 */
const isPublicPath = (path) => path.startsWith('/') && !path.startsWith('/src/');

/**
 * 경로 문자열로 이미지 한 장을 그린다. 번들 import 를 쓰지 않는다.
 *
 * Props:
 * @param {string} path - public 기준 절대 경로 [Required]
 * @param {string} label - 캡션 [Required]
 *
 * Example usage:
 * <PathThumb path="/images/hirst/hirst-portrait.jpg" label="hirst-portrait" />
 */
function PathThumb({ path, label }) {
  return (
    <Stack spacing={ 0.75 }>
      <Box
        sx={ {
          width: '100%',
          backgroundColor: 'grey.100',
          overflow: 'hidden',
          lineHeight: 0,
        } }
      >
        <Box
          component="img"
          src={ path }
          alt={ label }
          loading="lazy"
          sx={ { width: '100%', height: 'auto', display: 'block' } }
        />
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
        { label }
      </Typography>
    </Stack>
  );
}

/** 에셋 매니페스트, 디렉터리 실측, 생성 파이프라인 */
export const Default = {
  render: () => {
    const categories = assetManifest.categories || [];
    const inUse = categories.filter((c) => CATEGORY_USAGE[c.id]?.inUse);
    const unused = categories.filter((c) => !CATEGORY_USAGE[c.id]?.inUse);

    /** 썸네일은 public 경로를 가진 카테고리에서 앞의 몇 장만 */
    const thumbs = inUse
      .flatMap((c) => c.items.filter((it) => isPublicPath(it.path) && it.kind === 'image').slice(0, 2))
      .slice(0, 10);

    return (
      <>
        <DocumentTitle
          title="Assets"
          status="Available"
          note="매니페스트 9카테고리, 디렉터리 실측, 생성 파이프라인 6종"
          brandName="Design System"
          systemName="Fame Algorithm"
          version="1.0"
        />
        <PageContainer>
          <Typography variant="h4" sx={ { fontWeight: 700, mb: 1 } }>
            Assets
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={ { mb: 2 } }>
            <code>src/data/assetManifest.json</code> · 재생성: <code>pnpm build-asset-manifest</code>
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={ { mb: 3 } }>
            에셋 전체 용량이 200MB를 넘어 갤러리를 모두 그리지 않는다. 카테고리 표와 용량 표를 먼저 두고,
            public 경로를 가진 이미지 몇 장만 경로 문자열로 미리 본다. 5MB를 넘는 파일은 번들에 import 하지 않는다.
          </Typography>

          <Box sx={ { mb: 4 } }>
            <Chip label={ `version ${ assetManifest.version }` } size="small" sx={ { mr: 1 } } />
            <Chip label={ `${ assetManifest.totals.categoryCount } categories` } size="small" sx={ { mr: 1 } } />
            <Chip label={ `${ assetManifest.totals.itemCount } items` } size="small" sx={ { mr: 1 } } />
            <Chip label={ `image ${ assetManifest.totals.byKind.image }` } size="small" sx={ { mr: 1 } } />
            <Chip label={ `video ${ assetManifest.totals.byKind.video }` } size="small" sx={ { mr: 1 } } />
            <Chip label={ `model ${ assetManifest.totals.byKind.model }` } size="small" sx={ { mr: 1 } } />
            <Chip label={ `generated ${ assetManifest.generatedAt.slice(0, 10) }` } size="small" />
          </Box>

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

          <SectionTitle title="디렉터리 용량" description="find 와 du 실측. 매니페스트에 없는 파일도 포함한다" />
          <TableContainer sx={ { mb: 4 } }>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell sx={ { fontWeight: 600, width: 260 } }>path</TableCell>
                  <TableCell sx={ { fontWeight: 600, width: 80 } } align="right">files</TableCell>
                  <TableCell sx={ { fontWeight: 600, width: 80 } } align="right">size</TableCell>
                  <TableCell sx={ { fontWeight: 600 } }>비고</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                { DIRECTORY_STATS.map((d) => (
                  <TableRow key={ d.path }>
                    <TableCell sx={ { fontFamily: 'monospace', fontSize: 12 } }>{ d.path }</TableCell>
                    <TableCell sx={ { fontFamily: 'monospace', fontSize: 12 } } align="right">{ d.files }</TableCell>
                    <TableCell sx={ { fontFamily: 'monospace', fontSize: 12 } } align="right">{ d.size }</TableCell>
                    <TableCell sx={ { fontSize: 12, color: 'text.secondary' } }>{ d.note }</TableCell>
                  </TableRow>
                )) }
              </TableBody>
            </Table>
          </TableContainer>

          <SectionTitle title="3D 모델" description={ `${ MODEL_FILES.length }개 · public 루트에 놓여 경로 문자열로 불린다` } />
          <TableContainer sx={ { mb: 4 } }>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell sx={ { fontWeight: 600, width: 280 } }>path</TableCell>
                  <TableCell sx={ { fontWeight: 600, width: 80 } } align="right">size</TableCell>
                  <TableCell sx={ { fontWeight: 600, width: 90 } }>판정</TableCell>
                  <TableCell sx={ { fontWeight: 600 } }>판정 근거</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                { MODEL_FILES.map((m) => (
                  <TableRow key={ m.path }>
                    <TableCell sx={ { fontFamily: 'monospace', fontSize: 12 } }>{ m.path }</TableCell>
                    <TableCell sx={ { fontFamily: 'monospace', fontSize: 12 } } align="right">{ m.size }</TableCell>
                    <TableCell sx={ { fontSize: 12 } }>{ m.inUse ? 'In Use' : 'Unused' }</TableCell>
                    <TableCell sx={ { fontSize: 12, color: 'text.secondary' } }>{ m.basis }</TableCell>
                  </TableRow>
                )) }
              </TableBody>
            </Table>
          </TableContainer>

          <SectionTitle
            title="5MB 초과 파일"
            description={ `${ LARGE_FILES.length }개 · 이 스토리는 경로 문자열만 적고 번들에 넣지 않는다` }
          />
          <TableContainer sx={ { mb: 4 } }>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell sx={ { fontWeight: 600 } }>path</TableCell>
                  <TableCell sx={ { fontWeight: 600, width: 80 } } align="right">size</TableCell>
                  <TableCell sx={ { fontWeight: 600, width: 130 } }>manifest 등록</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                { LARGE_FILES.map((f) => (
                  <TableRow key={ f.path }>
                    <TableCell sx={ { fontFamily: 'monospace', fontSize: 12 } }>{ f.path }</TableCell>
                    <TableCell sx={ { fontFamily: 'monospace', fontSize: 12 } } align="right">{ f.size }</TableCell>
                    <TableCell sx={ { fontSize: 12, color: f.registered ? 'text.secondary' : 'warning.main' } }>
                      { f.registered ? '등록됨' : '미등록 (중간 렌더본)' }
                    </TableCell>
                  </TableRow>
                )) }
              </TableBody>
            </Table>
          </TableContainer>

          <SectionTitle
            title="미리보기"
            description={ `${ thumbs.length }장 · public 경로를 가진 이미지만 경로 문자열로 그린다` }
          />
          <Grid container spacing={ 2 } sx={ { mb: 4 } }>
            { thumbs.map((it) => (
              <Grid key={ it.id } size={ { xs: 6, sm: 4, md: 3 } }>
                <PathThumb path={ it.path } label={ it.path } />
              </Grid>
            )) }
          </Grid>
          <Typography variant="body2" color="text.secondary" sx={ { mb: 4 } }>
            도입 스크럽 영상과 서사 픽토그램 영상은 용량 때문에 여기서 재생하지 않는다.
            경로는 위 표에 있고, 생성 경로는 아래 파이프라인 절에 있다.
          </Typography>

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
      </>
    );
  },
};
