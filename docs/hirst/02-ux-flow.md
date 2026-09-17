# Fame Algorithm: UX Flow

> 이 문서가 결정하는 것: 각 과업을 어떤 화면과 데이터로 이루는가
> 입력: 01 4절 사용자·대상, 01 5절 과업 · 출력 대상: 03-visual-direction, /supabase-integration, /component-work (넘기는 항목은 이 문서 6절 표)

## 결정 현황

이 표의 확정 항목만 다음 문서가 그대로 인용한다. 잠정은 `(잠정)` 표시를 달고 인용하고, 미정은 인용하지 않는다.

| 섹션 | 상태 | 비고 |
|---|---|---|
| 1. UX-flow 시나리오 | 확정 | 예외 칸은 코드 근거 |
| 2.1 페이지 리스트 | 확정 | 라우트는 하나 |
| 2.2 계층 트리 | 확정 | |
| 3.1 대상 정의 | 확정 | 01 4.2절 7행 그대로 |
| 3.2 이름 사전 | 확정 | 서버 데이터 없음 |
| 4. 인터랙션 원칙 | 잠정 | 코드에서 역추출 (Q3) |
| 5. 컴포넌트 리스트 | 확정 | 파일 diff로 대조 |
| 6. 다음 문서로 넘기는 것 | 확정 | |

문서 상태: 잠정 승인 (하드 게이트 충족)
개정: 2026-09-17 v4 · 변경: 새 포맷으로 재구성, 검증 결함과 원문 토큰 누락 반영 (교육 예제)

비고:

- **2.1절 근거**: 라우트는 `/` 하나다. 앵커 경로는 코드에 없어 원문의 `/#hero` 같은 표기를 지웠다. 페이지 칸은 화면에서 이어지는 구역 이름이다.
- **3.1절 근거**: 01 4.2절의 확정 7행을 그대로 받았다. 영속성은 `src/data/hirst/`, `data/hirst-trend-data.json`, `src/components/templates/bridgeNarrative.js`로 확인했다.
- **4절 잠정**: 원칙 자체는 원문에 없었다. 구현된 스크롤과 오버레이 동작에서 역추출했다 (Q3).
- **5절 근거**: 스타터킷 `src/components`와 파일 단위 diff. 공유 176파일 중 9개가 다르고 60개가 이 저장소에만 있다.
- **부록**: 구현 디테일은 `appendix-landing-implementation.md`와 `appendix-screen-component-map.md`에 있다. 두 부록은 원문 시점 그대로 두었다.
- **분량**: 268줄(권장 250). 1절 시나리오 비고를 부록으로 분리하면 줄일 수 있다.

---

## 1. UX-flow 시나리오 (01 5절 과업과 1:1)

R 읽기 · W 생성 · D 갱신/삭제.

### 1.1 그가 어떻게 시스템이 되었는지 도입에서 잡는다

- **사용자**: 일반 관람객
- **진입**: 직접 방문 · **성공 조건**: 다섯 장의 서사를 지나 전환 장에 도달 · **예외**: 도입 영상을 다 받기 전에는 진행률과 함께 대기 화면이 덮는다

| 단계 | 화면 | 사용자 행동 | 다루는 대상 (R/W/D) | 결과 |
|---|---|---|---|---|
| 1 | Hero | 첫 화면을 본다 | 없음 (정적 시각) | 이름과 기간이 화면 폭을 채운다 |
| 2 | Hero | 아래로 스크롤한다 | 없음 | 스크롤이 도입 영상의 재생 위치가 된다 |
| 3 | Hero | 도입 선언을 읽는다 | NarrativeChapter R | 흰 지면이 검은 지면으로 넘어간다 |
| 4 | Bridge | 네 개의 장을 지난다 | NarrativeChapter R (몇 개) | 죽음, 가격, 격자, 소각의 순서 |
| 5 | Bridge | 전환 장에 도달한다 | NarrativeChapter R | 다음은 작품이 아니라 수요 곡선이다 |

비고:

- 단계 1: 위쪽 줄은 DAMIEN HIRST, 아래쪽 줄은 활동 기간과 FAME ALGORITHM이다.
- 단계 2: 영상은 내려받아 메모리에 올린 뒤에야 스크럽된다. 그 전까지가 단계 0의 대기 화면이다.
- 단계 4: 네 장은 나란한 두 줄이 아니라 서로 다른 높이에서 서로 다른 속도로 지나간다.

