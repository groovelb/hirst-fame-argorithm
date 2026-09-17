import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
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
import {
  ASSEMBLY_STEPS,
  REFERENCE_SOURCES_NOTE,
  REFERENCE_FOLDERS,
  RESEARCH_DOCS,
  RESEARCH_SOURCES,
} from './assemblySteps.js';
import assetInventory from '../../data/assetInventory.js';
import worksData from '../../data/hirst/hirst_works.json';
import eventsData from '../../data/hirst/hirst_events.json';
import trendData from '../../../data/hirst-trend-data.json';
import bioData from '../../data/hirst/hirst-bio-specimen-data.js';
import keywordTaxonomy from '../../data/hirst/hirst_keyword_taxonomy.json';
import erasData from '../../data/hirst/hirst_eras.json';
import workBioMap from '../../data/hirst/hirst_work_bio_map.json';
import bioArtworkImages from '../../data/hirst/hirst_bio_artwork_images.json';
import koContent from '../../i18n/locales/ko/content.js';

export default {
  title: 'Overview/Fame Algorithm/08 Domain Knowledge & Research',
  parameters: {
    layout: 'padded',
  },
};

/** 외부에서 가져온 것과 그 경로 */
const EXTERNAL_SOURCES = [
  {
    source: 'Google Trends Worldwide',
    what: '2004-04 부터 2026-05 까지 월별 검색 지수 266포인트',
    how: '수동 내려받기 후 정점과 계기 사건을 손으로 붙임',
    landsIn: 'data/hirst-trend-data.json',
  },
  {
    source: 'Wikipedia / Wikimedia Commons',
    what: '작품 도판 72장',
    how: 'scripts/fetch-hirst-images.mjs (제목 조회, 다중 소스 랭킹, MD5 중복 제거)',
    landsIn: 'public/images/hirst/W*.jpg',
  },
  {
    source: 'Wikipedia / Wikimedia Commons',
    what: '표본 작품 도판 9장',
    how: 'scripts/fetch-bio-specimen-images.mjs (같은 랭킹 알고리즘 재사용)',
    landsIn: 'public/images/hirst/bio/*.jpg + hirst_bio_artwork_images.json',
  },
  {
    source: '경매 도록 · 언론 · 동물보호 단체 성명',
    what: '생물 표본 종별 개체 수와 1차 자료 21건',
    how: '사람이 대조하고 검증 여부를 표시',
    landsIn: 'src/data/hirst/hirst-bio-specimen-data.js',
  },
  {
    source: '앞선 코드베이스 (Rothko 색 컨셉)',
    what: '작품 61점의 색 분포',
    how: 'scripts/extract-rothko-colors.mjs (수평 밴드 분석과 군집)',
    landsIn: 'public/images/rothko/*.jpg · ColorDonutChart 원형',
  },
  {
    source: '생성 모델 (fal.ai Kling, 이미지 생성)',
    what: '서사 픽토그램 영상 4편, 표본 인포그래픽 도판 9장',
    how: 'scripts/generate-hirst-kling-motion.mjs + specimen-infographic-image-plan.md 프롬프트',
    landsIn: 'public/images/hirst/grotesque-motion · specimen-infographic',
  },
];

/** 데이터 규모를 파일에서 직접 센다 */
function countRows() {
  return [
    { label: '작품', value: worksData.works.length, unit: '점' },
    { label: '사건', value: eventsData.events.length, unit: '건' },
    { label: '연대기', value: eventsData.meta.worldview_periods.length, unit: '구획' },
    { label: '검색 지수', value: trendData.trendData.series.length, unit: '개월' },
    { label: '정점', value: trendData.trendData.peaks.length, unit: '개' },
    { label: '사상축 키워드', value: Object.keys(keywordTaxonomy.keywords).length, unit: '개' },
    { label: '표본 종', value: Object.keys(bioData.speciesSummary).length, unit: '종' },
    { label: '1차 자료', value: bioData.sources.length, unit: '건' },
    { label: '연대기 명제', value: erasData.eras.length, unit: '개' },
    { label: '작품 매핑', value: Object.keys(workBioMap.workToBio).length, unit: '건' },
    { label: '보조 도판', value: Object.keys(bioArtworkImages.images).length, unit: '장' },
    { label: '밴드 해설', value: Object.keys(koContent.bandDesc).length, unit: '개' },
    { label: '에셋', value: assetInventory.items.length, unit: '개' },
  ];
}

