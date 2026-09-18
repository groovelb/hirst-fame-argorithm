import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
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
import assetManifest from '../../data/assetManifest.json';
import worksData from '../../data/hirst/hirst_works.json';
import bioData from '../../data/hirst/hirst-bio-specimen-data.js';
import koContent from '../../i18n/locales/ko/content.js';
import { BRIDGE_SECTIONS } from '../../components/templates/bridgeNarrative.js';
import { BAND_IMAGE_SRC, BAND_ORDER } from '../../components/timeline/bandMeta.js';
import specimenPlanRaw from '../../../docs/hirst/specimen-infographic-image-plan.md?raw';
import klingVitrineRaw from '../../../scripts/prompts/kling-vitrine-forms.md?raw';
import klingWaterRaw from '../../../scripts/prompts/kling-water-fills.md?raw';
import klingMouthRaw from '../../../scripts/prompts/kling-mouth-to-portrait.md?raw';
import klingRunManifest from '../../../generated-videos/hero-motion-kling-o1/manifest.json';

export default {
  title: 'Overview/Fame Algorithm/09 Concept & Flow',
  parameters: {
    layout: 'padded',
  },
};

/**
 * 웨비나 슬라이드(webinar04 cases.js, content.js)에서 그대로 옮긴 컨셉.
 * 값은 슬라이드가 원본이고 이 페이지는 인용만 한다.
 */
const CONCEPT = {
  experiment: 'Video storytelling',
  subtitle: '구조화된 데이터를 비디오 스토리텔링까지 확장',
  approach: '재료 먼저',
  frame: { name: '데이터 모델', oneLiner: '등장 요소를 데이터로 적으면 화면은 따라옵니다' },
  desc: '데미언 허스트의 연대기와 작품 특징에서 컨셉을 도출하고, 키 비주얼·이미지·영상까지 Codex와 fal.ai로 제작',
};

/** 허스트 데이터 폴더의 파일 목록. 개수를 손으로 쓰지 않으려고 파일에서 센다. */
const HIRST_DATA_FILES = import.meta.glob('../../data/hirst/*.{json,js}');

/** 기획에서 화면까지 다섯 단계. story 는 index.json 의 id (MDX 문서는 --docs). */
const FLOW_ROWS = [
  {
    stage: '기획',
    decided: '명성을 작가의 생애가 아니라 수요와 수치의 구조로 읽힌다',
    left: 'docs/hirst/01-project-summary.md 1·4.2·5절: 대상 7종과 과업 4개',
    seenLabel: '01 Project Summary',
    story: 'overview-fame-algorithm-01-project-summary--docs',
  },
  {
    stage: 'UX',
    decided: '대상 7종을 전부 정적 데이터 모델로 확정하고 서버를 두지 않는다',
    left: 'docs/hirst/02-ux-flow.md 3·5절 · src/data/hirst/*.json · data/hirst-trend-data.json',
    seenLabel: '02 UX Flow',
    story: 'overview-fame-algorithm-02-ux-flow--docs',
  },
  {
    stage: '비주얼 디렉션',
    decided: '지면은 흰 상태와 검은 상태 둘뿐. 에셋 유형 5종마다 LOOK 키워드 한 줄',
    left: 'docs/hirst/03-visual-direction.md 4절 · src/styles/themes/tokens.js',
    seenLabel: '03 Visual Direction',
    story: 'overview-fame-algorithm-03-visual-direction--docs',
  },
  {
    stage: '재료 준비',
    decided: '작품 도판은 공개 자료에서 수집하고, 해설 도판과 모션은 생성한다',
    left: 'scripts/fetch-*.mjs · docs/hirst/specimen-infographic-image-plan.md · scripts/prompts/kling-*.md',
    seenLabel: '07 Assets',
    story: 'overview-fame-algorithm-07-assets--default',
  },
  {
    stage: '화면',
    decided: '스크롤이 영상 시간이 되고, 관점 카드마다 반복 영상이 붙는다',
    left: 'HeroSection.jsx · VideoScrubbing.jsx · BridgeSection.jsx · WorldviewTimeline.jsx',
    seenLabel: 'Page / LandingPage',
    story: 'page-landingpage--default',
  },
];

