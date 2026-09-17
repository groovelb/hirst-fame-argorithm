import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import {
  DocumentTitle,
  PageContainer,
  TreeNode,
} from '../../components/storybookDocumentation';
import projectStructure from '../../data/projectStructure.js';

export default {
  title: 'Overview/Fame Algorithm/04 Project Structure',
  parameters: {
    layout: 'padded',
  },
};

/**
 * 컴포넌트가 아닌 항목(Hook / Context / Data)의 목적·역할 설명.
 * 파일 이름 또는 export 이름을 키로 사용한다.
 */
const DESCRIPTIONS = {
  // Data
  hirst_works: 'Data · 작품(Work) 72점. 연도·매체·사상축 가중치',
  hirst_events: 'Data · 사건(Event) 52건 + 연대기(Era) 7구획',
  'hirst-bio-specimen-data': 'Data · 표본 집계(SpecimenLedger) 12종',
  'hirst-trend-data': 'Data · 검색 트렌드(SearchTrend) 월별 266포인트',
  bridgeNarrative: 'Data · 서사 장(NarrativeChapter) 6개 카피',
  assetManifest: 'Data · 에셋 카탈로그 9카테고리 171건',
  projectStructure: 'Data · 프로젝트 구조 자동 생성 데이터',
  componentTokenMap: 'Data · 컴포넌트와 디자인 토큰 매핑',
  ruleRelationships: 'Data · Rules와 Skills 관계 그래프',
  layoutTaxonomyData: 'Data · 레이아웃 아키타입 택소노미',

  // Context / Provider
  LocaleProvider: 'Provider · 한국어와 영어 로케일 제공',

  // Hooks
  useLenisScroll: 'Hook · 관성 스크롤 초기화 (duration 1.1)',
  useLocale: 'Hook · 현재 로케일과 localized() 소비',
  useTimelineLayout: 'Hook · 연도와 밴드를 캔버스 좌표로 변환',
};

/** Context/Provider 이름 패턴 */
const isContextName = (name) => /Context$|Provider$/.test(name);

/**
 * 트리 노드를 TreeNode 가 받을 수 있는 중첩 객체로 변환.
 * - 컴포넌트: 중첩 객체 (자식 컴포넌트 포함)
 * - Context/Provider: 자식 유무와 상관없이 리프(설명 문자열)로 표시
 * - Hooks/Data: 리프(설명 문자열)
 */
function nodeToTree(node) {
  const out = {};
  const nameCount = {};

  for (const child of node.children || []) {
    if (isContextName(child.name)) {
      out[child.name] = DESCRIPTIONS[child.name] || 'Context/Provider';
      continue;
    }
    let key = child.name;
    if (nameCount[key] !== undefined) {
      nameCount[key] += 1;
      key = `${ child.name }#${ nameCount[key] }`;
    } else {
      nameCount[key] = 0;
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

/** Project Structure - App.jsx 를 루트로 한 전체 구조 트리 탐색기 */
export const Default = {
  render: () => {
    const root = projectStructure.root;
    const tree = nodeToTree(root);

    return (
      <>
        <DocumentTitle
          title="Project Structure"
          status="Available"
          note="App.jsx 를 루트로 한 전체 컴포넌트 포함 관계"
          brandName="Design System"
          systemName="Fame Algorithm"
          version="1.0"
        />
        <PageContainer>
          <Typography variant="h4" sx={ { fontWeight: 700, mb: 1 } }>
            Project Structure
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={ { mb: 1 } }>
            클릭하여 펼치기/접기 | <code>src/App.jsx</code> · 재생성: <code>pnpm generate-structure</code>
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={ { mb: 1 } }>
            컴포넌트는 중첩 구조로, 컴포넌트가 아닌 항목(Hook · Context · Data)은 목적·역할 설명과 함께 리프로 표시한다.
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={ { mb: 3 } }>
            생성 시각: <code>{ projectStructure.generatedAt }</code>
          </Typography>

          <Box sx={ { p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1 } }>
            <Box sx={ { fontFamily: 'monospace' } }>
              <TreeNode keyName={ root.name } value={ tree } depth={ 0 } defaultOpen />
            </Box>
          </Box>

          <Typography variant="body2" color="text.secondary" sx={ { mt: 3 } }>
            트리가 LandingPage의 Hero와 Bridge 갈래에서 멈춘다. 통람 화면은 별칭 import로
            연결되어 있어 생성기가 따라가지 못한 구간이다. 그 갈래의 구성은
            02 UX Flow 문서의 2.2절 계층 트리와 5절 컴포넌트 리스트를 본다.
          </Typography>
        </PageContainer>
      </>
    );
  },
};