/**
 * 표 하나를 그린다.
 *
 * Props:
 * @param {Array} columns - [{ key, label, width, mono, dim }] [Required]
 * @param {Array} rows - 행 배열 [Required]
 * @param {function} rowKey - 행 key 생성 [Optional]
 *
 * Example usage:
 * <FlatTable columns={ cols } rows={ rows } rowKey={ (r) => r.name } />
 */
function FlatTable({ columns, rows, rowKey }) {
  return (
    <TableContainer sx={ { mb: 4 } }>
      <Table size="small">
        <TableHead>
          <TableRow>
            { columns.map((c) => (
              <TableCell key={ c.key } sx={ { fontWeight: 600, width: c.width } }>
                { c.label }
              </TableCell>
            )) }
          </TableRow>
        </TableHead>
        <TableBody>
          { rows.map((r, i) => (
            <TableRow key={ rowKey ? rowKey(r) : i }>
              { columns.map((c) => (
                <TableCell
                  key={ c.key }
                  sx={ {
                    fontSize: 12,
                    verticalAlign: 'top',
                    fontFamily: c.mono ? 'monospace' : undefined,
                    color: c.dim ? 'text.secondary' : undefined,
                  } }
                >
                  { c.render ? c.render(r) : String(r[c.key] ?? '') }
                </TableCell>
              )) }
            </TableRow>
          )) }
        </TableBody>
      </Table>
    </TableContainer>
  );
}

/** 레퍼런스 이미지 한 장 */
function RefThumb({ src, label }) {
  return (
    <Stack spacing={ 0.5 }>
      <Box
        sx={ {
          width: '100%',
          aspectRatio: '4 / 3',
          backgroundColor: 'action.disabledBackground',
          overflow: 'hidden',
          lineHeight: 0,
        } }
      >
        { src && (
          <Box
            component="img"
            src={ src }
            alt={ label }
            loading="lazy"
            sx={ { width: '100%', height: '100%', objectFit: 'contain', display: 'block' } }
          />
        ) }
      </Box>
      <Typography
        variant="caption"
        sx={ { fontFamily: 'monospace', fontSize: 10, color: 'text.secondary' } }
      >
        { label }
      </Typography>
    </Stack>
  );
}

/** src/assets 아래 레퍼런스 이미지의 번들 URL */
const SRC_REFERENCE_URLS = import.meta.glob(
  '../../assets/reference/*.{png,jpg,jpeg,webp,avif}',
  { eager: true, query: '?url', import: 'default' },
);

