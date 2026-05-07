---
status: draft
phase: 2-ux-flow-appendix
last_updated: 2026-05-07
---

# Appendix. Screen ↔ Component Map (Hirst)

> Rothko 컨셉으로 만들어진 잔존 컴포넌트를 어떤 의미로 재정의하여 어느 섹션에 배치할지의 1:1 매핑. 본문(02-ux-flow)에는 신규 컴포넌트만 노출하고, 재활용/수정은 이 부록에서만 다룬다.

---

## 1. 잔존 컴포넌트 의미 재정의

| 기존 (Rothko 컨셉) | 새 의미 (Hirst 컨셉) | 사용 섹션 | 변경 강도 |
|---|---|---|---|
| `RothkoTimeline` | `HirstWorldviewTimeline` (단일 스크롤 셸. Era 세그먼트 7개 호스팅) | Home 전체 | 높음 (이름 변경 + 자식 슬롯 재배치) |
| `TimelineCanvas` | Era 세그먼트 트랙 컨테이너 | Era Section 셸 | 중간 (도형/색은 5축 가중치 기반으로 재바인딩) |
| `TimelineAxis` | 연도 축 + Era 경계선 | Worldview Curve, Era Section | 낮음 (스타일만 토큰 정렬) |
| `TimelineMinimap` | `WorldviewMiniMap` (7-Era 앵커 내비) | Era Nav | 중간 (썸네일 → Era 명제 한 줄로 교체) |
| `TimelineEmotionCurve` | `WorldviewAxisCurve` (5축 강도 곡선) | Worldview Curve | 높음 (단일 감정선 → 5라인 스택/오버레이) |
| `ColorDonutChart` | `KeywordAxisDonut` (5축 가중치 도넛) | Era Section | 중간 (입력만 `color_blocks` → `axis_weights`로 교체) |
| `ColorDetailModal` | `WorkDetailModal` (작품 상세 모달) | Work Modal | 높음 (색 패널 제거, 매체·사용 종·Era·출처 칩) |
| `TimelineWorkItem` | `EraWorkCard` (Era 안의 대표작 카드) | Era Section | 낮음 (썸네일/캡션 유지, 색칩 제거) |
| `TimelineEventItem` | `EraEventCard` (Era 안의 사건 카드) | Era Event Strip | 낮음 |
| `WorkImage` | 그대로 사용 (이미지 fallback 로직 유지) | 작품 노출 위치 전반 | 미변경 |
| `useTimelineLayout` | 그대로 사용 (Era 세그먼트 레이아웃 계산기) | Home 셸 | 미변경 |

---

## 2. 신규 컴포넌트 ↔ 데이터 바인딩

| 컴포넌트 | 주 데이터 | 보조 데이터 |
|---|---|---|
| `EraSegment` | `Era` 1건 | `Work[]`, `Event[]`, `KeywordAxis` 가중치 평균 |
| `EraThesisHeadline` | `Era.thesis_ko` / `thesis_en` | — |
| `EraEventStrip` | `Event[]` (해당 Era 필터) | `Work` 참조(연결 시) |
| `WorldviewMiniMap` | `Era[]` (전체 7개) | 현재 스크롤 위치 |
| `BestiaryGrid` | `SpeciesSummary[]` | `BioSpecimenRecord[]` |
| `SpeciesStatCard` | `SpeciesSummary` 1건 | 대표 `Work` 1~2점 |
| `SpecimenCountBadge` | `BioSpecimenRecord.individualCount` | `condition` (deceased/live/mixed/remains) |
| `SourceChip` | `Source` 1건 | — |
| `CaveatNote` | `Caveat` 1건 | — |
| `WorkDetailModal` | `Work` 1건 | `BioSpecimenRecord[]` (해당 작품), `Era`, `Source[]` |

---

## 3. 데이터 정합성 메모

- `Work.worldview_period` (7값) ↔ `Era.id` 1:1 매핑이 정합성의 기준점. 둘 중 하나가 추가/이름변경되면 다른 쪽도 동시 갱신해야 한다.
- `Work.axis_weights` 의 키 5종(`MORTALITY` / `SYSTEM` / `FAITH` / `VALUE` / `FORM`)은 `KeywordAxis.id` 와 글자 단위 일치해야 한다.
- 사용자 제공 `data/hirst-bio-specimen-data.js` 의 `artworks[].id` 는 `Work.id` 와 동일 키 공간에서 운영하거나, 별도 식별자로 두고 `BioSpecimenRecord.workRef` 로 매핑한다(어느 쪽으로 갈지는 구현 단계 결정 항목, 본 부록은 후자로 가정).
- `SpeciesSummary.individualCount` 가 `null` 인 항목(예: `butterfly_paintings_cumulative`, `fly_maggot`, `fish_live`)은 BestiaryGrid에서 "검증 불가" 배지로 노출하고 수치를 비운다.
- 2012 Tate 〈In and Out of Love〉 9,000마리는 `Caveat.butterfly9000Scope` 와 함께 노출. 다른 시리즈로 확장 적용하지 않는다.

---

## 4. 자산/이미지

- `public/images/hirst/` 비어 있음 → `WorkImage` 가 `color_blocks` placeholder로 fallback 중. 색 fallback은 Hirst 컨셉과 충돌하므로, Phase 3 visual-direction 진행 전에 (a) 단색 placeholder 토큰화 또는 (b) 이미지 자산 확보 중 한 방향을 결정해야 한다.
