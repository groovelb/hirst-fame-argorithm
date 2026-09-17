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
  TreeNode,
} from '../../components/storybookDocumentation';
import { DocSurface } from '../fixtures/DocSurface.jsx';
import projectStructure from '../../data/projectStructure.js';
import { ASSEMBLY_STEPS } from './assemblySteps.js';

export default {
  title: 'Custom Component/0. Hierarchy',
  parameters: {
    layout: 'padded',
  },
};

/** 스타터킷 파일을 이어받아 고친 것. 파일 diff 결과다. */
const MODIFIED = new Set([
  'HorizontalScrollContainer',
  'VideoScrubbing',
  'FitText',
]);

/** 스타터킷과 내용이 같은 것. 화면 트리에는 나타나지 않는다. */
const REUSE = new Set([
  'AppShell', 'BentoGrid', 'LineGrid', 'PageContainer', 'PhiSplit', 'SplitScreen',
  'CardContainer', 'CustomCard', 'ImageCard', 'MoodboardCard', 'SectionContainer',
  'RatioContainer', 'CarouselContainer', 'GNB', 'NavMenu', 'SlidingHighlightMenu',
  'AspectMedia', 'ImageCarousel', 'ImageTransition', 'GradientOverlay', 'FilterBar',
  'RandomRevealText', 'ScrambleText', 'ScrollRevealText', 'ScrollScaleContainer',
  'FadeTransition', 'MarqueeContainer', 'PerspectiveTransition', 'CategoryTab',
  'SearchBar', 'TagInput', 'FileDropzone', 'StretchedHeadline', 'HighlightedTypography',
  'InlineTypography', 'QuotedContainer', 'StyledParagraph', 'Title',
]);

/** 컴포넌트가 아닌 항목의 한 줄 설명 */
const DESCRIPTIONS = {
  LocaleProvider: 'Provider · 한국어와 영어 로케일 제공',
  useLocale: 'Hook · 현재 로케일과 localized() 소비',
  useTimelineLayout: 'Hook · 연도와 밴드를 캔버스 좌표로 변환',
  hirst_works: 'Data · 작품 72점',
  hirst_events: 'Data · 사건 52건과 연대기 7구획',
  'hirst-bio-specimen-data': 'Data · 표본 집계 12종',
  hirst_work_bio_map: 'Data · 작품과 표본 작품의 수동 매핑',
  hirst_bio_artwork_images: 'Data · 표본 작품 도판 경로',
};

/** 화면에서 도달하지 않는 코드. 구조 트리 밖이라 목록으로만 적는다. */
const UNWIRED = [
  { group: 'Era 화면', name: 'HirstWorldviewTimeline', folder: 'timeline', note: '원문 설계의 연대기 셸' },
  { group: 'Era 화면', name: 'EraSegment', folder: 'layout', note: '연대기 한 구획' },
  { group: 'Era 화면', name: 'EraThesisHeadline', folder: 'typography', note: '시기 명제 헤드라인' },
  { group: 'Era 화면', name: 'EraEventStrip', folder: 'data-display', note: '연대기 안의 사건 띠' },
  { group: 'Era 화면', name: 'WorldviewMiniMap', folder: 'navigation', note: '7구획 앵커 내비' },
  { group: 'Era 화면', name: 'BestiaryGrid', folder: 'layout', note: '종별 카드 격자' },
  { group: 'Era 화면', name: 'SpeciesStatCard', folder: 'card', note: '종 하나의 집계 카드' },
  { group: 'Era 화면', name: 'SpecimenCountBadge', folder: 'data-display', note: '정량 배지' },
  { group: 'Era 화면', name: 'SourceChip', folder: 'data-display', note: '출처 칩' },
  { group: 'Era 화면', name: 'CaveatNote', folder: 'overlay-feedback', note: '통계 해석 단서' },
  { group: 'Era 화면', name: 'WorkDetailModal', folder: 'overlay-feedback', note: '작품 상세 모달' },
  { group: '상어 3D', name: 'SharkVitrine 묶음', folder: 'shark-modeling', note: '7파일. 사전 렌더 영상으로 대체됨' },
  { group: '상어 3D', name: 'TigerSharkModelingLab 묶음', folder: 'tiger-shark', note: '8파일. 모델링 실험' },
  { group: '원형 보존', name: 'RothkoTimeline', folder: 'timeline', note: '앞선 코드베이스 원형' },
  { group: '원형 보존', name: 'TimelineEmotionCurve', folder: 'timeline', note: '감정선 곡선. import 그래프에서 고립' },
];

