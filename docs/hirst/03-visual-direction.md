# Fame Algorithm: Visual Direction

> 이 문서가 결정하는 것: 정체성과 화면이 어떻게 보이는가
> 입력: 01 3절 정체성, 02 2.1절 페이지, 02 4절 원칙 · 출력 대상: theme.js, /component-work, /layout-composer, /visual-asset-prompt (넘기는 항목은 이 문서 6절 표)

## 결정 현황

이 표의 확정 항목만 다음 문서가 그대로 인용한다. 잠정은 `(잠정)` 표시를 달고 인용하고, 미정은 인용하지 않는다.

| 섹션 | 상태 | 비고 |
|---|---|---|
| 1. 무드 | 확정 | 원문 톤앤매너 갱신 |
| 2. 레이아웃 전략 | 잠정 | 배정 미승인 (Q4) |
| 3.1 색 | 확정 | 테마 실제 값 |
| 3.2 타이포 | 확정 | 테마와 코드 실제 값 |
| 3.3 형태·표면·모션 | 확정 | 테마 실제 값 |
| 4. 이미지·에셋 방향 | 확정 | 수집·생성 스크립트 |
| 4.1 레퍼런스 | 미정 | 제공 자료 없음 |
| 5. 변경 토큰 요약 | 확정 | 현재값은 스타터킷 |
| 6. 다음 문서로 넘기는 것 | 확정 | |

문서 상태: 잠정 승인 (하드 게이트 충족)
개정: 2026-09-17 v3 · 변경: 새 포맷으로 재구성 후 검증 결함 반영 (교육 예제)

비고:

- **2절 잠정**: 아키타입 id는 `src/data/layoutTaxonomyData.js` 목록에서 골랐고, 페이지별 배정은 화면 구성에서 추론했다 (Q4).
- **3절 값 출처**: `src/styles/themes/default.js`(palette, typography, shape, shadows, breakpoints), `src/styles/themes/tokens.js`(2단 색 토큰), `src/components/timeline/typography.js`(서체 토큰), `src/App.jsx`(관성 스크롤).
- **5절 현재값 출처**: 스타터킷 `src/styles/themes/default.js`. 이 저장소 테마와 파일 단위로 비교해 채웠다.
- **결정 보류 항목 처리**: 원문 03의 2026-05-07 보류 3건 중 헤딩 서체는 확정(Georgia 유지), 사상축 색 검증은 미정(Q5), 이미지 자산은 실제 수집으로 해소돼 4절로 옮겼다.
- **폐기된 방향**: 원문 03이 제안한 본 화이트 지면(`#F4F1EA`)과 포름알데히드 잉크(`#0F1A1F`)는 채택되지 않았다. 지면은 흰색과 차가운 잉크 검정 두 상태로 갈라졌다. 원문이 제안한 타이포 변경 4건(h1 3.25rem, h1 자간 -0.03em, overline 자간 0.16em, overline 웨이트 700)도 적용되지 않아 5절에서 뺐다.
- **분량**: 220줄(권장 200). 4절 에셋별 방향을 부록으로 분리하면 줄일 수 있다.

---

## 1. 무드

- **키워드** (최대 5, 01 3.2절에서 파생): Specimen Plate · Cool Ink Black · Monumental Type · Ledger · Engraved Bitmap
- **태도 선언** (최대 3): 지면은 흰 상태와 검은 상태 둘뿐이고 그 사이는 스크롤이 만든다. 강도는 연출이 아니라 수치와 도판에서 나온다. 색은 뉴트럴을 차갑게 미는 정도로만 쓴다.
- **하지 않는 것** (최대 5): 그라디언트와 글로우 · 둥근 모서리 · 따뜻한 세피아와 아이보리 · 채도 높은 다색 UI · 장식 아이콘

---

## 2. 레이아웃 전략

구조:

| 페이지 (02 2.1절) | 공간 모델 | 아키타입 | 구분 언어 |
|---|---|---|---|
| Hero | 고정 | full-bleed-hero + pinned-section (잠정, Q4) | 여백 |
| Bridge | 유동 | broken-grid + parallax (잠정, Q4) | 여백 |
| Timeline | 유동 | horizontal-scroll + layer-cake (잠정, Q4) | 선 |
| Specimen Ledger | 혼합 | uniform-card-grid + stat-band (잠정, Q4) | 여백 |
| 전역 오버레이 | 고정 | modal-centric-flow + z-axis-layering (잠정, Q4) | 면 |

콘텐츠 신호 (/layout-composer 입력):

