import React from 'react';
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
import assetManifest from '../../data/assetManifest.json';
import worksData from '../../data/hirst/hirst_works.json';
import eventsData from '../../data/hirst/hirst_events.json';
import bioData from '../../data/hirst/hirst-bio-specimen-data.js';
import trendData from '../../../data/hirst-trend-data.json';
import { BRIDGE_SECTIONS } from '../../components/templates/bridgeNarrative.js';
import TOKENS from '../../styles/themes/tokens.js';
import defaultTheme from '../../styles/themes/default.js';
import specimenPlanRaw from '../../../docs/hirst/specimen-infographic-image-plan.md?raw';

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

/** theme 토큰 값. 손으로 적지 않고 토큰 파일에서 읽는다 (src/styles/themes/tokens.js). */
const TOKEN_REFS = {
  dark: { path: 'TOKENS.bg.dark', value: TOKENS.bg.dark },
  page: { path: 'TOKENS.bg.page', value: TOKENS.bg.page },
  onDark: { path: 'TOKENS.text.onDark', value: TOKENS.text.onDark },
  brand: { path: 'TOKENS.accent.brand', value: TOKENS.accent.brand },
};

/** 스레드 색. MUI 팔레트에서 읽는다 (src/styles/themes/default.js). */
const PAL = defaultTheme.palette;

/** 서사 구역의 큰 글자를 id 로 찾는다. 줄바꿈은 공백으로 편다. */
function bigType(id) {
  const found = BRIDGE_SECTIONS.find((s) => s.id === id);
  return found ? found.bigType.split('\n').join(' ') : id;
}

/** assetManifest 의 카테고리를 id 로 찾는다 */
function manifestCategory(id) {
  return assetManifest.categories.find((c) => c.id === id) ?? { items: [] };
}

const WORK_IMAGE_COUNT = manifestCategory('works').items.length;
const SPECIMEN_IMAGE_COUNT = manifestCategory('specimen-infographic').items.length;

/** 의사결정 흐름 격자의 열. 왼쪽 결정이 오른쪽 값이 된다. */
const STAGES = [
  { key: 'plan', label: '기획', doc: '01' },
  { key: 'model', label: '데이터 모델', doc: '02 3절' },
  { key: 'view', label: '관점', doc: '01 3절 · bridgeNarrative' },
  { key: 'visual', label: '비주얼 디렉션', doc: '03 · tokens.js' },
  { key: 'prompt', label: '이미지·영상 프롬프트', doc: '03 4절 · 계획 문서' },
  { key: 'result', label: '결과', doc: '화면 · 파일' },
];

/**
 * 의사결정 흐름 격자의 행. 스레드 하나가 재료 하나의 전파 경로다.
 * 칸은 짧은 라벨과 근거(문서 절 또는 파일)만 둔다. null 은 그 단계에 결정이 없다는 뜻.
 */
