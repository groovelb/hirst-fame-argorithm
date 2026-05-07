---
status: draft
phase: 2-ux-flow
last_updated: 2026-05-07
---

# Damien Hirst. UX Flow

> 본 문서는 프로젝트 초반 가이드. 디자이너가 "어떤 데이터를 어떻게 다루는지" 처음 이해하는 단계의 합의 문서이며, 구현 디테일·SQL·백엔드 용어는 등장하지 않는다.

---

## 유저 시나리오

### 시나리오 1. 첫 방문자, 30초 안에 "허스트가 어떤 작가인지" 잡기

- **사용자**: Hirst를 "포름알데히드 상어 만든 사람" 정도로만 아는 일반 관람객.
- **목표**: 스크롤 한 번으로 그의 사상이 어떻게 변해왔는지 큰 그림을 본다.
- **흐름**: 인트로 → 연대기 세그먼트를 위에서 아래로 쓸어내림 → 마지막 요약에서 "내가 본 7개 시기" 정리.
- **다루는 데이터**: `Era` R, `Work` R (대표작 썸네일만), `KeywordAxis` R.

### 시나리오 2. 큐레이터, 특정 연대기의 사상축 비중과 키워드 보기

- **사용자**: 강의·전시 기획에서 "약장(Pharmacopoeia) 시기"의 핵심 가중치를 캡처하려는 큐레이터.
- **목표**: 연대기 단위로 5축(MORTALITY/SYSTEM/FAITH/VALUE/FORM)의 가중치 분포와 그 시기의 사건 흐름을 한 화면에서 본다.
- **흐름**: 연대기 앵커로 점프 → 도넛에서 5축 분포 확인 → 옆 패널의 사건 타임라인 훑기.
- **다루는 데이터**: `Era` R, `KeywordAxis` R, `Event` R, `Work` R.

### 시나리오 3. 호기심 많은 일반인, "허스트는 진짜 뭘 죽여 썼나" 확인

- **사용자**: 허스트의 윤리·미학 논쟁을 들어본 사람. 정량적 사실을 직접 보고 싶음.
- **목표**: 어느 작품에 어떤 종이 몇 마리 사용됐고, 누적으로 종별 합계가 어떻게 되는지 본다.
- **흐름**: 스크롤 도중 "생체 도감" 인라인 섹션 진입 → 종 카드(상어/양/소/돼지/얼룩말/비둘기/수탉/나비/구더기/물고기/사람) 통람 → 작품 클릭 시 작품 모달에서 출처 확인.
- **다루는 데이터**: `BioSpecimenRecord` R, `SpeciesSummary` R, `Work` R, `Source` R.

### 시나리오 4. 회의적인 독자, "이 통계는 어디서 온 거냐" 검증

- **사용자**: 인용·출처를 신뢰성 기준으로 확인하는 기자/연구자.
- **목표**: 모든 정량 수치가 1차 자료와 연결되는지 본다.
- **흐름**: 종 카드 또는 작품 모달의 "출처" 칩 클릭 → 출처 인용·발췌·검증 여부 확인 → 페이지 하단의 주의사항(검증 불가·전시 한정 수치 등) 일독.
- **다루는 데이터**: `Source` R, `BioSpecimenRecord` R, `Caveat` R.

---

## 데이터 모델

> 카드만. 시나리오에 등장한 데이터를 정의한다. 사전(컬럼/식별자)은 별도 섹션 § 데이터 모델 활용.

#### 📦 연대기 `Era`

> 허스트의 세계관을 7개의 시기로 분절한 단위. "약장 시기", "성물함 시기" 같은 사상적 묶음 하나가 1 Era.

- **보이는 페이지**: Home, Era Section, Era Detail Pane
- **만드는 사람**: 시스템 (사람이 사전 큐레이션, 코드는 정적 JSON으로 보유)
- **만드는 곳**: Home (정적 데이터로 초기 로드)

#### 📦 작품 `Work`

> 1991년 〈물리적 불가능〉부터 최근 작업까지 72점의 대표작. 각 작품은 1개의 Era에 속하며 5축 가중치를 가진다.

- **보이는 페이지**: Era Section, Work Modal, Bestiary Section
- **만드는 사람**: 시스템
- **만드는 곳**: Home