| 페이지 | 밀도 | text / media / repeat / hierarchy |
|---|---|---|
| Hero | airy | micro / dominant / single / two-tier |
| Bridge | airy | short / accent / few / two-tier |
| Timeline | compact | micro / dominant / many / deep |
| Specimen Ledger | compact | micro / balanced / many / two-tier |
| 전역 오버레이 | airy | long / dominant / few / two-tier |

- 공간 모델: 유동 / 고정 / 혼합. 아키타입: `src/data/layoutTaxonomyData.js`의 id. 구분 언어: 선 / 면 / 여백.
- 전역 리듬: 세로 간격은 뷰포트 비례다. 서사 구역의 상하 여백은 좁은 화면 12vh, md 이상 28vh로 두 배 이상 벌어진다. 좌우 여백도 4vw에서 8vw로 단계적으로 넓힌다. 높이 단위는 `vh`가 아니라 `dvh`를 쓴다. 모바일 주소창이 접히고 펼쳐질 때 고정 영역이 튀지 않게 하려는 선택이다.
- 주 분기는 md(900)이고, 통람 화면만 sm·md·lg 3단계로 더 나뉜다. md 아래에서는 서사 카드의 패럴럭스를 끄고 정적으로 쌓으며, 통람 화면의 연도당 폭과 노드 크기를 단계적으로 줄인다.

---

## 3. 토큰 방향

### 3.1 색 (역할 팔레트)

| 역할 | 이름 | 값 | MUI 토큰 | 근거 (01 3절) |
|---|---|---|---|---|
| 지면 밝은 상태 | Page White | `#FFFFFF` | `background.default` | 도입 영상과 일치 |
| 지면 어두운 상태 | Cool Ink Black | `#08090F` | `TOKENS.bg.dark` | Quiet Brutality |
| 어두운 지면 위 글 | Cool Off White | `#ECF1FA` | `TOKENS.text.onDark` | 차가운 뉴트럴 |
| 밝은 지면 위 글 | Cool Ink Black | `#08090F` | `TOKENS.text.onLight` | 같은 잉크 한 벌 |
| 브랜드 악센트 | Brand Blue | `#6666FF` | `primary.main` | 도판 리타이닝 기준 |
| 악센트 보조 | Brand Blue Light | `#9999FF` | `primary.light` | 상태 변화용 |
| 구분선 | 잉크 40% | `rgba(236,241,250,0.4)` | `TOKENS.divider.onDark` | 선이 구분 언어 |
| 최대 정점 마커 | Peak Red | `#E63946` | (컴포넌트 상수) | Index, 단 하나 |
| 종이 표면 | Panel Black | `#141414` | `background.paper` | 카드와 패널 |

비고:

- 색 토큰은 2단이다. 원시값 계층(`PRIMITIVE`)은 직접 쓰지 않고 용도 계층(`TOKENS`)만 컴포넌트가 쓴다.
- 흑백을 파랑 채널만 미세하게 올려 차갑게 그레이딩했다. 검정은 R8 G9 B15, 오프화이트는 R236 G241 B250이다.
- 지면 배경과 영상 배경을 같은 값으로 두어야 혼합 모드가 쌓임 맥락 안에서도 정확히 맞는다. 도입 영상의 검정 픽셀도 같은 값으로 그레이딩해 두었다.
- 사상축 다섯 색(`#3F4A5B`, `#9C8B5C`, `#A36C3F`, `#5B7878`, `#BDB6A2`)은 하단 패널 전용이고 현재 표시 플래그가 꺼져 있다. 색각 검증은 하지 않았다 (미정, Q5).
- 시기 구획의 띠 색은 연대기 데이터가 직접 갖고 있다. 테마 토큰이 아니다.

### 3.2 타이포

| 역할 | 서체 | 방향 (웨이트·크기·자간·행간) | MUI variant |
|---|---|---|---|
| 브랜드 디스플레이 | Cinzel 계열 세리프 | 900, 2.4~9rem, 행간 0.98, 자간 0.02em | (컴포넌트 직접) |
| 브랜드 라벨 | IM Fell English SC | 스몰캡스 라벨. 정의만 되어 있고 미적용 | (없음) |
| 브랜드 본문 | IM Fell English | 상세 본문. 정의만 되어 있고 미적용 | (없음) |
| 프로덕트 본문 | Inter | 400, 0.92~1rem, 행간 1.75 | (컴포넌트 직접) |
| 테마 본문 | Pretendard Variable | 400, 1rem·0.875rem, 행간 1.6 | body1, body2 |
| 테마 디스플레이 | Georgia 계열 세리프 | 900~600, 2.5~1.125rem, 자간 -0.02em | h1~h6 |
| 라벨 | Pretendard Variable | 600, 0.75rem, 자간 0.08em, 대문자 | overline |
| 버튼 | Pretendard Variable | 600, 0.875rem, 자연 케이스 | button |

