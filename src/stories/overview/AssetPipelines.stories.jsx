import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Chip from '@mui/material/Chip';
import assetManifest from '../../data/assetManifest.json';
import {
  DocumentTitle,
  PageContainer,
  SectionTitle,
} from '../../components/storybookDocumentation';

export default {
  title: 'Overview/Asset Pipelines',
  parameters: { layout: 'padded' },
};

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
      '다중 소스 후보 랭킹 → MD5 hash dedupe + banned hash list. 프롬프트 패턴: scripts/prompts/image-search-queries.md',
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
      'generated-videos/hero-motion-kling-o1/*.mp4 → public/images/hirst/grotesque-motion/ 수동 이동',
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

/** Documentation */
export const Doc = {
  render: () => (
    <>
      <DocumentTitle
        title="Asset Pipelines"
        status="Available"
        note="자산 생성 파이프라인 6종과 manifest 카테고리 9개 요약"
        brandName="Hirst Story"
        systemName="Asset System"
        version="1.0"
      />
      <PageContainer>
        <Typography variant="h4" sx={ { fontWeight: 700, mb: 1 } }>
          Asset Pipelines
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={ { mb: 4 } }>
          본 사이트가 사용하는 정적 자산은 6개의 파이프라인을 통해 생성되어
          src/data/assetManifest.json에 카탈로그됨. Storybook의 Assets/* 카테고리에서
          카테고리별 갤러리를 탐색할 수 있다.
        </Typography>

        <SectionTitle title="Manifest Summary" />
        <Box sx={ { mb: 2 } }>
          <Chip
            label={ `version ${assetManifest.version}` }
            size="small"
            sx={ { mr: 1 } }
          />
          <Chip
            label={ `${assetManifest.totals.categoryCount} categories` }
            size="small"
            sx={ { mr: 1 } }
          />
          <Chip
            label={ `${assetManifest.totals.itemCount} items` }
            size="small"
            sx={ { mr: 1 } }
          />
          <Chip
            label={ `image ${assetManifest.totals.byKind.image}` }
            size="small"
            sx={ { mr: 1 } }
          />
          <Chip
            label={ `video ${assetManifest.totals.byKind.video}` }
            size="small"
            sx={ { mr: 1 } }
          />
          <Chip
            label={ `model ${assetManifest.totals.byKind.model}` }
            size="small"
          />
        </Box>
        <TableContainer sx={ { mb: 4 } }>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={ { fontWeight: 600 } }>Category ID</TableCell>
                <TableCell sx={ { fontWeight: 600 } }>Label</TableCell>
                <TableCell sx={ { fontWeight: 600 } } align="right">
                  Items
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              { assetManifest.categories.map((c) => (
                <TableRow key={ c.id }>
                  <TableCell sx={ { fontFamily: 'monospace', fontSize: 12 } }>
                    { c.id }
                  </TableCell>
                  <TableCell>{ c.label }</TableCell>
                  <TableCell align="right">{ c.items.length }</TableCell>
                </TableRow>
              )) }
            </TableBody>
          </Table>
        </TableContainer>

        <SectionTitle title="Pipelines" />
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
                    <TableCell sx={ { fontWeight: 600, width: '20%' } }>
                      Inputs
                    </TableCell>
                    <TableCell
                      sx={ { fontFamily: 'monospace', fontSize: 12 } }
                    >
                      { p.inputs }
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={ { fontWeight: 600 } }>Outputs</TableCell>
                    <TableCell
                      sx={ { fontFamily: 'monospace', fontSize: 12 } }
                    >
                      { p.outputs }
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={ { fontWeight: 600 } }>External</TableCell>
                    <TableCell>{ p.external }</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={ { fontWeight: 600 } }>Re-run</TableCell>
                    <TableCell
                      sx={ { fontFamily: 'monospace', fontSize: 12 } }
                    >
                      { p.rerun }
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={ { fontWeight: 600 } }>Notes</TableCell>
                    <TableCell>{ p.notes }</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        )) }
      </PageContainer>
    </>
  ),
};