/** C-5 증거 항목. status 는 '있음' | '파생' | '없음'. */
const EVIDENCE_ROWS = [
  {
    id: 'E1',
    item: '구조화 데이터 (작품·사건·검색 관심·표본·시대·키워드)',
    source: `src/data/hirst/ ${ Object.keys(HIRST_DATA_FILES).length }개 파일 · data/hirst-trend-data.json`,
    status: '있음',
    note: '규모 수치는 08 페이지의 규모 칩에 있다. 여기서는 세지 않는다',
  },
  {
    id: 'E2',
    item: '데이터 수집 스크립트와 출처',
    source: 'scripts/fetch-hirst-images.mjs · fetch-bio-specimen-images.mjs · scripts/prompts/image-search-queries.md',
    status: '있음',
    note: '출처 표는 08 페이지 "바깥에서 가져온 것"이 이미 담고 있어 링크만 건다',
  },
  {
    id: 'E3',
    item: '데이터에서 도출한 관점 (죽음·가격·생산·의례)',
    source: 'src/components/templates/bridgeNarrative.js BRIDGE_SECTIONS',
    status: '있음',
    note: '저장소의 구역은 6개다. 프롤로그와 INDEX를 뺀 4개가 관점 카드다',
  },
  {
    id: 'E4',
    item: '키 비주얼·이미지 제작 계획과 프롬프트',
    source: 'docs/hirst/specimen-infographic-image-plan.md (공유 아트 디렉션, 공유 네거티브, 전문 프롬프트)',
    status: '있음',
    note: '생성에 쓴 모델이나 서비스 이름은 이 문서에 없다',
  },
  {
    id: 'E5',
    item: '영상 제작 파이프라인 (도구, 입력, 산출 파일)',
    source: 'scripts/generate-hirst-kling-motion.mjs · scripts/prompts/kling-*.md · generated-videos/hero-motion-kling-o1/manifest.json',
    status: '있음',
    note: '실행 기록에 모델 id와 요청 id, 입력 키프레임 경로가 남아 있다',
  },
  {
    id: 'E6',
    item: '영상 스크럽·타임라인 컴포넌트가 데이터를 읽는 경로',
    source: 'src/components/timeline/useTimelineLayout.js (데이터 읽음) · src/components/scroll/VideoScrubbing.jsx (읽지 않음)',
    status: '파생',
    note: '타임라인만 데이터 파일을 읽는다. 스크럽 영상은 src 와 스크롤 진행도만 받는다',
  },
  {
    id: 'E7',
    item: '시간축 한 벌로 묶는 구조',
    source: 'docs/hirst/02-ux-flow.md 3절 · src/data/hirst/hirst_eras.json · useTimelineLayout.js',
    status: '있음',
    note: '연도를 픽셀로, 세계관 값을 다섯 행으로 바꾸는 계산이 한 훅에 모여 있다',
  },
];

/** 영상 파이프라인 네 단계. 저장소의 스크립트와 파일만 적는다. */
const VIDEO_PIPELINE_ROWS = [
  {
    step: '1. 키프레임 렌더',
    input: 'public/crysis_shark.glb',
    output: 'generated-images/hero-keyframes-v2/*.png',
    tool: 'scripts/blender/pose_shark_hirst.py (Blender 수동)',
  },
  {
    step: '2. 이미지에서 영상 생성',
    input: '키프레임 2장 (시작 프레임, 끝 프레임)',
    output: 'generated-videos/hero-motion-kling-o1/*.mp4',
    tool: 'scripts/generate-hirst-kling-motion.mjs (fal.ai, 프롬프트는 scripts/prompts/kling-*.md)',
  },
  {
    step: '3. 배치와 그레이딩',
    input: '생성 결과 mp4',
    output: 'public/images/hirst/grotesque-motion/*.mp4 · src/assets/video/hirst-scrub-graded.mp4',
    tool: '수동. assetManifest 는 히어로 영상을 manual (blender + grade) 로 적는다',
  },
  {
    step: '4. 화면',
    input: '배치된 mp4',
    output: '스크롤 진행도에 붙은 히어로 영상, 관점 카드의 반복 영상',
    tool: 'VideoScrubbing.jsx · BridgeSection.jsx',
  },
];