비고:

- 서체는 두 벌이다. 브랜드 벌(로마 비문 계열과 17세기 인쇄체)은 이름, 큰 선언, 수치에 쓰고, 프로덕트 벌(중립 산세리프와 한글 본문)은 라벨과 설명에 쓴다. 브랜드 벌 넷 가운데 실제로 쓰이는 것은 디스플레이 하나이고, 라벨과 본문 두 벌은 정의와 웹폰트만 있다.
- 브랜드 벌은 테마가 아니라 `src/components/timeline/typography.js`의 상수로 관리한다. 제품 토큰과 브랜드 톤을 분리하려는 선택이다.
- 원문 03이 남긴 헤딩 서체 결정(테마 규칙의 산세리프 대 현재 세리프)은 세리프 유지로 확정했다. 박물지 톤이 우선이다.
- 수치는 등폭 숫자로 정렬한다. 집계 머리글의 총합은 2.4~3.8rem으로 도판보다 크게 놓는다.

### 3.3 형태·표면·모션

| 축 | 방향 | 값 |
|---|---|---|
| radius | 전부 각지게 | `shape.borderRadius: 0`, Chip만 `4` |
| elevation | 방향성 없는 확산광 | offset 0, blur 12~24px, 투명도 0.48~0.72 |
| 간격 | 8px 그리드 유지 | `spacing: 8` |
| 브레이크포인트 | 기본 유지 | 0 / 600 / 900 / 1200 / 1536 |
| 스크롤 | 관성 감속 | 지속 1.1초, 지수 감쇠, 터치는 기본 |
| 전환 템포 | 짧게 끊는다 | 상세 0.22초 easeOut, 선 상태 0.2초 |
| 높이 단위 | 주소창 대응 | `100dvh`, 데스크톱은 `100vh`와 같음 |

비고:

- 그림자는 offset 없이 blur만 쓴다. 다크 지면이라 스타터킷보다 투명도를 네 배 이상 올렸다.
- 긴 전환은 스크롤이 맡는다. 도입 영상의 재생 위치, 서사 카드의 패럴럭스, 통람의 가로 이동이 전부 스크롤 값에 묶여 있다. 그래서 시간 기반 전환은 짧게 끊는다.
- 서사 카드의 세로 시작 위치는 0, 5, -3, 7vh로 어긋나 있고 추가 이동 거리는 10, 50, 22, 65vh다. 균등 정렬을 의도적으로 깬 값이다.

---

## 4. 이미지·에셋 방향

| 에셋 유형 | 쓰이는 곳 | LOOK 키워드 (1~2) |
|---|---|---|
| 도입 스크럽 영상 | Hero | monochrome scrub film |
| 서사 픽토그램 영상 | Bridge | engraved bitmap loop |
| 작품 도판 | Timeline, 전역 오버레이 | archival artwork photo |
| 표본 인포그래픽 도판 | Specimen Ledger | clinical grotesque engraving |
| 대기 화면 마커 | 전역 오버레이 | engraved bitmap |

에셋별 방향 (에셋 유형마다 한 블록):

- **도입 스크럽 영상**
  - FORMAT: 4:3, 데스크톱 1920x1440, 좁은 화면 720x540. 모든 프레임을 키프레임으로 인코딩해 임의 위치 탐색을 허용한다
  - LOOK: monochrome scrub film. 검정 픽셀을 지면 검정과 같은 값으로 그레이딩
  - SUBJECT: 중앙에 인물이 놓이므로 좌측을 비운다. 도입 선언이 그 자리에 얹힌다
  - 하지 않는 것: 자막, 컷 전환, 채도 있는 색, 화면 밖으로 넘치는 크롭
- **서사 픽토그램 영상**
  - FORMAT: 정사각에 가까운 짧은 반복 영상. 가장자리를 원형으로 부드럽게 지운다
  - LOOK: engraved bitmap loop. 밝은 픽셀만 남기는 혼합으로 검은 지면에 녹인다
  - SUBJECT: 네 장의 주제(죽음, 가격, 격자, 소각)를 각각 한 도상으로
  - 하지 않는 것: 사각 테두리, 흰 배경, 읽히는 글자
- **작품 도판**
  - FORMAT: 원본 비율 그대로. 공개 백과와 공용 저장소에서 제목으로 조회해 받는다
  - LOOK: archival artwork photo. 보정하지 않는다
  - SUBJECT: 작품 한 점당 한 장. 파일 이름은 작품 식별자, 연도, 제목 순
  - 하지 않는 것: 작가 초상으로의 대체, 알려진 자리표시 이미지 (해시 목록으로 거른다)