/** 분류별 수. 파일 diff 인벤토리 기준이다. */
const CLASS_COUNTS = [
  { klass: 'reuse', count: 48, story: 41, title: 'Component/…, Common/…', note: '스타터킷과 내용 동일. 화면 트리에 없다' },
  { klass: 'modified', count: 3, story: 3, title: 'Custom Component/9. Adapted Starter', note: '스타터킷 파일을 이어받아 고침' },
  { klass: 'new', count: 49, story: 49, title: 'Custom Component/1~10 · Page', note: '이 저장소에만 있는 파일' },
];

/** Custom Component 용도별 그룹. 실제 사용처로 묶는다. */
const GROUPS = [
  { id: '0. Hierarchy', what: '이 화면. 분류와 위계', wired: '해당 없음' },
  { id: '1. Hero', what: '도입 구획과 거대 타이포', wired: '랜딩 도달' },
  { id: '2. Timeline Canvas', what: '좌표계, 축, 곡선, 노드, 미니맵', wired: '랜딩 도달' },
  { id: '3. Specimen & Bio', what: '표본 집계 구획과 종 상세', wired: '랜딩 도달' },
  { id: '4. Color Analysis', what: '사상축 도넛과 세그먼트 상세', wired: '표시 플래그 꺼짐' },
  { id: '5. Bridge & Narrative', what: '서사 장과 그 카피', wired: '랜딩 도달' },
  { id: '6. Overlays & Modals', what: '작품·정점 상세, 대기 화면, 언어 토글', wired: '랜딩 도달' },
  { id: '7. Era (미연결)', what: '원문 설계의 연대기 화면 11', wired: '도달 안 함' },
  { id: '8. Shark 3D (미연결)', what: '비트린과 상어 모델링 11', wired: '도달 안 함' },
  { id: '9. Adapted Starter', what: '스타터킷을 고쳐 쓴 셋', wired: '랜딩 도달' },
  { id: '10. Legacy Rothko (미연결)', what: '앞선 코드베이스 원형 둘', wired: '도달 안 함' },
];

/** 폴더 경로에서 마지막 조각만 (components/timeline → timeline) */
const folderOf = (category) => String(category || '').split('/').filter(Boolean).pop() || '.';

/** 이름 하나의 분류 */
function classify(name) {
  if (MODIFIED.has(name)) {
    return 'modified';
  }
  if (REUSE.has(name)) {
    return 'reuse';
  }
  return 'new';
}

/**
 * 트리 라벨. reuse 는 회색 "스타터킷" 꼬리표를 달고, 스토리가 있으면 링크를 건다.
 *
 * Props:
 * @param {Object} node - projectStructure 노드 [Required]
 *
 * Example usage:
 * <NodeLabel node={ child } />
 */
function NodeLabel({ node }) {
  const klass = classify(node.name);
  const isReuse = klass === 'reuse';
  const body = (
    <Box component="span" sx={ { fontFamily: 'monospace', fontSize: 13 } }>
      { node.name }
    </Box>
  );
  return (
    <Stack direction="row" spacing={ 1 } alignItems="center" component="span">
      { node.storyId ? (
        <a
          href={ `?path=/story/${ node.storyId }` }
          target="_top"
          style={ { color: 'inherit' } }
        >
          { body }
        </a>
      ) : body }
      <Box
        component="span"
        sx={ {
          fontSize: 10,
          px: 0.6,
          border: '1px solid',
          borderColor: isReuse ? 'divider' : 'text.primary',
          color: isReuse ? 'text.disabled' : 'text.primary',
        } }
      >
        { isReuse ? '스타터킷' : klass }
      </Box>
      <Box component="span" sx={ { fontSize: 10, color: 'text.secondary' } }>
        { folderOf(node.category) }
      </Box>
    </Stack>
  );
}

/**
 * 노드를 TreeNode 가 받는 중첩 객체로 바꾼다.
 * reuse 는 펼치지 않고 한 줄로 접는다. ref 노드는 앞서 펼친 같은 컴포넌트다.
 */