#### 📦 사건 `Event`

> 작가의 생애·전시·시장 사건 52건. 첫 개인전, 〈Sensation〉, Sotheby's 단일 작가 경매, 〈For the Love of God〉 발표 등 사상 발전의 외부 마커.

- **보이는 페이지**: Era Section
- **만드는 사람**: 시스템
- **만드는 곳**: Home

#### 📦 사상축 `KeywordAxis`

> 5축(죽음의 인식론·체계·신앙·가치·형식). 각 작품·연대기마다 0~1 가중치가 매겨져 시기별 사상의 무게중심을 만든다.

- **보이는 페이지**: Era Section (도넛), Worldview Curve
- **만드는 사람**: 시스템
- **만드는 곳**: Home

#### 📦 생체 표본 기록 `BioSpecimenRecord`

> "작품 1점에 종 N개체가 어떤 상태(deceased/live/mixed/remains)로 사용됐다"의 1행. 사용자가 별도 제공한 raw data를 기반으로 한다.

- **보이는 페이지**: Bestiary Section, Work Modal
- **만드는 사람**: 시스템
- **만드는 곳**: Home

#### 📦 종 누적 집계 `SpeciesSummary`

> 종별로 "몇 작품에 누적 몇 개체가 등장했는가"의 요약. 상어 6작품/8개체, 양 6작품/8개체, 2012 Tate 나비 9,000마리 등.

- **보이는 페이지**: Bestiary Section
- **만드는 사람**: 시스템
- **만드는 곳**: Home

#### 📦 출처 `Source`

> 정량 수치의 1차 자료. 경매 도록·언론·NGO 성명·갤러리 도록·작가 공식 사이트.

- **보이는 페이지**: Work Modal, Bestiary Section, Footer Methodology
- **만드는 사람**: 시스템
- **만드는 곳**: Home

#### 📦 주의사항 `Caveat`

> "9,000마리는 2012 Tate 단일 전시 한정", "수백만 추산은 채택하지 않음" 등 통계 해석의 단서.

- **보이는 페이지**: Footer Methodology, Bestiary Section
- **만드는 사람**: 시스템
- **만드는 곳**: Home

---

## UX-flow

> 시나리오를 데이터 관점에서 단계별로 쪼갠 서사. 각 단계의 페이지·사용자 행동·발생 데이터·결과.

### 시나리오 1 단계별

1. **인트로 진입** (Home > Intro)
   - 사용자 행동: 첫 진입. 짧은 작가 소개 + "스크롤로 7개 시기를 따라가세요" 안내 카피.
   - 발생하는 데이터: `Era` R (목록), `KeywordAxis` R (5축 라벨).
   - 결과: 첫 Era 세그먼트로 스크롤 유도.

2. **연대기 세그먼트 통람** (Home > Era Section × 7)
   - 사용자 행동: 위→아래로 스크롤하며 각 Era의 핵심 명제·대표작 1~3점·5축 도넛을 본다.
   - 발생하는 데이터: `Era` R, `Work` R (썸네일·연도·제목), `KeywordAxis` R (해당 Era의 가중치 평균).
   - 결과: 마지막 Era까지 도달.

3. **요약/마무리** (Home > Outro)
   - 사용자 행동: 7개 시기 미니 카드 그리드 + "사상이 어떻게 이동했는가" 1줄 요약을 본다.
   - 발생하는 데이터: `Era` R.
   - 결과: 이탈 또는 미니맵으로 특정 Era 재방문.

### 시나리오 2 단계별

1. **앵커 점프** (Home > Era Nav)
   - 사용자 행동: 우측 미니맵/스티키 내비에서 "Pharmacopoeia" 클릭.
   - 발생하는 데이터: `Era` R.
   - 결과: 해당 Era Section으로 스크롤 이동.

2. **사상축 도넛 검토** (Home > Era Section)
   - 사용자 행동: 5축 도넛 hover/탭으로 각 축의 비중·해당 축 키워드를 확인.
   - 발생하는 데이터: `KeywordAxis` R.
   - 결과: "이 시기는 SYSTEM·FAITH가 우세" 같은 인사이트 획득.