/** 저장소에서 확인하지 못한 것 */
const MISSING_ROWS = [
  {
    what: 'Codex 흔적',
    detail: 'docs, scripts, src 전역에서 codex 문자열이 한 건도 나오지 않는다. 슬라이드 desc 의 두 도구 중 fal.ai 만 확인된다',
  },
  {
    what: '표본 인포그래픽 도판의 생성 도구',
    detail: '계획 문서에 규격, 공유 아트 디렉션, 공유 네거티브, 전문 프롬프트는 있으나 모델이나 서비스 이름이 없다',
  },
  {
    what: '생성 영상과 히어로 스크럽 영상의 연결',
    detail: '생성 결과를 hirst-scrub-graded.mp4 로 잇는 단계를 적은 문서나 스크립트가 없다',
  },
  {
    what: '관점 영상 4편 중 3편의 전용 프롬프트',
    detail: 'scripts/build-asset-manifest.mjs 가 4편 모두 같은 프롬프트 파일로 매핑하고 TODO 주석을 남겼다',
  },
  {
    what: '영상이 읽는 데이터',
    detail: 'VideoScrubbing 은 데이터 파일을 읽지 않는다. 데이터에서 영상으로 가는 길은 관점 서사 카피를 거친다',
  },
];

/** 슬라이드 사고 지도(thinking/hirst-fame-argorithm.js) 중 이 컨셉과 닿는 마디 */
const THINKING_ROWS = [
  { id: 'A1', label: '재료 축을 색에서 세계관 5축으로', basis: '아래 재료 표의 밴드 해설 5개와 작품 데이터' },
  { id: 'A4', label: '작품은 원본 수집, 해설은 생성', basis: '증거 표 E2 와 E4' },
  { id: 'A9', label: '히어로를 스크럽 영상으로 교체', basis: '영상 파이프라인 3·4단계, 없는 것 3' },
  { id: 'A10', label: '타임라인 앞에 다섯 관점 서사', basis: '관점 표. 저장소의 구역은 6개이고 영상이 붙은 것은 4개다' },
  { id: 'B24', label: '스크롤이 영상 시간을 움직임', basis: '증거 표 E6' },
  { id: 'C2', label: '수치를 체감시키는 화면 형태', basis: '표본 도판 계획 문서로 닫힌 여백. 프롬프트 표 참조' },
];

const STATUS_COLOR = { 있음: 'success', 파생: 'info', 없음: 'default' };

/** 문서에서 `## prompt` 아래 본문만 꺼낸다. generate-hirst-kling-motion.mjs 와 같은 규칙. */
function promptBody(raw) {
  const marker = /^##\s+prompt\s*$/m.exec(raw);
  if (!marker) {
    return '';
  }
  return raw.slice(marker.index + marker[0].length).replace(/^\s*\n/, '').trim();
}

/** 프롬프트 문서 머리의 `- key: value` 한 줄을 꺼낸다. */
function metaValue(raw, key) {
  const found = new RegExp(`^-\\s*${ key }:\\s*(.+)$`, 'm').exec(raw);
  return found ? found[1].trim() : '';
}

/** 파일 이름만 남긴다. */
function baseName(p) {
  return String(p).split('/').pop();
}

