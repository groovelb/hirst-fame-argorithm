/**
 * assemblySteps.js
 *
 * 이 프로젝트가 만들어진 순서. 08 Domain Knowledge & Research 와
 * Custom Component/0. Hierarchy 가 같은 목록을 읽는다.
 *
 * 각 단계는 무엇을 했는지, 어떤 파일이 나왔는지, 스토리북 어디서 볼 수 있는지를 담는다.
 * storyId 는 스토리북 URL 의 `?path=/story/<storyId>` 값이다.
 */

/** 조립 5단계 */
export const ASSEMBLY_STEPS = [
  {
    id: 'research',
    order: 1,
    title: '리서치와 수집',
    what: '작품, 사건, 검색 지수, 생물 표본 수치를 공개 자료에서 모으고 도판을 내려받는다',
    outputs: [
      'src/data/hirst/hirst_works.json (72점)',
      'src/data/hirst/hirst_events.json (52건 + 연대기 7구획)',
      'data/hirst-trend-data.json (월별 266포인트)',
      'src/data/hirst/hirst-bio-specimen-data.js (12종 + 출처 21건)',
      'public/images/hirst/W*.jpg (72장)',
    ],
    scripts: [
      'scripts/fetch-hirst-images.mjs',
      'scripts/fetch-bio-specimen-images.mjs',
    ],
    storyId: 'overview-fame-algorithm-08-domain-knowledge-research--default',
    storyLabel: '08 Domain Knowledge & Research',
  },
  {
    id: 'curate',
    order: 2,
    title: '데이터 정리',
    what: '수집물을 사상축과 세계관 밴드로 묶고, 작품과 표본을 손으로 잇고, 에셋을 카탈로그한다',
    outputs: [
      'src/data/hirst/hirst_keyword_taxonomy.json (5축 60키워드)',
      'src/data/hirst/hirst_eras.json (연대기 7)',
      'src/data/hirst/hirst_work_bio_map.json (16건)',
      'src/data/hirst/hirst_bio_artwork_images.json (9건)',
      'src/data/assetManifest.json · src/data/assetInventory.js',
    ],
    scripts: [
      'scripts/build-asset-manifest.mjs',
      'scripts/generate-asset-inventory.js',
    ],
    storyId: 'overview-fame-algorithm-05-works-data--default',
    storyLabel: '05 Works Data',
  },
  {
    id: 'layout',
    order: 3,
    title: '타임라인 좌표계',
    what: '연도를 픽셀로, 사상 좌표를 밴드 높이로 바꾸는 계산을 세운다. 축, 곡선, 노드가 이 좌표를 공유한다',
    outputs: [
      'src/components/timeline/useTimelineLayout.js',
      'src/components/timeline/TimelineAxis.jsx',
      'src/components/timeline/TimelineTrendBackground.jsx',
      'src/components/timeline/TimelineWorkItem.jsx · TimelineEventItem.jsx',
    ],
    scripts: [],
    storyId: 'custom-component-2-timeline-canvas-usetimelinelayout--default',
    storyLabel: 'Custom Component / 2. Timeline Canvas',
  },
  {
    id: 'sections',
    order: 4,
    title: '화면 구획',
    what: '도입, 서사, 통람, 표본 집계를 각각 독립된 구획으로 만든다. 상세 오버레이가 그 위에 겹친다',
    outputs: [
      'src/components/templates/HeroSection.jsx · BridgeSection.jsx',
      'src/components/timeline/WorldviewTimeline.jsx',
      'src/components/timeline/SpecimenInfographicSection.jsx',
      'src/components/timeline/WorkFocusOverlay.jsx · PeakHoverOverlay.jsx',
    ],
    scripts: [],
    storyId: 'custom-component-1-hero-herosection--default',
    storyLabel: 'Custom Component / 1. Hero',
  },
  {
    id: 'landing',
    order: 5,
    title: '랜딩 조립',
    what: '구획을 한 흐름으로 잇고 지면 색 전환, 관성 스크롤, 대기 화면, 언어 토글을 얹는다',
    outputs: [
      'src/components/templates/LandingPage.jsx',
      'src/App.jsx (관성 스크롤과 로케일 공급)',
      'src/components/overlay-feedback/LoadingScreen.jsx',
    ],
    scripts: [],
    storyId: 'page-landingpage--default',
    storyLabel: 'Page / LandingPage',
  },
];