3. **사건 흐름 확인** (Home > Era Section > Event Strip)
   - 사용자 행동: Era 안의 사건 스트립을 좌→우로 본다.
   - 발생하는 데이터: `Event` R, `Work` R.
   - 결과: 이 시기에 일어난 외부 사건과 작품의 시점 매칭.

### 시나리오 3 단계별

1. **베스티어리 진입** (Home > Bestiary Section)
   - 사용자 행동: 인라인 "생체 도감" 섹션 도달.
   - 발생하는 데이터: `SpeciesSummary` R.
   - 결과: 종별 카드 그리드 노출.

2. **종 카드 통람** (Home > Bestiary Section)
   - 사용자 행동: 종별 카드(상어 6/8, 양 6/8, 나비 9,000 …)를 훑으며 마리 수와 작품 수를 확인.
   - 발생하는 데이터: `SpeciesSummary` R, `BioSpecimenRecord` R.
   - 결과: 특정 종 카드 클릭.

3. **작품 모달** (Home > Work Modal)
   - 사용자 행동: 종 카드에서 연결된 대표 작품을 모달로 본다. 작품의 매체·사용 종·해당 Era 사상 1~2줄.
   - 발생하는 데이터: `Work` R, `BioSpecimenRecord` R, `Era` R, `Source` R.
   - 결과: 닫기 또는 출처 칩으로 검증 단계 진입.

### 시나리오 4 단계별

1. **출처 칩 활성화** (Home > Work Modal)
   - 사용자 행동: 작품 모달의 출처 칩(예: "NYT 2005-03-02")을 탭.
   - 발생하는 데이터: `Source` R.
   - 결과: 인용·발췌·검증 여부 팝오버 노출.

2. **방법론 푸터 확인** (Home > Footer Methodology)
   - 사용자 행동: 페이지 하단으로 이동해 데이터 기준일·검증 불가 항목·전시 한정 수치 주의사항 일독.
   - 발생하는 데이터: `Caveat` R, `Source` R.
   - 결과: 신뢰 판단 후 인용/공유.

---

## 페이지 리스트

> 단일 스크롤 SPA이므로 라우트는 1개. "페이지"는 의미 단위 섹션이며 앵커로 점프 가능.

| 페이지 | 경로 | 한 줄 설명 | 다루는 데이터 |
|---|---|---|---|
| Home | `/` | 단일 스크롤 컨테이너. 하위 섹션 전체를 호스팅 | `Era` `Work` `Event` `KeywordAxis` `SpeciesSummary` `BioSpecimenRecord` `Source` `Caveat` |
| Intro | `/#intro` | 작가 소개 + 스크롤 안내 카피 | `Era` `KeywordAxis` |
| Era Section | `/#era/:slug` | 7개 연대기 각각의 세그먼트(명제·대표작·도넛·사건 스트립) | `Era` `Work` `Event` `KeywordAxis` |
| Bestiary Section | `/#bestiary` | 종 누적 도감 + 종-작품 연결 그리드 | `SpeciesSummary` `BioSpecimenRecord` `Work` |
| Worldview Curve | `/#curve` | 5축 강도의 시간축 곡선 (기존 EmotionCurve 의미 재정의) | `KeywordAxis` `Era` |
| Era Nav | `/#nav` | 우측 스티키 미니맵/앵커 내비 | `Era` |
| Work Modal | `/#work/:id` | 작품 상세 모달(매체·사용 종·소속 Era·출처 칩) | `Work` `BioSpecimenRecord` `Era` `Source` |
| Outro | `/#outro` | 7개 시기 미니 그리드 + 사상 이동 1줄 요약 | `Era` |
| Footer Methodology | `/#methodology` | 데이터 기준일·주의사항·1차 자료 목록 | `Caveat` `Source` |

---

## 데이터 모델 활용

> 이 표는 `/supabase-integration` 의 유일한 입력. (현 프로젝트는 정적 JSON 운용이지만, 향후 백엔드 도입 시 이 매핑이 그대로 계약이 된다.) 데이터명 ↔ 코드 식별자 ↔ 예상 테이블명은 변경 시 이 표를 먼저 갱신.