### 1.2 30년 수요 곡선 위의 작품과 사건을 시간 순으로 본다

- **사용자**: 일반 관람객, 큐레이터
- **진입**: 전환 장 직후 · **성공 조건**: 1986년부터 2026년까지 통람 · **예외**: 좁은 화면에서는 연도당 폭과 노드 크기가 줄어든다

| 단계 | 화면 | 사용자 행동 | 다루는 대상 (R/W/D) | 결과 |
|---|---|---|---|---|
| 1 | Timeline | 계속 아래로 스크롤한다 | SearchTrend R | 세로 스크롤이 가로 이동으로 바뀐다 |
| 2 | Timeline | 검색 지수 곡선을 따라간다 | SearchTrend R | 곡선이 오른쪽으로 그려지며 드러난다 |
| 3 | Timeline | 곡선 위 작품을 훑는다 | Work R (많음), WorldviewBand R | 작품이 사상의 띠 높이에 놓인다 |
| 4 | Timeline | 축 아래 사건을 본다 | Event R (많음), Era R | 연도 눈금과 시기 구획이 함께 읽힌다 |
| 5 | 전역 오버레이 | 미니맵으로 건너뛴다 | Work R | 원하는 연도 구간으로 이동한다 |

비고:

- 단계 1: 가로 이동 거리는 전체 폭에서 화면 폭을 뺀 만큼이다. 축은 1986년에서 2026년까지다.
- 단계 3: 화면 밖 작품의 도판은 미리 받지 않는다(이미지 지연 로드).

### 1.3 작품 하나 또는 명성의 정점 하나를 열어 맥락을 읽는다

- **사용자**: 큐레이터
- **진입**: Timeline 통람 중 · **성공 조건**: 상세를 읽고 닫아 통람으로 복귀 · **예외**: 없음

| 단계 | 화면 | 사용자 행동 | 다루는 대상 (R/W/D) | 결과 |
|---|---|---|---|---|
| 1 | Timeline | 작품 위에 마우스를 올린다 | Work R | 그 작품만 남고 나머지가 흐려진다 |
| 2 | 전역 오버레이 | 작품을 누른다 | Work R, WorldviewBand R | 도판과 함께 시기, 매체, 의의가 열린다 |
| 3 | Timeline | 곡선의 정점을 누른다 | SearchTrend R, Event R | 그 정점을 만든 사건의 상세가 열린다 |
| 4 | 전역 오버레이 | 상세를 닫는다 | 없음 | 보던 자리로 돌아오고 미니맵이 다시 뜬다 |

비고: 상세가 열려 있는 동안 미니맵, 범례, 언어 토글은 함께 사라진다. 읽는 일 하나만 남긴다.

### 1.4 작품에 쓰인 생물의 종과 개체 수를 확인한다

- **사용자**: 일반 관람객, 기자
- **진입**: Timeline 통람을 마친 직후 · **성공 조건**: 총합과 종별 수치를 확인 · **예외**: 공개되지 않은 개체 수는 수치 대신 미공개로 적힌다

| 단계 | 화면 | 사용자 행동 | 다루는 대상 (R/W/D) | 결과 |
|---|---|---|---|---|
| 1 | Specimen Ledger | 집계 머리글을 본다 | SpecimenLedger R | 총합, 나비 수, 인간 유해, 기준일 |
| 2 | Specimen Ledger | 종별 카드를 훑는다 | SpecimenLedger R (몇 개) | 도판과 학명과 개체 수가 한 벌로 |
| 3 | 전역 오버레이 | 종 카드를 누른다 | SpecimenLedger R, Work R | 그 종이 쓰인 작품들이 함께 열린다 |
| 4 | 전역 오버레이 | 닫고 페이지를 마친다 | 없음 | 수치와 기준일이 마지막 인상이 된다 |

---

## 2. 정보 구조

### 2.1 페이지 리스트