/** 학습시킨 도메인 데이터. 08 이 표로 그린다. */
export const RESEARCH_SOURCES = [
  {
    name: 'Work (작품)',
    file: 'src/data/hirst/hirst_works.json',
    taught: '1986년 이후 대표작 72점의 연도, 매체, 소장처, 의의, 사상축 가중치',
    origin: '작가 공식 카탈로그와 갤러리 도록을 사람이 큐레이션',
    flowsTo: 'useTimelineLayout → TimelineWorkItem, WorkFocusOverlay',
    seenAt: '05 Works Data',
  },
  {
    name: 'Event (사건)',
    file: 'src/data/hirst/hirst_events.json',
    taught: '생애와 전시와 시장 사건 52건, 그리고 연대기 7구획의 라벨과 띠 색',
    origin: '연보와 언론 보도를 사람이 큐레이션',
    flowsTo: 'useTimelineLayout → TimelineEventItem, TimelineAxis 시기 띠',
    seenAt: '05 Works Data',
  },
  {
    name: 'SearchTrend (검색 트렌드)',
    file: 'data/hirst-trend-data.json',
    taught: '2004년부터 2026년까지 월별 검색 지수 266포인트, 정점 5개와 그 계기 사건 12건',
    origin: 'Google Trends Worldwide 검색 지수 (최대 100 정규화)',
    flowsTo: 'TimelineTrendBackground 곡선과 정점 마커, PeakHoverOverlay',
    seenAt: '05 Works Data',
  },
  {
    name: 'Era (연대기)',
    file: 'src/data/hirst/hirst_eras.json',
    taught: '작업 인생을 7개 사상적 시기로 나눈 구획과 각 시기의 명제, 축 가중치 평균',
    origin: '작품과 사건을 사람이 다시 묶은 해석',
    flowsTo: 'EraSegment, EraThesisHeadline (현재 미연결)',
    seenAt: '05 Works Data',
  },
  {
    name: 'KeywordTaxonomy (사상축 사전)',
    file: 'src/data/hirst/hirst_keyword_taxonomy.json',
    taught: '5축(MORTALITY, SYSTEM, FAITH, VALUE, FORM)과 축별 키워드 12개씩 60개의 정의',
    origin: '큐레이션 어휘집. 작품의 axis_weights 키와 글자 단위로 맞춘다',
    flowsTo: 'TimelineCanvas 의 사상축 도넛 (표시 플래그 꺼짐)',
    seenAt: '05 Works Data',
  },
  {
    name: 'SpecimenLedger (표본 집계)',
    file: 'src/data/hirst/hirst-bio-specimen-data.js',
    taught: '작품에 쓰인 생물 12종의 작품 수와 개체 수, 검증 여부, 1차 자료 21건, 해석 단서 6건',
    origin: '경매 도록, 언론, 동물보호 단체 공식 성명을 대조',
    flowsTo: 'SpecimenInfographicSection 집계 카드, SpecimenDetailModal',
    seenAt: '05 Works Data · 07 Assets',
  },
  {
    name: 'WorkBioMap (작품 매핑)',
    file: 'src/data/hirst/hirst_work_bio_map.json',
    taught: '작품 id 와 표본 작품 id 를 잇는 수동 매핑 16건',
    origin: '두 데이터셋의 큐레이션 범위가 달라 고신뢰도만 손으로 채택',
    flowsTo: 'SpecimenDetailModal 의 연관 작품 도판',
    seenAt: '05 Works Data',
  },
  {
    name: 'BioArtworkImages (보조 도판)',
    file: 'src/data/hirst/hirst_bio_artwork_images.json',
    taught: '위 매핑에 없는 표본 작품 9건의 도판 경로',
    origin: 'Wikipedia 와 Wikimedia Commons 수집 (scripts/fetch-bio-specimen-images.mjs)',
    flowsTo: 'SpecimenDetailModal',
    seenAt: '05 Works Data · 07 Assets',
  },
  {
    name: 'AssetManifest / AssetInventory',
    file: 'src/data/assetManifest.json · src/data/assetInventory.js',
    taught: '에셋 200개의 경로, 종류, 용량, 쓰이는 곳, 만들어진 파이프라인',
    origin: 'scripts/build-asset-manifest.mjs · scripts/generate-asset-inventory.js',
    flowsTo: '07 Assets 갤러리, 05 Works Data 썸네일',
    seenAt: '07 Assets',
  },
  {
    name: 'i18n 카피',
    file: 'src/i18n/locales/{ko,en}/content.js · ui.js',
    taught: '세계관 밴드 5개의 해설 전문과 화면 라벨을 한국어와 영어 두 벌로',
    origin: '프로젝트가 직접 쓴 카피',
    flowsTo: 'BandLegend, WorkFocusOverlay, SpecimenInfographicSection',
    seenAt: '06 Content Data',
  },
  {
    name: '서사 장 카피',
    file: 'src/components/templates/bridgeNarrative.js',
    taught: '도입부 6개 장의 큰 글자와 해설. 죽음, 가격, 격자, 소각의 순서',
    origin: '프로젝트가 직접 쓴 카피. 수치는 위 데이터에서 인용',
    flowsTo: 'HeroSection 의 도입 선언, BridgeSection 카드 4장과 전환 장',
    seenAt: '06 Content Data',
  },
  {
    name: 'Rothko 팔레트 추출',
    file: 'public/images/rothko/*.jpg (61장)',
    taught: '앞선 코드베이스가 쓰던 작품별 색 분포. 이 프로젝트에서는 폐기한 전제',
    origin: 'scripts/extract-rothko-colors.mjs (수평 밴드 분석 + k-means)',
    flowsTo: 'ColorDonutChart · ColorDetailModal (색 컨셉 원형으로만 보존)',
    seenAt: '07 Assets · Common/Assets/Rothko Reference',
  },
];