/** 이 프로젝트가 학습시킨 도메인 지식과 그 출처 */
export const Default = {
  render: () => {
    const counts = countRows();
    const refItems = REFERENCE_FOLDERS.flatMap((f) =>
      assetInventory.items.filter((it) => it.root === f.root && it.folder === f.folder));

    return (
      <DocSurface>
        <DocumentTitle
          title="Domain Knowledge & Research"
          status="Available"
          note="무엇을 학습시켰고, 어디서 왔고, 어디로 흘러갔는가"
          brandName="Design System"
          systemName="Fame Algorithm"
          version="1.0"
        />
        <PageContainer>
          <Typography variant="h4" sx={ { fontWeight: 700, mb: 1 } }>
            Domain Knowledge & Research
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={ { mb: 4 } }>
            이 프로젝트는 데미언 허스트의 명성이 만들어진 구조를 다룬다. 그러려면 작품 목록만으로는
            모자라고, 수요 곡선과 경매 기록과 생물 개체 수까지 같은 시간축에 올려야 한다.
            아래는 그 일을 위해 모으고 정리한 것 전부다.
          </Typography>

          <SectionTitle title="규모" description="파일에서 직접 센 수" />
          <Stack direction="row" spacing={ 1 } flexWrap="wrap" useFlexGap sx={ { mb: 4 } }>
            { counts.map((c) => (
              <Chip key={ c.label } label={ `${ c.label } ${ c.value }${ c.unit }` } size="small" />
            )) }
          </Stack>

          <SectionTitle title="학습시킨 데이터" description="무엇을 가르쳤고 어디로 흘러갔는가" />
          <FlatTable
            columns={ [
              { key: 'name', label: '이름', width: 170 },
              { key: 'file', label: '파일', width: 230, mono: true },
              { key: 'taught', label: '가르친 것', width: 300 },
              { key: 'flowsTo', label: '흘러간 곳', dim: true },
              { key: 'seenAt', label: '보이는 곳', width: 150, dim: true },
            ] }
            rows={ RESEARCH_SOURCES }
            rowKey={ (r) => r.name }
          />

          <SectionTitle title="바깥에서 가져온 것" description="외부 소스와 수집 스크립트" />
          <FlatTable
            columns={ [
              { key: 'source', label: '출처', width: 200 },
              { key: 'what', label: '가져온 것', width: 230 },
              { key: 'how', label: '방법', width: 320, mono: true },
              { key: 'landsIn', label: '떨어지는 곳', mono: true, dim: true },
            ] }
            rows={ EXTERNAL_SOURCES }
            rowKey={ (r) => `${ r.source }-${ r.what }` }
          />

          <SectionTitle
            title="레퍼런스 이미지"
            description={ `${ refItems.length }장 · 모델링과 도판 제작의 눈으로 삼은 자료` }
          />
          <Grid container spacing={ 1.5 } sx={ { mb: 2 } }>
            { refItems.map((it) => (
              <Grid key={ it.path } size={ { xs: 6, sm: 4, md: 3 } }>
                <RefThumb
                  src={ it.url ?? SRC_REFERENCE_URLS[it.importKey] }
                  label={ it.name }
                />
              </Grid>
            )) }
          </Grid>
          <Typography variant="body2" color="text.secondary" sx={ { mb: 4 } }>
            { REFERENCE_SOURCES_NOTE }
          </Typography>

          <SectionTitle title="리서치를 지시로 옮긴 문서" description="docs/hirst/" />
          <FlatTable
            columns={ [
              { key: 'file', label: '문서', width: 330, mono: true },
              { key: 'what', label: '담은 것', width: 360 },
              { key: 'result', label: '결과물', dim: true },
            ] }
            rows={ RESEARCH_DOCS }
            rowKey={ (r) => r.file }
          />

          <SectionTitle title="조립 순서" description="리서치에서 랜딩까지 다섯 단계" />
          { ASSEMBLY_STEPS.map((step) => (
            <Box
              key={ step.id }
              sx={ {
                mb: 3,
                p: 2.5,
                border: '1px solid',
                borderColor: 'divider',
              } }
            >
              <Stack direction="row" spacing={ 1 } alignItems="center" sx={ { mb: 1 } }>
                <Chip label={ step.order } size="small" />
                <Typography variant="subtitle1" sx={ { fontWeight: 700 } }>
                  { step.title }
                </Typography>
                <Box
                  component="a"
                  href={ `?path=/story/${ step.storyId }` }
                  target="_top"
                  sx={ { fontSize: 12, color: 'primary.light' } }
                >
                  { step.storyLabel }
                </Box>
              </Stack>
              <Typography variant="body2" sx={ { mb: 1.5 } }>
                { step.what }
              </Typography>
              <Typography variant="caption" sx={ { display: 'block', color: 'text.secondary', mb: 0.5 } }>
                나온 것
              </Typography>
              { step.outputs.map((o) => (
                <Typography
                  key={ o }
                  variant="caption"
                  sx={ { display: 'block', fontFamily: 'monospace', fontSize: 11, color: 'text.secondary' } }
                >
                  { o }
                </Typography>
              )) }
              { step.scripts.length > 0 && (
                <>
                  <Typography variant="caption" sx={ { display: 'block', color: 'text.secondary', mt: 1, mb: 0.5 } }>
                    쓴 스크립트
                  </Typography>
                  { step.scripts.map((s) => (
                    <Typography
                      key={ s }
                      variant="caption"
                      sx={ { display: 'block', fontFamily: 'monospace', fontSize: 11, color: 'text.secondary' } }
                    >
                      { s }
                    </Typography>
                  )) }
                </>
              ) }
            </Box>
          )) }
        </PageContainer>
      </DocSurface>
    );
  },
};