| 페이지 | 경로 | 한 줄 목적 | 다루는 대상 | 등장 시나리오 |
|---|---|---|---|---|
| Hero | `/` | 이름과 도입 영상으로 첫 인상을 만든다 | NarrativeChapter | 1 |
| Bridge | `/` | 다섯 장의 서사로 질문을 세운다 | NarrativeChapter | 1 |
| Timeline | `/` | 수요 곡선 위에 작품과 사건을 얹는다 | SearchTrend, Work, Event, Era, WorldviewBand | 2, 3 |
| Specimen Ledger | `/` | 종별 작품 수와 개체 수를 집계한다 | SpecimenLedger, Work | 4 |
| 전역 오버레이 | 경로 없음 | 상세, 미니맵, 범례, 언어, 대기 화면 | Work, Event, SpecimenLedger | 1, 2, 3, 4 |

비고: 라우트는 `/` 하나다. 네 구역은 한 흐름 안에서 이어지고, 전역 오버레이는 그 위에 겹친다.

### 2.2 계층 트리

```
Landing (/)
├── Hero
│   ├── 고정 영상 (스크롤이 재생 위치)
│   ├── 상단 이름 타이포 + 하단 기간 타이포
│   └── 도입 선언 장
├── Bridge
│   ├── 네 장 (죽음 / 가격 / 격자 / 소각)
│   └── 전환 장
├── Timeline
│   ├── 검색 지수 곡선 + 정점 마커
│   ├── 연도 축 + 시기 구획
│   ├── 작품 노드 (사상 띠 높이)
│   └── 사건 노드 (축 아래)
└── Specimen Ledger
    ├── 집계 머리글 (총합 / 기준일)
    └── 종별 카드 그리드

전역 오버레이 (경로 없음)
├── 대기 화면 (진행률)
├── 미니맵 + 밴드 범례
├── 작품 상세 / 정점 상세 / 종 상세
└── 언어 토글
```

---

## 3. 데이터 모델 (01 4.2절 이름 그대로)

### 3.1 대상 정의

정의와 영속성:

| 이름 | 식별자 | 주요 속성 (윤곽) | 영속성 |
|---|---|---|---|
| 작품 | Work | 연도, 제목, 매체, 사상축 가중치, 좌표 | 정적 |
| 사건 | Event | 연도, 분류, 시기, 중요도, 본문 | 정적 |
| 검색 트렌드 | SearchTrend | 월별 지수 계열, 정점, 사건 연결 키 | 정적 |
| 연대기 | Era | 식별자, 연도 범위, 라벨, 띠 표현값 | 정적 |
| 세계관 밴드 | WorldviewBand | 식별자, 값 구간, 표시 행 비율 | 정적 |
| 서사 장 | NarrativeChapter | 식별자, 변형, 큰 글자, 해설, 픽토그램 | 정적 |
| 표본 집계 | SpecimenLedger | 종 키, 학명, 작품 수, 개체 수, 검증 여부 | 정적 |

흐름과 관계:

| 이름 | 만드는 곳 | 보이는 페이지 | 관계 |
|---|---|---|---|
| 작품 | 정적 데이터 | Timeline, 전역 오버레이 | Era와 WorldviewBand에 배속 |
| 사건 | 정적 데이터 | Timeline, 전역 오버레이 | SearchTrend 정점이 참조 |
| 검색 트렌드 | 정적 데이터 | Timeline | 정점이 Event를 가리킨다 |
| 연대기 | 정적 데이터 | Timeline | Work와 Event의 시기 구획 |
| 세계관 밴드 | 정적 데이터 | Timeline, 전역 오버레이 | Work의 세로 위치를 정한다 |
| 서사 장 | 정적 데이터 | Hero, Bridge | 다른 대상과 연결 없음 |
| 표본 집계 | 정적 데이터 | Specimen Ledger, 전역 오버레이 | Work를 종별로 되짚는다 |

비고:

- 영속성 값은 정적 / 휘발 / 세션 / 브라우저 / 서버다. 이 프로젝트는 전부 정적이다.
- 사건은 두 갈래 출처를 합쳐 쓴다. 축 아래 노드는 연대기 데이터의 사건이고, 정점 상세는 트렌드 데이터의 사건 해설이다.
- 작품의 사상축 가중치는 다섯 키를 갖는다. 별도 대상이 아니라 작품의 속성이다. 축별 키워드 사전은 `hirst_keyword_taxonomy.json`에 따로 있다.
- 작품에는 앞선 코드베이스가 쓰던 `color_blocks` 필드가 남아 있다. 색 기반 표현을 버린 뒤로는 읽지 않는다.
- 표본 집계의 원천은 `src/data/hirst/hirst-bio-specimen-data.js`다. 저장소 루트의 `data/hirst-bio-specimen-data.js`는 갱신 전 사본이고 화면이 읽지 않는다.
- 스크롤 위치, 상세 열림 여부, 언어 선택은 화면 상태이지 다루는 대상이 아니다.