- **표본 인포그래픽 도판**
  - FORMAT: 1254x1254 정사각 PNG, 검은 배경을 이미지 안에 굽는다. 중앙에 수치를 얹을 여백을 남긴다
  - LOOK: clinical grotesque engraving. 가는 연속 선, 날카로운 이음, 필요한 곳만 해칭
  - SUBJECT: 종별 표본 한 점씩. 나비 성물함, 상어 비트린, 반추동물 판, 돼지, 얼룩말, 비둘기, 수탉, 미집계 순환, 군소 동물 스트립
  - 하지 않는 것: 피와 내장, 사진과 3D 렌더, 채도 있는 색, 읽히는 글자, 따뜻한 종이 배경
- **대기 화면 마커**
  - FORMAT: 정사각 PNG 네 점, 순환 페이드
  - LOOK: engraved bitmap
  - SUBJECT: 해골, 약장, 성심, 불타는 지폐
  - 하지 않는 것: 진행률 숫자와 겹치는 밀도

비고: 생성한 도판은 리타이닝 단계를 거친다. 따뜻한 원본을 따로 보관하고, 밝기를 차가운 색 토큰 위로 다시 매핑한다. 그래서 같은 스크립트를 여러 번 돌려도 색이 누적되어 밀리지 않는다.

### 4.1 레퍼런스 (사용자 제공만)

해당 없음: 원문 03의 레퍼런스 표가 빈 슬롯이고, 사용자가 제공한 자료가 없다.

---

## 5. 변경 토큰 요약 (theme.js 입력)

| 토큰 경로 | 현재값 | 변경값 | 적용 대상 |
|---|---|---|---|
| `palette.mode` | `light` | `dark` | 전역 |
| `palette.primary.main` | `#0000FF` | `#6666FF` | 악센트, 진행률 |
| `palette.primary.light` | `#6666FF` | `#9999FF` | 상태 변화 |
| `palette.primary.dark` | `#0000B2` | `#0000FF` | 깊이 강조 |
| `palette.secondary.*` | blueGrey 700/900 | blueGrey 200/100/400 | 보조 텍스트 |
| `palette.text.*` | 검정 87/60/38% | 흰색 92/64/38% | 본문 위계 |
| `palette.background.default` | `#FFFFFF` | `#FFFFFF` (유지) | 도입 구간 지면 |
| `palette.background.paper` | `#FFFFFF` | `#141414` | 카드와 패널 |
| `palette.divider` | 검정 12% | 흰색 14% | 구분선 |
| `palette.action.*` | 검정 계열 6값 | 흰색 계열 6값 | 상태 표현 |
| `palette.error/warning/success/info` | 다크 톤 main | 한 단계 밝은 main | 상태 색 |
| `typography.headingFontFamily` | 산세리프 | Georgia 계열 세리프 | 헤딩 전체 |
| `typography.h1~h6.fontFamily` | 산세리프 | Georgia 계열 세리프 | 디스플레이 |
| `typography.fontFamily` | Pretendard Variable | (유지) | 본문 |
| `shape.borderRadius` | `0` | `0` (유지) | 전 컴포넌트 |
| `customShadows.sm~xl` | 투명도 0.06~0.12 | 투명도 0.48~0.72 | Paper, 카드 |
| `spacing` | `8` | `8` (유지) | 전역 |
| `breakpoints.values` | 0/600/900/1200/1536 | (유지) | 전역 |
| `transitions` | 기본 7단계 | (유지) | 전역 |
| `dashboard.*` | 흰 계열 표면 | 검정 계열 표면 | 대시보드 프리셋 |
| `themes/tokens.js` | 없음 | 2단 색 토큰 파일 (신설) | 지면, 글, 구분선 |
| `timeline/typography.js` | 없음 | 브랜드 서체 상수 (신설) | 큰 선언과 수치 |

비고: 현재값은 스타터킷 테마다. 이 프로젝트는 밝은 테마를 어두운 테마로 뒤집고, 화면에서 실제로 쓰는 색은 테마 대신 신설한 2단 토큰 파일로 옮겼다. 테마는 기본 컴포넌트의 바탕으로 남는다.

---

## 6. 다음 문서로 넘기는 것

| 받는 곳 | 가져가는 것 |
|---|---|
| theme.js 수정 | 5절 표 |
| /component-work | 3절 토큰 방향, 5절 표 |
| /layout-composer | 2절 두 표의 아키타입과 콘텐츠 신호 |
| /visual-asset-prompt | 4절 개요 표와 에셋별 방향, 4.1절 |