const FLOW_THREADS = [
  {
    key: 'works', name: '작품', stripe: PAL.secondary.main,
    nodes: [
      { label: '대상 Work: 1986년 이후 대표작 한 점', ref: '01 4.2절' },
      { label: 'Work: 연도·제목·매체·사상축 가중치·좌표', ref: `02 3.1절 · hirst_works.json ${ worksData.works.length }점` },
      { label: `${ bigType('system') }: 손이 사라지자 이름이 시스템이 된다`, ref: 'bridgeNarrative system' },
      { label: '보정하지 않는 기록 사진, 원본 비율', ref: '03 4절 archival artwork photo' },
      { label: '프롬프트 없음. 제목으로 공개 자료를 조회한다', ref: 'scripts/fetch-hirst-images.mjs' },
      { label: '통람 화면의 노드와 상세 도판', ref: `public/images/hirst/W*.jpg ${ WORK_IMAGE_COUNT }장` },
    ],
  },
  {
    key: 'events', name: '시장 사건', stripe: PAL.secondary.dark,
    nodes: [
      { label: '대상 Event: 생애·전시·시장에서 일어난 일', ref: '01 4.2절' },
      { label: 'Event: 연도·분류·시기·중요도·본문', ref: `02 3.1절 · hirst_events.json ${ eventsData.events.length }건` },
      { label: `${ bigType('vanitas') }: 이제 가격이 곧 작품이다`, ref: 'bridgeNarrative vanitas' },
      { label: '통람 화면은 선으로 구분하고 밀도를 높인다', ref: '03 2절 compact · 구분 언어 선' },
      null,
      { label: '축 아래 사건 노드', ref: 'useTimelineLayout.js · TimelineEventItem.jsx' },
    ],
  },
  {
    key: 'trend', name: '검색 관심', stripe: PAL.info.main,
    nodes: [
      { label: '과업 2: 30년 수요 곡선 위에서 본다', ref: '01 5절' },
      { label: 'SearchTrend: 월별 지수와 정점', ref: `hirst-trend-data.json ${ trendData.trendData.series.length }포인트 · 정점 ${ trendData.trendData.peaks.length }` },
      { label: `${ bigType('pivot') }: 작품을 만든 검색 그래프를 본다`, ref: 'bridgeNarrative pivot · 01 3.1 Index' },
      { label: '검은 지면 위 흰 곡선 하나', ref: `TOKENS.alpha.onDark(0.95) · ${ TOKEN_REFS.onDark.value }` },
      null,
      { label: '30년 수요 곡선과 정점 상세', ref: 'TimelineTrendBackground.jsx · PeakHoverOverlay.jsx' },
    ],
  },
  {
    key: 'specimen', name: '생물 표본', stripe: PAL.primary.light,
    nodes: [
      { label: '과업 4: 종과 개체 수를 확인한다', ref: '01 5절' },
      { label: 'SpecimenLedger: 종 키·학명·작품 수·개체 수', ref: `02 3.1절 · hirst-bio-specimen-data.js ${ Object.keys(bioData.speciesSummary).length }종` },
      { label: `${ bigType('mortality') }: 세어본 수로만 말한다`, ref: '01 3.1 Empiricism · bridgeNarrative mortality' },
      { label: '검은 지면에 차가운 오프화이트 에칭 선', ref: `${ TOKEN_REFS.dark.value } · ${ TOKEN_REFS.onDark.value }` },
      { label: '표본마다 한 벌. 공유 아트 디렉션과 네거티브는 고정', ref: '03 4절 · 계획 문서 Complete Prompts' },
      { label: '표본 집계 화면의 도판', ref: `specimen-infographic ${ SPECIMEN_IMAGE_COUNT }장` },
    ],
  },
  {
    key: 'hero', name: '히어로 영상', stripe: PAL.primary.main,
    nodes: [
      { label: '과업 1: 어떻게 시스템이 되었는지 도입에서 잡는다', ref: '01 5절' },
      null,
      { label: bigType('prologue'), ref: 'bridgeNarrative prologue' },
      { label: 'monochrome scrub film. 검정을 지면 검정에 맞춘다', ref: `03 4절 · ${ TOKEN_REFS.page.path } ${ TOKEN_REFS.page.value }` },
      { label: '이미지에서 영상. 프롬프트 문서 3벌', ref: 'scripts/prompts/kling-*.md' },
      { label: '스크롤 진행도가 영상 시간이 된다', ref: 'VideoScrubbing.jsx · hirst-scrub-graded.mp4' },
    ],
  },
];