/** 레퍼런스 이미지의 성격을 한 줄로. 08 이 격자 아래에 적는다. */
export const REFERENCE_SOURCES_NOTE =
  '타이거 상어 해부와 체형 사진은 코드로 만든 3D 모델의 비례 근거다. '
  + '비트린 참고는 실제 전시 사진에서 프레임 두께와 받침대 비율을 읽어내는 데 썼다. '
  + '두 폴더 모두 화면에 직접 나오지 않고 제작 단계에서만 쓰인다.';

/** 레퍼런스 이미지 폴더. 08 이 격자로 그린다. */
export const REFERENCE_FOLDERS = [
  { folder: 'reference/galeocerdo-cuvier', root: 'public', note: '타이거 상어 해부와 체형 참고 사진' },
  { folder: 'reference', root: 'src/assets', note: '비트린과 지느러미 모델링 참고' },
];

/** 리서치 결과를 이미지 생성 지시로 옮긴 문서 */
export const RESEARCH_DOCS = [
  {
    file: 'docs/hirst/specimen-infographic-image-plan.md',
    what: '표본 인포그래픽 도판 8종의 규격, 공유 아트 디렉션, 공유 네거티브 프롬프트, 전문 프롬프트',
    result: 'public/images/hirst/specimen-infographic/*.png (9장)',
  },
  {
    file: 'docs/hirst/landing-mobile-responsive-plan.md',
    what: '좁은 화면에서 깨지는 네 곳과 md 분기 전략',
    result: 'LandingPage 와 WorldviewTimeline 의 반응형 분기',
  },
  {
    file: 'docs/hirst/appendix-landing-implementation.md',
    what: '도입 구획의 스크롤 진행도 매핑과 컴포넌트 트리 청사진',
    result: 'HeroSection 의 진행도 계산',
  },
  {
    file: 'docs/hirst/appendix-screen-component-map.md',
    what: '앞선 코드베이스 컴포넌트를 어떤 의미로 재정의할지의 1:1 매핑',
    result: 'timeline 폴더의 이름과 역할',
  },
];