function nodeToTree(node) {
  const out = {};
  const seen = {};

  for (const child of node.children || []) {
    if (child.ref) {
      out[`${ child.name } (참조)`] = '참조 · 위에서 펼친 같은 컴포넌트';
      continue;
    }
    if (/Context$|Provider$/.test(child.name)) {
      out[child.name] = DESCRIPTIONS[child.name] || 'Context/Provider';
      continue;
    }
    let key = child.name;
    if (seen[key] !== undefined) {
      seen[key] += 1;
      key = `${ child.name }#${ seen[key] }`;
    } else {
      seen[key] = 0;
    }
    if (classify(child.name) === 'reuse') {
      out[key] = `스타터킷 · ${ folderOf(child.category) }`;
      continue;
    }
    out[key] = nodeToTree(child);
  }

  for (const h of node.hooks || []) {
    out[h.name] = DESCRIPTIONS[h.name] || 'Hook';
  }

  for (const d of node.data || []) {
    out[d.name] = DESCRIPTIONS[d.name] || 'Data';
  }

  return out;
}

/** 트리를 훑어 이름과 분류를 모은다 */
function collect(node, acc = []) {
  for (const child of node.children || []) {
    if (!child.ref) {
      acc.push(child);
      collect(child, acc);
    }
  }
  return acc;
}