### 3.2 데이터 모델 활용 (이름 사전)

| 데이터명 | 한국어 | 코드 식별자 | 예상 테이블명 | 생성 책임 페이지 |
|---|---|---|---|---|
| `Work` | 작품 | `work` | (정적) | 없음 |
| `Event` | 사건 | `event` | (정적) | 없음 |
| `SearchTrend` | 검색 트렌드 | `searchTrend` | (정적) | 없음 |
| `Era` | 연대기 | `era` | (정적) | 없음 |
| `WorldviewBand` | 세계관 밴드 | `worldviewBand` | (정적) | 없음 |
| `NarrativeChapter` | 서사 장 | `narrativeChapter` | (정적) | 없음 |
| `SpecimenLedger` | 표본 집계 | `specimenLedger` | (정적) | 없음 |

비고:

- 서버 데이터가 없는 프로젝트다. `/supabase-integration`을 부르게 되면 이 표부터 다시 정한다.
- 원문이 검증해 둔 예상 테이블명(`works`, `events`, `sources` 등 8종)은 서버 도입 시의 계약 후보다. 2026-05-07 기준으로 예약어 충돌이 없음을 확인해 두었다. `user`, `order`, `group`, `references` 같은 흔한 충돌어를 쓰지 않는다.

---

## 4. 인터랙션 원칙 (최대 5)

| 원칙 | 근거 (01 3절 가치) | 드러나는 곳 | 유도되는 컴포넌트 유형 |
|---|---|---|---|
| 스크롤이 재생 헤드다 | Index | Hero | 스크럽 영상, 고정 영역 |
| 세로 스크롤을 가로 이동으로 바꾼다 | Index | Timeline | 가로 스크롤 컨테이너, 미니맵 |
| 수치는 도판보다 크게 쓴다 | Empiricism | Timeline, Specimen Ledger | 집계 머리글, 정량 카드 |
| 하나를 열면 나머지는 사라진다 | Quiet Brutality | 전역 오버레이 | 풀스크린 상세, 조건부 표시 |
| 두 언어를 같은 무게로 놓는다 | Empiricism | 전 구역 | 로케일 제공자, 언어 토글 |

비고:

- 원칙 1: 도입 영상은 전체를 내려받아 메모리에 올린 뒤 스크럽한다. 대기 화면의 진행률이 그 대가다.
- 원칙 4: 상세가 열리면 미니맵, 범례, 언어 토글이 함께 숨는다. 표본 구역에 들어가도 같다.

---

## 5. 컴포넌트 리스트