/** 키프레임 PNG 개수를 파일 목록에서 센다 */
const KEYFRAME_FILES = import.meta.glob('../../../generated-images/hero-keyframes-v2/*.png');

/** assetManifest 의 카테고리를 id 로 찾는다 */
function manifestCategory(id) {
  return assetManifest.categories.find((c) => c.id === id) ?? { items: [] };
}

/** 영상 경로로 manifest 항목을 찾는다 */
function manifestItemByPath(p) {
  for (const category of assetManifest.categories) {
    const hit = category.items.find((it) => it.path === p);
    if (hit) {
      return hit;
    }
  }
  return null;
}

/** 관점 표: 서사 구역 하나가 어떤 밴드와 그림과 영상에 닿는가 */
function viewpointRows() {
  return BRIDGE_SECTIONS.map((section) => {
    const bandKey = section.id.toUpperCase();
    const isBand = BAND_ORDER.includes(bandKey);
    const item = section.pictogram ? manifestItemByPath(section.pictogram) : null;
    return {
      id: section.id,
      view: section.bigType.split('\n').join(' '),
      band: isBand ? `${ bandKey } (해설 ${ koContent.bandDesc[section.id] ? '있음' : '없음' })` : '밴드 없음',
      still: isBand ? baseName(BAND_IMAGE_SRC[bandKey]) : '없음',
      video: section.pictogram ? baseName(section.pictogram) : '없음',
      pipeline: item ? item.sourcePipeline : '없음',
    };
  });
}

