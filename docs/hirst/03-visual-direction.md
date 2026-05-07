---
status: draft
phase: 3-visual-direction
last_updated: 2026-05-07
---

# Damien Hirst. Visual Direction

> Phase 1·2 합의를 시각 토큰으로 환산한다. 기존 Rothko 컨셉의 브랜드 블루(#0000FF)와 감정-색 매핑을 폐기하고, Hirst 세계관 — 박물지·약장·표본대 — 의 시각 언어로 재정의.

---

## 톤앤매너

- **키워드**: 박물지(Natural-History) · 약장(Pharmacopoeia) · 표본대(Vitrine) · 정량(Empirical) · 고요한 잔혹(Quiet Brutality)
- **설명**: 자연사 박물관·19세기 의약 캐비닛·과학 저널의 시각 문법을 기준선으로 삼는다. 화려한 그래픽 장식 대신 격자·라벨·표·각주·진열창의 정직한 조형 언어를 쓰고, 강렬함은 내용(상어 1개체, 나비 9,000마리)에서 발생시킨다. 색은 컨텐츠를 누르지 않도록 본문 모노크로마틱을 유지하고, 5축 도넛/곡선·생체 도감의 분류군 구분에서만 절제된 다색을 허용.

---

## 컬러 방향

### 본문(전체 페이지) — 모노크로마틱 베이스

| 용도 | 현재 토큰 | 현재값 | 변경 방향 | 근거 |
|---|---|---|---|---|
| Primary | `palette.primary.main` | `#0000FF` | `#0F1A1F` (formaldehyde-ink, 거의 흑색에 청록 기미) | Rothko 잔재 폐기. Hirst의 vitrine 유리·포름알데히드 액 톤. 본문 텍스트·강조 라인의 베이스로 사용 |
| Primary Light | `palette.primary.light` | `#6666FF` | `#3A4A52` | 부드러운 보조 강조. hover/active 상태 |
| Primary Dark | `palette.primary.dark` | `#0000B2` | `#06101A` | 진한 접지면 |
| Secondary | `palette.secondary.main` | `#263238` (blueGrey[900]) | 유지 | 본문 텍스트와의 위계용 보조 컬러로 그대로 활용 |
| Background Default | `palette.background.default` | `#FFFFFF` | `#F4F1EA` (bone-white, 박제 라벨 종이 톤) | 순백은 의료 샘플 시트보다 미술관 전시 라벨에 가까운 따뜻한 본 화이트가 작품 이미지를 더 살림 |
| Background Paper | `palette.background.paper` | `#FFFFFF` | `#FFFFFF` 유지 | 작품 모달·카드 내부는 순백 유지하여 대비 확보 |
| Text Primary | `palette.text.primary` | `rgba(0,0,0,0.87)` | 유지 | 가독성 안정화된 값. 변경 불요 |
| Divider | `palette.divider` | `rgba(0,0,0,0.12)` | `rgba(15,26,31,0.16)` | 격자·라벨 컨셉이라 약간 더 또렷하게 |

### 5축 팔레트 — 사상축 도넛/곡선 전용

5축(MORTALITY/SYSTEM/FAITH/VALUE/FORM)에 1색씩 부여. 각 색은 Hirst 작품에서 모티프를 차용한다. 본문 일반 UI에는 사용하지 않는다(컨텐츠 시각화 한정).

| 축 | 색 | 코드 | 모티프 |
|---|---|---|---|
| MORTALITY | formaldehyde teal | `#1E5F66` | vitrine 액의 청록 |
| SYSTEM | spot-grid yellow | `#E6B800` | Spot Painting의 대표 노랑 |
| FAITH | reliquary gold | `#B8860B` | For the Love of God 다이아몬드 해골의 금속 톤 |
| VALUE | currency olive | `#7A6B2E` | Currency 시리즈를 olive로 환원. MORTALITY teal 과의 colorblind 인접 회피 |
| FORM | pharmacy white | `#D9D2C5` | Pharmacy 내부의 본 화이트 캐비닛 |

> 5색은 colorblind-safe 검증을 거쳐야 함(검증 미실시 시 적용 보류 항목으로 기록).

### 분류군 팔레트 — 베스티어리 카드 전용

생체 도감 종 카드의 분류군 인디케이터에서만 사용.

| 분류군 | 색 | 코드 |
|---|---|---|
| 어류(elasmobranch) | shark-grey | `#6B7280` |
| 포유류(mammal) | bovine-brown | `#8B5E3C` |
| 조류(bird) | dove-slate | `#9AA5B1` |
| 곤충(insect) | butterfly-vermillion | `#C9462C` |
| 인류(human) | bone-ivory | `#E8DFCB` |

---

## 타이포그래피 방향

전체 위계는 유지하되, h1·overline의 자료감을 강화한다.

| 요소 | 현재 설정 | 변경 방향 | 근거 |
|---|---|---|---|
| `h1` | Georgia serif / 900 / 2.5rem / -0.02em | Georgia serif 유지, **3.25rem (52px)** 로 확대, letter-spacing **-0.03em** | Era 진입부 명제 헤드라인이 표지 카피 톤이 되어야 함. 박물지 책 제목 비율 |
| `h2` | Georgia serif / 900 / 2rem | 유지 | Era 내부 섹션 헤더 |
| `h3`–`h6` | Georgia serif | 유지 | — |
| `body1` | Pretendard / 1rem / line-height 1.6 | 유지 | 한글 본문 안정값 |
| `body2` | Pretendard / 0.875rem / 1.6 | 유지 | — |
| `overline` | Pretendard / 0.75rem / uppercase / 0.08em | letter-spacing **0.16em**, fontFamily Outfit/Pretendard 병기, weight 700 | 박물 라벨·표본 태그 캡션 톤 (예: "WV · PHARMACOPOEIA · 1992–1999") |
| `caption` | Pretendard / 0.75rem | 유지 | 출처 칩·각주 |
| 헤딩 폰트 패밀리 | `"Georgia", "Times New Roman", "Noto Serif KR", serif` | **첫 우선순위에 Outfit 추가 후 fallback**: `"Outfit", "Georgia", "Noto Serif KR", serif` 또는 Outfit/Georgia 동시 노출 정책 결정 필요 | 디자인 시스템 룰은 Outfit(영문)+Pretendard(한글) 헤딩이지만 현 테마는 Georgia로 운영 중. **결정 항목**으로 둠 |

---

## 간격 및 레이아웃

- **spacing 기본 단위**: 8px (`spacing: 8`) 유지.
- **주요 레이아웃 패턴**:
  - Era 세그먼트는 1뷰포트 높이 기준의 세로 슬롯으로 운용. 내부는 12-col grid에서 8/4 분할(좌: 작품·도넛, 우: 명제·사건 스트립).
  - 베스티어리는 `BentoGrid` 또는 `LineGrid` 기반 종 카드 그리드(3-col → md 4-col → lg 5-col).
  - 본문 폭 상한 `lg` (1200px), 컨텐츠 좌우 여백 lg에서 96px / md 64px / sm 24px / xs 16px.
- **반응형 브레이크포인트**: 기존 xs/sm/md/lg/xl 유지. md(900) 미만은 우측 스티키 미니맵을 하단 progress bar로 대체.
- **모서리**: `shape.borderRadius: 0` 유지. vitrine·라벨·표본대 컨셉과 정합.
- **그림자**: `customShadows.sm/md/lg/xl` 유지하되, 작품 카드는 `none` 사용(전시 라벨 톤). 모달만 `lg`.

---

## 레퍼런스

> 레퍼런스 이미지/사이트는 **사용자 제공**. 아래 표는 빈 슬롯이며, 사용자가 자료를 첨부하면 채워 넣는다.

| # | 레퍼런스 | 참고 포인트 |
|---|---|---|
| 1 | (사용자 제공 대기) | (사용자 제공 대기) |
| 2 | (사용자 제공 대기) | (사용자 제공 대기) |

---

## 변경 필요 토큰 요약

`src/styles/themes/default.js` 에서 직접 수정해야 할 토큰 목록.

| 토큰 경로 | 현재값 | 변경값 | 적용 대상 |
|---|---|---|---|
| `palette.primary.main` | `#0000FF` | `#0F1A1F` | 본문 강조·아이콘·라인 베이스 |
| `palette.primary.light` | `#6666FF` | `#3A4A52` | hover/active |
| `palette.primary.dark` | `#0000B2` | `#06101A` | 깊이 강조 |
| `palette.secondary.main` | `#263238` | 유지 | 보조 텍스트 |
| `palette.background.default` | `#FFFFFF` | `#F4F1EA` | 페이지 배경 |
| `palette.background.paper` | `#FFFFFF` | 유지 | 카드/모달 |
| `palette.divider` | `rgba(0,0,0,0.12)` | `rgba(15,26,31,0.16)` | 격자·구분선 |
| `typography.h1.fontSize` | `2.5rem` | `3.25rem` | Era 명제 헤드라인 |
| `typography.h1.letterSpacing` | `-0.02em` | `-0.03em` | h1 |
| `typography.overline.letterSpacing` | `0.08em` | `0.16em` | 표본 라벨 캡션 |
| `typography.overline.fontWeight` | 600 | 700 | 표본 라벨 캡션 |
| `customAxes` (신규) | (없음) | 5축 팔레트 객체(MORTALITY/SYSTEM/FAITH/VALUE/FORM) | 도넛·곡선 시각화 전용 |
| `customTaxa` (신규) | (없음) | 분류군 팔레트 객체(어류/포유류/조류/곤충/인류) | 베스티어리 카드 전용 |

---

## 결정 보류 항목 — 2026-05-07 정리

- **헤딩 폰트**: `mui-theme.md` 는 SHOULD 우선순위(룰 그래프 확인). MUST 위반 아님 → **Georgia 유지** 채택. 박물지 컨셉 정합성 우선.
- **5축 팔레트의 colorblind**: VALUE를 currency green(`#2E5E3A`) → currency olive(`#7A6B2E`) 로 변경하여 MORTALITY teal 과 분리. SYSTEM·FAITH 노랑 계열은 명도 차로 구분됨. **본문 표/축 표 갱신 완료.**
- **이미지 자산**: 옵션 (b) bone-white 단색 placeholder 토큰화로 잠정 채택. `WorkImage` 의 `color_blocks` fallback 의미 폐기, `palette.background.paper` + overline 라벨로 대체. 실 이미지 확보 시 자연 교체.