| 데이터명 | 한국어 | 코드 식별자 | 예상 테이블명 | 생성 책임 페이지 |
|---|---|---|---|---|
| `Era` | 연대기 | `era` | `eras` | Home |
| `Work` | 작품 | `work` | `works` | Home |
| `Event` | 사건 | `event` | `events` | Home |
| `KeywordAxis` | 사상축 | `keywordAxis` | `keyword_axes` | Home |
| `BioSpecimenRecord` | 생체 표본 기록 | `bioSpecimenRecord` | `bio_specimen_records` | Home |
| `SpeciesSummary` | 종 누적 집계 | `speciesSummary` | `species_summaries` | Home |
| `Source` | 출처 | `source` | `sources` | Home |
| `Caveat` | 주의사항 | `caveat` | `caveats` | Home |

**예상 테이블명 충돌 검증** (2026-05-07 기준): PG 예약어/Supabase 예약 스키마와 모두 비충돌. `user`/`order`/`group`/`references` 등 흔한 충돌어 미사용. 모든 테이블명은 복수형/스네이크 케이스 규약을 따른다.

---

## 컴포넌트 리스트

> 신규만. 기존 디자인 시스템 또는 잔존 코드(TimelineCanvas/Axis/Minimap, ColorDonutChart, ColorDetailModal, TimelineEmotionCurve, WorkImage, TimelineEventItem, TimelineWorkItem)에서 의미론적 변형으로 처리되는 것은 본문에서 제외하고 부록으로 분리한다.

| 컴포넌트 | 카테고리 | 한 줄 용도 |
|---|---|---|
| `EraSegment` | 8. Layout | 1개 Era를 세로 1뷰포트 기준으로 호스팅하는 컨테이너. 명제·도넛·사건 스트립·대표작을 슬롯으로 배치 |
| `EraThesisHeadline` | 1. Typography | Era 진입부에 노출되는 시기 명제(예: "약장은 신앙을 대체하는가") 강조 헤드라인 |
| `EraEventStrip` | 5. Data Display | Era 내부의 가로 사건 타임라인. `Event` 카드를 좌→우 스크롤 |
| `WorldviewMiniMap` | 10. Navigation | 우측 스티키 7-Era 앵커 내비 + 현재 위치 인디케이터 |
| `BestiaryGrid` | 8. Layout | 종별 카드 그리드. 종 분류군별 컬러 코드와 마리 수 정량 표시 |
| `SpeciesStatCard` | 3. Card | 종 1개의 누적 집계 카드(작품 수·개체 수·검증 배지·대표 작품 썸네일) |
| `SpecimenCountBadge` | 5. Data Display | 작품 모달·종 카드에서 "1점·9,000마리" 같은 수치를 강조하는 정량 배지 |
| `SourceChip` | 5. Data Display | 출처 1건을 라벨링하는 칩. 클릭 시 인용·발췌·검증 여부 팝오버 |
| `CaveatNote` | 9. Overlay & Feedback | 페이지 하단/모달 안에서 통계 해석 단서를 강조하는 주석 블록 |
| `WorkDetailModal` | 9. Overlay & Feedback | 기존 `ColorDetailModal` 자리에 들어가는 신규 모달. 매체·사용 종·소속 Era·출처 칩 |

---

## 참조

- 데이터: `src/data/hirst/hirst_works.json` (72점), `hirst_events.json` (52건), `hirst_keyword_taxonomy.json` (5축 + 키워드 사전).
- 사용자 제공 데이터: `data/hirst-bio-specimen-data.js` (artworks/speciesSummary/sources/caveats 4파트, 조사 기준일 2026-05-07).
- 기존 worldview_period 분류 7종: WV_PEDAGOGY · WV_VITRINE · WV_PHARMACOPOEIA · WV_REPAINTING · WV_MYTHOPOEIA · WV_VANITAS_SPECTACLE · WV_RELIQUARY → Era 카드 N=7로 채택.
- 5축: MORTALITY · SYSTEM · FAITH · VALUE · FORM. (택소노미 메타의 5축 라벨과 작품 `axis_weights` 키 기준.)
- 컴포넌트 분류 인덱스: `.claude/skills/component-work/resources/taxonomy-index.md`.
- 부록(분리): `appendix-screen-component-map.md` — Rothko 잔존 컴포넌트의 의미 재정의 매핑·데이터 바인딩 디테일.