/** 영상과 도판이 실제로 읽는 재료. 개수는 전부 파일에서 센다. */
function materialRows() {
  const specimenPrompts = (specimenPlanRaw.match(/^### specimen-[\w-]+\.png$/gm) ?? []).length;
  return [
    {
      name: '관점 서사 구역',
      file: 'src/components/templates/bridgeNarrative.js',
      count: `${ BRIDGE_SECTIONS.length }구역`,
      to: `그중 ${ BRIDGE_SECTIONS.filter((s) => s.pictogram).length }구역에 반복 영상`,
    },
    {
      name: '밴드 해설',
      file: 'src/i18n/locales/ko/content.js',
      count: `${ Object.keys(koContent.bandDesc).length }개`,
      to: '밴드 대표 그림 (grotesque-bitmap)',
    },
    {
      name: '표본 종 집계',
      file: 'src/data/hirst/hirst-bio-specimen-data.js',
      count: `${ Object.keys(bioData.speciesSummary).length }종`,
      to: '표본 인포그래픽 도판',
    },
    {
      name: '표본 도판 전문 프롬프트',
      file: 'docs/hirst/specimen-infographic-image-plan.md',
      count: `${ specimenPrompts }개`,
      to: `public/images/hirst/specimen-infographic (${ manifestCategory('specimen-infographic').items.length }장)`,
    },
    {
      name: '히어로 키프레임',
      file: 'generated-images/hero-keyframes-v2/',
      count: `${ Object.keys(KEYFRAME_FILES).length }장`,
      to: '영상 생성의 시작·끝 프레임 입력',
    },
    {
      name: '영상 생성 실행 기록',
      file: 'generated-videos/hero-motion-kling-o1/manifest.json',
      count: `${ klingRunManifest.clips.length }클립`,
      to: klingRunManifest.model,
    },
    {
      name: '관점 반복 영상',
      file: 'public/images/hirst/grotesque-motion/',
      count: `${ manifestCategory('bridge-motion').items.length }편`,
      to: 'BridgeSection 카드 배경',
    },
    {
      name: '작품 도판',
      file: 'public/images/hirst/W*.jpg',
      count: `${ manifestCategory('works').items.length }장 (작품 ${ worksData.works.length }점)`,
      to: '타임라인 노드와 상세 오버레이',
    },
  ];
}

/** 영상 프롬프트 문서 세 벌을 문서 자체에서 읽어 정리한다 */
function promptRows() {
  return [
    { file: 'scripts/prompts/kling-vitrine-forms.md', raw: klingVitrineRaw },
    { file: 'scripts/prompts/kling-water-fills.md', raw: klingWaterRaw },
    { file: 'scripts/prompts/kling-mouth-to-portrait.md', raw: klingMouthRaw },
  ].map((row) => ({
    file: row.file,
    service: metaValue(row.raw, 'service'),
    mode: metaValue(row.raw, 'mode'),
    output: baseName(metaValue(row.raw, 'output')),
    length: `${ promptBody(row.raw).length }자`,
  }));
}

/**
 * 표 하나를 그린다. 08 페이지의 FlatTable 과 같은 모양을 쓴다.
 *
 * Props:
 * @param {Array} columns - [{ key, label, width, mono, dim, render }] [Required]
 * @param {Array} rows - 행 배열 [Required]
 * @param {function} rowKey - 행 key 생성 [Optional]
 *
 * Example usage:
 * <FlatTable columns={ cols } rows={ rows } rowKey={ (r) => r.id } />
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

/**
 * 다른 스토리로 가는 링크
 *
 * Props:
 * @param {string} id - 스토리 id [Required]
 * @param {node} children - 링크 텍스트 [Required]
 *
 * Example usage:
 * <StoryLink id="overview-fame-algorithm-07-assets--default">07 Assets</StoryLink>
 */
function StoryLink({ id, children }) {
  return (
    <Box
      component="a"
      href={ `?path=/story/${ id }` }
      target="_top"
      sx={ { color: 'primary.light' } }
    >
      { children }
    </Box>
  );
}

/** 웨비나 컨셉이 이 저장소에서 어떻게 확인되는가 */
export const Default = {
  render: () => {
    const viewpoints = viewpointRows();
    const materials = materialRows();
    const prompts = promptRows();

    return (
      <DocSurface>
        <DocumentTitle
          title="Concept & Flow"
          status="Available"
          note="웨비나 컨셉이 이 저장소의 어느 파일로 확인되는가"
          brandName="Design System"
          systemName="Fame Algorithm"
          version="1.0"
        />
        <PageContainer>
          <Typography variant="h4" sx={ { fontWeight: 700, mb: 1 } }>
            컨셉과 재료 흐름
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={ { mb: 4 } }>
            웨비나 3차 Part C 의 실험 한 장이 이 예제에 붙인 컨셉을 저장소 파일과 맞춰 본 페이지다.
            확인되는 것만 적고, 확인되지 않는 것은 없는 것 절에 그대로 남긴다.
          </Typography>

          <SectionTitle title="웨비나 컨셉" description="슬라이드 데이터에서 그대로 옮긴 값" />
          <Box sx={ { mb: 4, p: 2.5, border: '1px solid', borderColor: 'divider' } }>
            <Stack direction="row" spacing={ 1 } flexWrap="wrap" useFlexGap sx={ { mb: 1.5 } }>
              <Chip label={ CONCEPT.experiment } size="small" color="primary" />
              <Chip label={ `갈래 ${ CONCEPT.approach }` } size="small" />
              <Chip label={ `프레임 ${ CONCEPT.frame.name }` } size="small" />
            </Stack>
            <Typography variant="subtitle1" sx={ { fontWeight: 700, mb: 0.5 } }>
              { CONCEPT.subtitle }
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={ { mb: 0.5 } }>
              { CONCEPT.desc }
            </Typography>
            <Typography variant="caption" sx={ { display: 'block', color: 'text.secondary', mb: 2 } }>
              프레임 한 줄: { CONCEPT.frame.oneLiner }
            </Typography>
            <Typography variant="caption" sx={ { display: 'block', color: 'text.secondary', mb: 0.5 } }>
              이 예제가 이 컨셉의 증거인 이유
            </Typography>
            <Typography variant="body2">
              작품, 사건, 검색 관심, 표본을 먼저 정적 데이터 파일로 적고 그 위에 한 시간축 화면을 얹었다.
              그 데이터에서 뽑은 관점이 bridgeNarrative.js 의 서사 구역이 되고,
              같은 이름의 반복 영상이 구역마다 붙는다.
              영상은 scripts/prompts 의 프롬프트 문서와 scripts/generate-hirst-kling-motion.mjs 로 만들었고,
              실행 기록이 generated-videos/hero-motion-kling-o1/manifest.json 에 모델 id 와 요청 id 로 남아 있다.
            </Typography>
          </Box>

          <SectionTitle title="흐름: 기획에서 화면까지" description="다섯 단계와 그 산출물" />
          <FlatTable
            columns={ [
              { key: 'stage', label: '단계', width: 110 },
              { key: 'decided', label: '여기서 정한 것', width: 300 },
              { key: 'left', label: '남긴 것', width: 330, mono: true },
              {
                key: 'seen',
                label: '보는 곳',
                dim: true,
                render: (r) => <StoryLink id={ r.story }>{ r.seenLabel }</StoryLink>,
              },
            ] }
            rows={ FLOW_ROWS }
            rowKey={ (r) => r.stage }
          />
          <Typography variant="body2" color="text.secondary" sx={ { mb: 4 } }>
            데이터 파일의 표는{ ' ' }
            <StoryLink id="overview-fame-algorithm-05-works-data--default">05 Works Data</StoryLink>
            { ' ' }에, 화면 구현의 청사진과 컴포넌트 대응은{ ' ' }
            <StoryLink id="overview-fame-algorithm-appendix-landing-implementation--docs">
              Appendix / Landing Implementation
            </StoryLink>
            { ' ' }과{ ' ' }
            <StoryLink id="overview-fame-algorithm-appendix-screen-component-map--docs">
              Appendix / Screen Component Map
            </StoryLink>
            { ' ' }에 있다.
          </Typography>

          <SectionTitle title="컨셉 증거" description="Video storytelling 항목 일곱 개" />
          <FlatTable
            columns={ [
              { key: 'id', label: '항목', width: 50 },
              { key: 'item', label: '찾는 것', width: 230 },
              { key: 'source', label: '저장소 근거', width: 330, mono: true },
              {
                key: 'status',
                label: '상태',
                width: 70,
                render: (r) => (
                  <Chip label={ r.status } size="small" color={ STATUS_COLOR[r.status] } />
                ),
              },
              { key: 'note', label: '비고', dim: true },
            ] }
            rows={ EVIDENCE_ROWS }
            rowKey={ (r) => r.id }
          />
          <Typography variant="body2" color="text.secondary" sx={ { mb: 4 } }>
            수집 출처와 학습시킨 데이터의 전체 표는{ ' ' }
            <StoryLink id="overview-fame-algorithm-08-domain-knowledge-research--default">
              08 Domain Knowledge &amp; Research
            </StoryLink>
            { ' ' }에 있다. 여기서는 되풀이하지 않는다.
          </Typography>

          <SectionTitle title="데이터에서 영상까지" description="서사 구역 하나가 닿는 밴드, 그림, 영상" />
          <FlatTable
            columns={ [
              { key: 'view', label: '관점', width: 160 },
              { key: 'band', label: '밴드와 해설', width: 180 },
              { key: 'still', label: '대표 그림', width: 200, mono: true },
              { key: 'video', label: '영상', width: 170, mono: true },
              { key: 'pipeline', label: '파이프라인', dim: true },
            ] }
            rows={ viewpoints }
            rowKey={ (r) => r.id }
          />
          <Typography variant="body2" color="text.secondary" sx={ { mb: 4 } }>
            영상 파일은{ ' ' }
            <StoryLink id="common-assets-bridge-motion--gallery">Common / Assets / Bridge Motion</StoryLink>
            { ' ' }에서, 히어로 영상은{ ' ' }
            <StoryLink id="common-assets-hero-video--gallery">Common / Assets / Hero Video</StoryLink>
            { ' ' }에서 직접 볼 수 있다. 카드 자체는{ ' ' }
            <StoryLink id="custom-component-5-bridge-narrative-bridgesection--category-card">
              BridgeSection / Category Card
            </StoryLink>
            { ' ' }다.
          </Typography>

          <SectionTitle title="영상과 도판이 읽는 재료" description="개수는 모두 파일에서 셌다" />
          <FlatTable
            columns={ [
              { key: 'name', label: '재료', width: 170 },
              { key: 'file', label: '파일', width: 330, mono: true },
              { key: 'count', label: '수', width: 110 },
              { key: 'to', label: '가는 곳', dim: true },
            ] }
            rows={ materials }
            rowKey={ (r) => r.name }
          />

          <SectionTitle title="영상 파이프라인" description="입력과 출력, 그리고 쓴 도구" />
          <FlatTable
            columns={ [
              { key: 'step', label: '단계', width: 140 },
              { key: 'input', label: '입력', width: 250, mono: true },
              { key: 'output', label: '출력', width: 300, mono: true },
              { key: 'tool', label: '도구', dim: true },
            ] }
            rows={ VIDEO_PIPELINE_ROWS }
            rowKey={ (r) => r.step }
          />

          <SectionTitle title="영상 프롬프트" description="문서에서 직접 읽은 값" />
          <FlatTable
            columns={ [
              { key: 'file', label: '프롬프트 문서', width: 290, mono: true },
              { key: 'service', label: '서비스', width: 160 },
              { key: 'mode', label: '방식', width: 150 },
              { key: 'output', label: '출력', width: 230, mono: true },
              { key: 'length', label: '본문 길이', dim: true },
            ] }
            rows={ prompts }
            rowKey={ (r) => r.file }
          />
          <Typography variant="body2" color="text.secondary" sx={ { mb: 4 } }>
            생성 스크립트는 이 문서들의 `## prompt` 아래 본문만 읽어 그대로 요청에 싣는다.
            프롬프트 원문은 저장소 파일에 있고 이 페이지는 옮겨 적지 않는다.
            표본 도판 쪽 공유 네거티브 프롬프트는{ ' ' }
            { specimenPlanRaw.includes('Shared Negative Prompt') ? '계획 문서의 "Shared Negative Prompt" 절' : '없음' }
            { ' ' }에 한 벌로 묶여 있고, 후처리는 scripts/retint-hirst-specimen-infographic.mjs 가 맡는다.{ ' ' }
            <StoryLink id="common-assets-specimen-infographic--gallery">
              Common / Assets / Specimen Infographic
            </StoryLink>
            { ' ' }에 결과가 있다.
          </Typography>

          <SectionTitle title="없는 것" description="저장소에서 확인하지 못한 항목" />
          <FlatTable
            columns={ [
              { key: 'what', label: '항목', width: 240 },
              { key: 'detail', label: '무엇이 없는가' },
            ] }
            rows={ MISSING_ROWS }
            rowKey={ (r) => r.what }
          />

          <SectionTitle title="슬라이드 사고 지도 대응" description="이 컨셉과 닿는 마디만" />
          <FlatTable
            columns={ [
              { key: 'id', label: '결정', width: 70 },
              { key: 'label', label: '라벨', width: 300 },
              { key: 'basis', label: '이 페이지의 근거' },
            ] }
            rows={ THINKING_ROWS }
            rowKey={ (r) => r.id }
          />

          <Typography variant="caption" sx={ { display: 'block', color: 'text.secondary' } }>
            이 페이지의 모든 표는 저장소의 문서, 데이터, 스크립트에서 파생했다. 저장소 밖 자료는 쓰지 않았다.
          </Typography>
        </PageContainer>
      </DocSurface>
    );
  },
};