/** 계획 문서의 전문 프롬프트 파일 이름 목록 */
const SPECIMEN_NAMES = [...specimenPlanRaw.matchAll(/^### (specimen-[\w-]+\.png)$/gm)].map((m) => m[1]);

/** 격자에 그릴 대표 프롬프트. 한 표본만 펼치고 나머지는 같은 자리에 값만 바뀐다. */
const SPECIMEN_REF_NAME = 'specimen-shark-vitrine.png';

/**
 * 계획 문서에서 `### {파일명}` 아래 본문만 꺼낸다. 문서를 복사하지 않고 raw import 를 자른다.
 *
 * @param {string} raw - specimen-infographic-image-plan.md 원문 [Required]
 * @param {string} name - 프롬프트 파일 이름 [Required]
 * @returns {string} 프롬프트 본문
 */
function promptBody(raw, name) {
  const heading = `### ${ name }`;
  const start = raw.indexOf(heading);
  if (start < 0) {
    return '';
  }
  const rest = raw.slice(start + heading.length);
  const next = rest.indexOf('\n### ');
  return (next < 0 ? rest : rest.slice(0, next)).trim();
}

/** 문장 단위로 자른다. 마침표 뒤 공백이 경계다. */
function sentences(body) {
  return body.split(/(?<=\.)\s+/).map((s) => s.trim()).filter(Boolean);
}

const SPECIMEN_BODIES = SPECIMEN_NAMES.map((name) => promptBody(specimenPlanRaw, name));

/** 공유 네거티브 프롬프트 원문(백틱 한 줄)과 항목 수 */
const NEGATIVE_RAW = (/`([^`]+)`/.exec(specimenPlanRaw.slice(specimenPlanRaw.indexOf('## Shared Negative Prompt'))) ?? ['', ''])[1];
const NEGATIVE_COUNT = NEGATIVE_RAW ? NEGATIVE_RAW.split(',').length : 0;

/** 공유 아트 디렉션 항목의 한국어 라벨 */
const ART_DIRECTION_LABELS = {
  'Format': '규격',
  'Palette': '팔레트 토큰',
  'Style': '스타일',
  'Line handling': '선 처리',
  'Composition': '구도',
  'Text inside image': '이미지 속 글자',
  'Required post-process': '후처리 스크립트',
};

/** 프롬프트 문장에 붙일 라벨 규칙. 규칙이 없는 문장은 모티프 슬롯으로 본다. */
const PROMPT_RULES = [
  { test: /^Create a square raster engraving/, label: '표본 선언', slot: '{표본}', from: 'Asset Concepts Role' },
  { test: /^Use a black museum-interface background/, label: '지면과 선', from: 'Shared Art Direction', token: 'dark' },
  { test: /^Negative prompt:/, label: '공유 네거티브 참조', from: 'Shared Negative Prompt' },
  { test: /no readable text/i, label: '개별 금지 장면', slot: '{금지}', from: '03 4절 하지 않는 것' },
];

/** 공유 아트 디렉션 불릿을 고정 블록으로 만든다 */
function artDirectionBlocks() {
  const start = specimenPlanRaw.indexOf('## Shared Art Direction');
  const end = specimenPlanRaw.indexOf('## Shared Negative Prompt');
  return specimenPlanRaw
    .slice(start, end)
    .split('\n')
    .filter((line) => line.startsWith('- '))
    .map((line) => {
      const text = line.slice(2).trim();
      const key = text.split(':')[0];
      return {
        label: ART_DIRECTION_LABELS[key] ?? key,
        from: 'Shared Art Direction',
        token: key === 'Palette' ? 'brand' : undefined,
        line: text,
      };
    });
}

/**
 * 대표 프롬프트의 문장을 블록으로 만든다.
 * 여덟 벌 모두에 같은 문장이 있으면 고정부, 아니면 표본마다 바뀌는 슬롯이다.
 */
function promptBlocks() {
  return sentences(promptBody(specimenPlanRaw, SPECIMEN_REF_NAME)).map((line) => {
    const rule = PROMPT_RULES.find((r) => r.test.test(line));
    const isFixed = SPECIMEN_BODIES.filter((body) => body.includes(line)).length === SPECIMEN_BODIES.length;
    return {
      label: rule ? rule.label : '모티프',
      from: rule ? rule.from : 'Asset Concepts Motifs',
      token: rule ? rule.token : undefined,
      slot: isFixed ? undefined : (rule && rule.slot ? rule.slot : '{모티프}'),
      line,
    };
  });
}

/** 표본 인포그래픽 템플릿 한 벌 */
const SPECIMEN_BLOCKS = [
  ...artDirectionBlocks(),
  ...promptBlocks(),
  { label: `공유 네거티브 ${ NEGATIVE_COUNT }항목`, from: 'Shared Negative Prompt', line: NEGATIVE_RAW },
];

/**
 * 작품 도판 수집 템플릿. 단계 라벨은 scripts/fetch-hirst-images.mjs 의 함수명과 상수명에서 가져왔다.
 * line 은 그 단계에 해당하는 스크립트 구문이다.
 */
const FETCH_BLOCKS = [
  { label: '캐시 확인: 3000바이트를 넘고 금지 해시가 아니면 통과', from: 'fetchOne', line: 'if (stat.size > 3000)' },
  { label: '질의문 조립', slot: '{title} {year}', from: 'hirst_works.json', line: 'const queryStr = `Damien Hirst "${titleClean}" ${work.year}`' },
  { label: 'Bing 이미지 검색 (연도 포함)', from: 'bingImage', line: 'bingImage(queryStr)' },
  { label: 'Bing 이미지 검색 (연도 없이)', from: 'bingImage', line: 'bingImage(queryStrLoose)' },
  { label: 'Google 이미지 검색', from: 'googleImage', line: 'googleImage(queryStr)' },
  { label: 'Wikimedia Commons 파일 검색', from: 'commonsSearch', line: 'commonsSearch(`Hirst ${titleClean}`)' },
  { label: 'Wikipedia 제목 조회', from: 'wikiByTitle', line: 'wikiByTitle(work.title)' },
  { label: '후보 병합과 중복 제거, 상위 8개만', from: 'fetchOne', line: 'allCandidates.slice(0, 8)' },
  { label: '내려받아 검증: 형식, 3000바이트, MD5 금지 해시', from: 'downloadAndVerify', line: 'if (bannedHashes.has(hash)) throw new Error(`banned hash ...`)' },
  { label: '저장', slot: '{work.image}', from: 'OUT_DIR public/images/hirst', line: 'await fs.writeFile(dest, buf)' },
  { label: '실패는 목록으로만 남긴다', from: 'FAIL_LOG', line: './scripts/output/hirst-images-failed.json' },
];

/** C-5 증거 항목. status 는 '있음' | '파생' | '없음'. story 는 원문을 보여 주는 Appendix docs id (있을 때만). */
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
    note: `저장소의 구역은 ${ BRIDGE_SECTIONS.length }개다. 프롤로그와 INDEX를 뺀 ${ BRIDGE_SECTIONS.filter((s) => s.pictogram).length }개가 관점 카드다`,
  },
  {
    id: 'E4',
    item: '키 비주얼·이미지 제작 계획과 프롬프트',
    source: 'docs/hirst/specimen-infographic-image-plan.md (공유 아트 디렉션, 공유 네거티브, 전문 프롬프트)',
    status: '있음',
    note: '생성에 쓴 모델이나 서비스 이름은 이 문서에 없다',
    story: 'overview-fame-algorithm-appendix-specimen-image-plan--docs',
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
    what: '아홉 번째 표본 도판의 프롬프트',
    detail: `계획 문서의 전문 프롬프트는 ${ SPECIMEN_NAMES.length }벌인데 결과 도판은 ${ SPECIMEN_IMAGE_COUNT }장이다. specimen-minor-animals-strip 만 프롬프트가 없다`,
  },
  {
    what: '생성 영상과 히어로 스크럽 영상의 연결',
    detail: '생성 결과를 hirst-scrub-graded.mp4 로 잇는 단계를 적은 문서나 스크립트가 없다. assetManifest 는 히어로 영상을 manual (blender + grade) 로 적는다',
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
  { id: 'A1', label: '재료 축을 색에서 세계관 5축으로', basis: '격자의 작품 스레드. 02 3.1절 Work 의 사상축 가중치' },
  { id: 'A4', label: '작품은 원본 수집, 해설은 생성', basis: '템플릿 두 벌의 대비. 수집 템플릿에는 프롬프트가 없다' },
  { id: 'A9', label: '히어로를 스크럽 영상으로 교체', basis: '격자의 히어로 영상 스레드와 없는 것 4' },
  { id: 'A10', label: '타임라인 앞에 다섯 관점 서사', basis: '격자의 관점 열. 저장소의 구역은 6개이고 영상이 붙은 것은 4개다' },
  { id: 'B24', label: '스크롤이 영상 시간을 움직임', basis: '증거 표 E6' },
  { id: 'C2', label: '수치를 체감시키는 화면 형태', basis: '표본 인포그래픽 템플릿. 계획 문서가 중앙 수치 자리를 비워 둔다' },
];

const STATUS_COLOR = { 있음: 'success', 파생: 'info', 없음: 'default' };

/**
 * 격자 셀 하나. 결정 라벨과 근거를 짧게 보여 준다.
 *
 * Props:
 * @param {object} node - { label, ref } 또는 null [Required]
 * @param {string} stripe - 스레드 색 [Required]
 *
 * Example usage:
 * <FlowCell node={ { label: '...', ref: '01 4.2절' } } stripe="#6666FF" />
 */
function FlowCell({ node, stripe }) {
  if (!node) {
    return <Box sx={ { minHeight: 64, border: 1, borderStyle: 'dashed', borderColor: 'divider', opacity: 0.5 } } />;
  }
  return (
    <Box
      sx={ {
        minHeight: 64,
        border: 1,
        borderColor: 'divider',
        borderLeftWidth: 4,
        borderLeftStyle: 'solid',
        borderLeftColor: stripe,
        px: 1,
        py: 0.75,
      } }
    >
      <Typography variant="caption" component="div" sx={ { fontWeight: 600, lineHeight: 1.35 } }>
        { node.label }
      </Typography>
      <Typography variant="caption" component="div" color="text.secondary" sx={ { fontFamily: 'monospace', fontSize: 10 } }>
        { node.ref }
      </Typography>
    </Box>
  );
}

/**
 * 템플릿 블록 하나. 슬롯이 있으면 채운 색, 없으면 외곽선(고정).
 *
 * Props:
 * @param {object} block - { label, slot?, from, token?, line } [Required]
 *
 * Example usage:
 * <TemplateBlock block={ { label: '규격', from: 'Shared Art Direction', line: 'Format: PNG ...' } } />
 */
function TemplateBlock({ block }) {
  const isSlot = Boolean(block.slot);
  const token = block.token ? TOKEN_REFS[block.token] : null;
  return (
    <Box
      title={ block.line }
      sx={ {
        px: 1, py: 0.5, mb: 0.5,
        border: 1,
        borderColor: isSlot ? 'primary.main' : 'divider',
        bgcolor: isSlot ? 'primary.main' : 'transparent',
        color: isSlot ? 'primary.contrastText' : 'text.primary',
      } }
    >
      <Stack direction="row" spacing={ 1 } alignItems="baseline" justifyContent="space-between">
        <Typography variant="caption" sx={ { fontWeight: isSlot ? 700 : 500, lineHeight: 1.4 } }>
          { block.label }{ isSlot ? ' ' : '' }
          { isSlot && <Box component="span" sx={ { fontFamily: 'monospace' } }>{ block.slot }</Box> }
        </Typography>
        <Typography variant="caption" sx={ { fontSize: 10, opacity: 0.8, whiteSpace: 'nowrap' } }>
          { token ? `${ token.path } ${ token.value }` : block.from }
        </Typography>
      </Stack>
    </Box>
  );
}

/**
 * 템플릿 한 벌: 입력 → 블록 스택 → 출력.
 *
 * Props:
 * @param {string} title - 템플릿 이름 [Required]
 * @param {string} repeat - 반복 횟수 설명 [Required]
 * @param {Array} inputs - 왼쪽 입력 목록 [Required]
 * @param {Array} blocks - TemplateBlock 목록 [Required]
 * @param {string} outputSrc - 오른쪽 결과 이미지 경로 [Required]
 * @param {string} outputLabel - 결과 설명 [Required]
 * @param {string} outputRatio - 결과 이미지 비율 [Optional, 기본값: '1 / 1']
 *
 * Example usage:
 * <TemplateStack title="표본 도판 프롬프트" repeat="× 8 표본" inputs={ [] } blocks={ [] } outputSrc="/a.png" outputLabel="결과" />
 */
function TemplateStack({ title, repeat, inputs, blocks, outputSrc, outputLabel, outputRatio = '1 / 1' }) {
  return (
    <Grid container spacing={ 2 } alignItems="stretch">
      <Grid size={ { xs: 12, md: 3 } }>
        <Typography variant="overline" color="text.secondary">입력</Typography>
        { inputs.map((text) => (
          <Typography key={ text } variant="caption" component="div" sx={ { fontFamily: 'monospace', py: 0.25, lineHeight: 1.4 } }>
            { text }
          </Typography>
        )) }
      </Grid>
      <Grid size={ { xs: 12, md: 6 } }>
        <Stack direction="row" justifyContent="space-between" alignItems="baseline">
          <Typography variant="overline" color="text.secondary">{ title }</Typography>
          <Typography variant="caption" color="text.secondary">{ repeat }</Typography>
        </Stack>
        { blocks.map((block) => <TemplateBlock key={ block.line } block={ block } />) }
      </Grid>
      <Grid size={ { xs: 12, md: 3 } }>
        <Typography variant="overline" color="text.secondary">출력</Typography>
        <Box
          component="img"
          src={ outputSrc }
          alt={ outputLabel }
          sx={ { width: '100%', maxWidth: 180, aspectRatio: outputRatio, objectFit: 'cover', bgcolor: 'background.default', display: 'block' } }
        />
        <Typography variant="caption" color="text.secondary">{ outputLabel }</Typography>
      </Grid>
    </Grid>
  );
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
  render: () => (
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

        <SectionTitle
          title="의사결정 흐름"
          description="왼쪽 결정이 오른쪽 값이 된다. 재료 하나가 기획에서 화면까지 가는 경로를 한 행으로 읽는다"
        />
        <Box sx={ { overflowX: 'auto', mb: 1 } }>
          <Box sx={ { display: 'grid', gridTemplateColumns: '92px repeat(6, minmax(170px, 1fr))', columnGap: 1, rowGap: 1, minWidth: 1180 } }>
            <Box />
            { STAGES.map((stage) => (
              <Box key={ stage.key } sx={ { borderBottom: 2, borderColor: 'primary.main', pb: 0.5 } }>
                <Typography variant="subtitle2">{ stage.label }</Typography>
                <Typography variant="caption" color="text.secondary" sx={ { fontFamily: 'monospace' } }>
                  { stage.doc }
                </Typography>
              </Box>
            )) }
            { FLOW_THREADS.map((thread) => (
              <React.Fragment key={ thread.key }>
                <Box sx={ { display: 'flex', alignItems: 'center' } }>
                  <Typography variant="subtitle2" sx={ { color: thread.stripe } }>
                    { thread.name }
                  </Typography>
                </Box>
                { thread.nodes.map((node, index) => (
                  <FlowCell key={ `${ thread.key }-${ STAGES[index].key }` } node={ node } stripe={ thread.stripe } />
                )) }
              </React.Fragment>
            )) }
          </Box>
        </Box>
        <Typography variant="caption" color="text.secondary" component="div" sx={ { mb: 4 } }>
          점선 칸은 그 단계에 결정이 없다는 뜻이다. 히어로 영상은 데이터 모델이 없고, 사건과 검색 관심은 프롬프트가 없다.
          색 값은 src/styles/themes/tokens.js 에서 읽는다.
        </Typography>

        <SectionTitle
          title="템플릿 구성"
          description="반복 재활용되는 두 벌. 외곽선 블록은 모든 결과에 같은 고정부, 채운 블록은 대상마다 값이 바뀌는 슬롯"
        />
        <Stack spacing={ 4 } sx={ { mb: 2 } }>
          <TemplateStack
            title="표본 인포그래픽 프롬프트 (문서 → 이미지)"
            repeat={ `× ${ SPECIMEN_NAMES.length } 표본` }
            inputs={ [
              `hirst-bio-specimen-data.js: speciesSummary ${ Object.keys(bioData.speciesSummary).length }종`,
              'speciesSummary[].species 학명',
              'artworkCount · individualCount',
              '계획 문서 Asset Concepts: Role · Motifs',
              `tokens.js: bg.dark ${ TOKEN_REFS.dark.value } · accent.brand ${ TOKEN_REFS.brand.value }`,
            ] }
            blocks={ SPECIMEN_BLOCKS }
            outputSrc="/images/hirst/specimen-infographic/specimen-shark-vitrine.png"
            outputLabel={ `상어 비트린. 같은 규격 ${ SPECIMEN_IMAGE_COUNT }장` }
          />
          <TemplateStack
            title="작품 도판 수집 (제목 → 파일)"
            repeat={ `× ${ worksData.works.length } 작품, 동시성 4` }
            inputs={ [
              `hirst_works.json: works ${ worksData.works.length }점`,
              'work.title · work.year → 질의문',
              'work.image → 저장 파일명',
              'scripts/output/hirst-banned-hashes.json: 금지 해시',
            ] }
            blocks={ FETCH_BLOCKS }
            outputSrc={ worksData.works[0].image }
            outputLabel={ `${ worksData.works[0].id } 도판. 결과 ${ WORK_IMAGE_COUNT }장` }
            outputRatio="4 / 3"
          />
        </Stack>
        <Typography variant="body2" color="text.secondary" sx={ { mb: 1 } }>
          블록에 마우스를 올리면 원문 줄이 보인다. 표본 프롬프트 전문은{ ' ' }
          <StoryLink id="overview-fame-algorithm-appendix-specimen-image-plan--docs">
            Appendix / Specimen Image Plan
          </StoryLink>
          { ' ' }에, 결과 도판은{ ' ' }
          <StoryLink id="common-assets-specimen-infographic--gallery">Common / Assets / Specimen Infographic</StoryLink>
          { ' ' }에 있다. 영상 쪽 반복 단위는 프롬프트 문서 3벌과 실행 기록 1건뿐이라 템플릿으로 그리지 않았다.
        </Typography>
        <Stack direction="row" spacing={ 2 } sx={ { mb: 4 } }>
          <Chip size="small" variant="outlined" label="고정 블록: 결과 전부가 같음" />
          <Chip size="small" color="primary" label="슬롯: 대상마다 값이 바뀜" />
        </Stack>

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
            {
              key: 'note',
              label: '비고',
              dim: true,
              render: (r) => (
                <>
                  { r.note }
                  { r.story && (
                    <>
                      { r.note ? ' ' : '' }
                      <StoryLink id={ r.story }>원문 보기</StoryLink>
                    </>
                  ) }
                </>
              ),
            },
          ] }
          rows={ EVIDENCE_ROWS }
          rowKey={ (r) => r.id }
        />
        <Typography variant="body2" color="text.secondary" sx={ { mb: 4 } }>
          수집 출처와 학습시킨 데이터의 전체 표는{ ' ' }
          <StoryLink id="overview-fame-algorithm-08-domain-knowledge-research--default">
            08 Domain Knowledge &amp; Research
          </StoryLink>
          { ' ' }에, 화면 구현의 청사진은{ ' ' }
          <StoryLink id="overview-fame-algorithm-appendix-landing-implementation--docs">
            Appendix / Landing Implementation
          </StoryLink>
          { ' ' }에 있다. 여기서는 되풀이하지 않는다.
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
          이 페이지의 도식과 표는 저장소의 문서, 데이터, 스크립트에서 파생했다. 저장소 밖 자료는 쓰지 않았다.
        </Typography>
      </PageContainer>
    </DocSurface>
  ),
};