| 컴포넌트 | 페이지/섹션 | 구분 | 카테고리 | 비고 |
|---|---|---|---|---|
| LandingPage | 전역 | 신규 | templates | 지면 색 전환과 구역 배치 |
| LoadingScreen | 전역 오버레이 | 신규 | overlay-feedback | 영상 진행률 표시 |
| LanguageToggle | 전역 오버레이 | 신규 | navigation | 4절 원칙 5 |
| HeroSection | Hero | 신규 | templates | 고정 영상 + 타이포 자리 공유 |
| VideoScrubbing | Hero | 수정 | scroll | 전체 내려받기, 진행률, 인앱 우회 |
| HeroTypeBlock | Hero | 신규 | typography | 단어별 패럴럭스 |
| FitText | Hero | 수정 | typography | 자식 노드 모드, 서체 prop |
| BridgeSection | Hero, Bridge | 신규 | templates | 서사 장 한 개를 그린다 |
| WorldviewTimeline | Timeline | 신규 | timeline | 통람 전체를 묶는 셸 |
| HorizontalScrollContainer | Timeline | 수정 | content-transition | 주소창 대응, 동적 뷰포트 높이 |
| TimelineCanvas | Timeline | 신규 | timeline | 절대 좌표 캔버스 |
| useTimelineLayout | Timeline | 신규 | timeline | 연도와 밴드를 좌표로 |
| TimelineTrendBackground | Timeline | 신규 | timeline | 검색 지수 곡선과 정점 |
| TimelineAxis | Timeline | 신규 | timeline | 연도 눈금, 시기 구획 |
| TimelineWorkItem, WorkImage | Timeline | 신규 | timeline | 작품 노드와 도판 |
| TimelineEventItem | Timeline | 신규 | timeline | 축 아래 사건 노드 |
| TimelineMinimap | 전역 오버레이 | 신규 | timeline | 4절 원칙 2 |
| BandLegend | 전역 오버레이 | 신규 | timeline | 다섯 밴드 범례 |
| WorkFocusOverlay | 전역 오버레이 | 신규 | timeline | 작품 상세 |
| PeakHoverOverlay | 전역 오버레이 | 신규 | timeline | 정점 사건 상세 |
| SpecimenInfographicSection | Specimen Ledger | 신규 | timeline | 집계 머리글과 카드 그리드 |
| SpecimenDetailModal | 전역 오버레이 | 신규 | timeline | 종별 연관 작품 |
| ColorDonutChart, ColorDetailModal | Timeline | 신규 | timeline | 하단 패널 전용, 플래그 꺼짐 |
| Era 화면 묶음 (11) | 미연결 | 신규 | 7개 폴더 혼재 | 원문 설계의 연대기 화면 |
| 상어 3D 묶음 (15) | 미연결 | 신규 | shark-modeling, tiger-shark | 스크럽 영상으로 대체됨 |
| RothkoTimeline, TimelineEmotionCurve | 미연결 | 신규 | timeline | 앞선 코드베이스 원형 보존 |

비고:

- **합계**: 재활용 0 · 수정 3 · 신규 23 (행 기준, 한 행에 묶인 파일은 한 건). 파일 단위로는 공유 176개 중 재활용 107, 수정 9, 신규 60이다.
- **구분 근거**: 스타터킷 `src/components`와 같은 상대 경로의 파일을 내용까지 비교했다. 내용이 다른 3개(VideoScrubbing, FitText, HorizontalScrollContainer)가 수정, 이 저장소에만 있는 파일이 신규다. 나머지 수정 6개는 barrel 5개와 스토리 파일 1개라 표에 넣지 않았다.
- **재활용 제외**: 스타터킷 컴포넌트를 화면에 쓴 곳이 없다. 이 프로젝트는 고정 영상, 가로 좌표계, 정량 카드처럼 기성 컴포넌트가 없는 화면으로 이뤄져 있다. 단, 세 개의 수정 항목은 스타터킷 파일을 이어받아 고친 것이다. 원문 03이 표본 그리드 후보로 들었던 `BentoGrid`와 `LineGrid`도 쓰지 않았다.
- **미연결 표기**: 화면 진입점에서 도달하지 않는 컴포넌트다. 원문 설계의 연대기 화면 11개는 코드로 남았지만 어느 화면도 부르지 않는다. 상어 3D 묶음은 도입부의 3D 비트린 계획이 사전 렌더 영상으로 바뀌면서 남은 것이다.
- **카테고리**: timeline, shark-modeling, tiger-shark는 이 프로젝트가 추가한 폴더다 (`directory-structure.md` 목록 밖).
- **묶음 구성**: Era 화면 묶음 = HirstWorldviewTimeline, EraSegment, EraThesisHeadline, EraEventStrip, WorldviewMiniMap, BestiaryGrid, SpeciesStatCard, SpecimenCountBadge, SourceChip, CaveatNote, WorkDetailModal (timeline, layout, card, typography, data-display, navigation, overlay-feedback 7개 폴더에 흩어져 있다). 상어 3D 묶음 = shark-modeling 7(`SharkVitrine` 외) + tiger-shark 8 (컴포넌트 기준, barrel과 스토리와 헬퍼 제외).

---

## 6. 다음 문서로 넘기는 것

| 받는 곳 | 가져가는 것 |
|---|---|
| 03-visual-direction | 2.1절 페이지 목록, 페이지별 콘텐츠 신호, 4절 원칙 |
| /supabase-integration | 3.2절 사전, 2.1절, 1절 단계 표, 5절 컴포넌트 리스트 |
| /component-work | 5절 신규·수정 항목 |