/** 페이지에서 섹션, 컴포넌트로 내려가는 시각 위계 */
export const Default = {
  render: () => {
    const root = projectStructure.root;
    const tree = nodeToTree(root);
    const nodes = collect(root).filter((n) => !/Context$|Provider$/.test(n.name));
    const inTree = {
      modified: nodes.filter((n) => classify(n.name) === 'modified').length,
      reuse: nodes.filter((n) => classify(n.name) === 'reuse').length,
      neo: nodes.filter((n) => classify(n.name) === 'new').length,
    };

    return (
      <DocSurface>
        <DocumentTitle
          title="Hierarchy"
          status="Available"
          note="페이지에서 섹션, 컴포넌트로 내려가는 분류 위계"
          brandName="Design System"
          systemName="Fame Algorithm"
          version="1.0"
        />
        <PageContainer>
          <Typography variant="h4" sx={ { fontWeight: 700, mb: 1 } }>
            Hierarchy
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={ { mb: 1 } }>
            <code>src/data/projectStructure.js</code> · 재생성: <code>pnpm generate-structure</code>
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={ { mb: 4 } }>
            분류는 스타터킷 `src/components` 와의 파일 diff 결과다. 판단이 아니라 비교 결과를 그대로 쓴다.
          </Typography>

          <SectionTitle title="분류별 수" description="파일 diff 인벤토리 기준" />
          <TableContainer sx={ { mb: 4 } }>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell sx={ { fontWeight: 600, width: 110 } }>분류</TableCell>
                  <TableCell sx={ { fontWeight: 600, width: 80 } } align="right">개수</TableCell>
                  <TableCell sx={ { fontWeight: 600, width: 90 } } align="right">스토리</TableCell>
                  <TableCell sx={ { fontWeight: 600, width: 260 } }>스토리북 분류</TableCell>
                  <TableCell sx={ { fontWeight: 600 } }>뜻</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                { CLASS_COUNTS.map((c) => (
                  <TableRow key={ c.klass }>
                    <TableCell sx={ { fontFamily: 'monospace', fontSize: 12 } }>{ c.klass }</TableCell>
                    <TableCell sx={ { fontFamily: 'monospace', fontSize: 12 } } align="right">{ c.count }</TableCell>
                    <TableCell sx={ { fontFamily: 'monospace', fontSize: 12 } } align="right">{ c.story }</TableCell>
                    <TableCell sx={ { fontFamily: 'monospace', fontSize: 12 } }>{ c.title }</TableCell>
                    <TableCell sx={ { fontSize: 12, color: 'text.secondary' } }>{ c.note }</TableCell>
                  </TableRow>
                )) }
              </TableBody>
            </Table>
          </TableContainer>

          <Box sx={ { mb: 4 } }>
            <Chip label={ `화면 트리 노드 ${ nodes.length }` } size="small" sx={ { mr: 1 } } />
            <Chip label={ `new ${ inTree.neo }` } size="small" sx={ { mr: 1 } } />
            <Chip label={ `modified ${ inTree.modified }` } size="small" sx={ { mr: 1 } } />
            <Chip label={ `reuse ${ inTree.reuse }` } size="small" />
          </Box>

          <SectionTitle title="용도별 그룹" description="Custom Component 아래 11개 묶음" />
          <TableContainer sx={ { mb: 4 } }>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell sx={ { fontWeight: 600, width: 230 } }>그룹</TableCell>
                  <TableCell sx={ { fontWeight: 600 } }>담은 것</TableCell>
                  <TableCell sx={ { fontWeight: 600, width: 140 } }>랜딩 도달</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                { GROUPS.map((g) => (
                  <TableRow key={ g.id }>
                    <TableCell sx={ { fontFamily: 'monospace', fontSize: 12 } }>{ g.id }</TableCell>
                    <TableCell sx={ { fontSize: 12 } }>{ g.what }</TableCell>
                    <TableCell sx={ { fontSize: 12, color: 'text.secondary' } }>{ g.wired }</TableCell>
                  </TableRow>
                )) }
              </TableBody>
            </Table>
          </TableContainer>

          <SectionTitle title="조립 순서" description="08 Domain Knowledge & Research 와 같은 목록" />
          <Stack spacing={ 1 } sx={ { mb: 4 } }>
            { ASSEMBLY_STEPS.map((step) => (
              <Stack key={ step.id } direction="row" spacing={ 1 } alignItems="center">
                <Chip label={ step.order } size="small" />
                <Typography variant="body2" sx={ { fontWeight: 600, minWidth: 130 } }>
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
            )) }
          </Stack>

          <SectionTitle
            title="화면 위계"
            description="Page 아래 Section, 그 아래 컴포넌트. 이름을 누르면 그 스토리로 간다"
          />
          <Box sx={ { p: 2, mb: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1 } }>
            <Box sx={ { fontFamily: 'monospace' } }>
              <TreeNode keyName={ root.name } value={ tree } depth={ 0 } defaultOpen />
            </Box>
          </Box>
          <Typography variant="body2" color="text.secondary" sx={ { mb: 4 } }>
            new 와 modified 만 펼친다. reuse 는 스타터킷 그대로라 한 줄로 접고 회색으로 둔다.
            이 화면의 트리에 reuse 노드가 하나도 없다는 것이 이 프로젝트의 성격이다.
            기성 컴포넌트가 커버하지 않는 화면(고정 영상, 가로 좌표계, 정량 카드)으로 이뤄져 있다.
          </Typography>

          <SectionTitle
            title="분류 라벨 미리보기"
            description="트리 라벨이 어떻게 보이는지. 스토리가 있는 노드만 링크가 걸린다"
          />
          <Stack spacing={ 1 } sx={ { mb: 4 } }>
            { nodes.slice(0, 12).map((n, i) => (
              <NodeLabel key={ `${ n.name }-${ i }` } node={ n } />
            )) }
          </Stack>

          <SectionTitle
            title="미연결"
            description={ `${ UNWIRED.length }건 · 파일은 있으나 화면에서 도달하지 않아 트리 밖이다` }
          />
          <TableContainer sx={ { mb: 2 } }>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell sx={ { fontWeight: 600, width: 110 } }>묶음</TableCell>
                  <TableCell sx={ { fontWeight: 600, width: 230 } }>이름</TableCell>
                  <TableCell sx={ { fontWeight: 600, width: 140 } }>폴더</TableCell>
                  <TableCell sx={ { fontWeight: 600 } }>비고</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                { UNWIRED.map((u) => (
                  <TableRow key={ u.name }>
                    <TableCell sx={ { fontSize: 12 } }>{ u.group }</TableCell>
                    <TableCell sx={ { fontFamily: 'monospace', fontSize: 12 } }>{ u.name }</TableCell>
                    <TableCell sx={ { fontFamily: 'monospace', fontSize: 12, color: 'text.secondary' } }>{ u.folder }</TableCell>
                    <TableCell sx={ { fontSize: 12, color: 'text.secondary' } }>{ u.note }</TableCell>
                  </TableRow>
                )) }
              </TableBody>
            </Table>
          </TableContainer>
          <Typography variant="body2" color="text.secondary">
            근거와 판정 방법은 02 UX Flow 5절의 &quot;미연결&quot; 행을 본다.
          </Typography>
        </PageContainer>
      </DocSurface>
    );
  },
};
