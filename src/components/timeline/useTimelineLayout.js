import { useMemo } from 'react';

/**
 * 세계관(Worldview) Y → 5단계 밴드 매핑
 * (+) TRANSCENDENCE: 미·승화·신성기하 — Cherry Blossoms, Veils, Mandalas, Sacred Heart
 * (+) SYSTEM: 분류·격자·산업 — Spot Paintings, Pharmacy
 * (0) RITUAL: 의례·찰나·순환 — Spin, Butterfly, Currency
 * (-) VANITAS: 바니타스·소멸 — Diamond Skull, Treasures, Sotheby's 2008
 * (-) MORTALITY: 죽음의 직시 — Shark, Mother and Child, A Thousand Years
 */
const BANDS = [
  { id: 'TRANSCENDENCE', min: 0.6, max: 1.0 },
  { id: 'SYSTEM', min: 0.2, max: 0.59 },
  { id: 'RITUAL', min: -0.19, max: 0.19 },
  { id: 'VANITAS', min: -0.59, max: -0.2 },
  { id: 'MORTALITY', min: -1.0, max: -0.6 },
];

/** 밴드별 축으로부터의 거리 비율 (0=축, 1=최상단) — 밴드 중앙 worldview_y를 -1~1 범위에서 선형 매핑 */
const BAND_POSITIONS = Object.fromEntries(
  BANDS.map((band) => {
    const mid = (band.min + band.max) / 2;
    return [band.id, (mid + 1) / 2];
  })
);

/** 밴드 ID → locale 키 매핑 */
const BAND_LOCALE_KEYS = {
  TRANSCENDENCE: 'band.transcendence',
  SYSTEM: 'band.system',
  RITUAL: 'band.ritual',
  VANITAS: 'band.vanitas',
  MORTALITY: 'band.mortality',
};

/** work.id 기반 일관적 지터 값 생성 */
function seededJitter(id) {
  const num = parseInt(id.replace(/\D/g, ''), 10) || 0;
  return ((num * 7 + 3) % 17) - 8;
}

/** worldview_y(or emotion_y fallback) → 밴드 ID */
function toBand(yValue) {
  const v = typeof yValue === 'number' ? yValue : 0;
  for (const band of BANDS) {
    if (v >= band.min) return band.id;
  }
  return 'MORTALITY';
}

/**
 * useTimelineLayout — 타임라인 레이아웃 계산 훅
 *
 * Props:
 * @param {Object} worksData - hirst_works.json 데이터 [Required]
 * @param {Object} eventsData - hirst_events.json 데이터 [Required]
 * @param {number} pxPerYear - 연도당 픽셀 수 [Optional, 기본값: 250]
 * @param {number} viewportWidth - 뷰포트 너비 [Optional, 기본값: 1920]
 * @param {number} viewportHeight - 뷰포트 높이 [Optional, 기본값: 800]
 * @param {number} axisRatio - 축 Y 위치 비율 (0~1) [Optional, 기본값: 0.5]
 */
function useTimelineLayout({
  worksData,
  eventsData,
  pxPerYear = 250,
  viewportWidth = 1920,
  viewportHeight = 800,
  axisRatio = 0.5,
}) {
  return useMemo(() => {
    const START_YEAR = 1986;
    const END_YEAR = 2024;

    const works = worksData?.works || [];
    const events = (eventsData?.events || []).filter((e) => e.year >= START_YEAR);
    /** worldview_periods 우선, biographical_periods 호환 */
    const wvPeriods =
      eventsData?.meta?.worldview_periods ||
      eventsData?.meta?.biographical_periods ||
      [];

    const leftPad = viewportWidth * 0.5;

    /** 연도 → X 픽셀 */
    function yearToX(year) {
      return leftPad + (year - START_YEAR) * pxPerYear;
    }

    const totalWidth = yearToX(END_YEAR) + leftPad;
    const TOP_PADDING = 40;
    const axisY = viewportHeight * axisRatio;
    const upperHeight = axisY - TOP_PADDING;
    const Y_SCALE_MARGIN = 0.15;
    const scaleHeight = upperHeight * (1 - 2 * Y_SCALE_MARGIN);
    const scaleTop = TOP_PADDING + upperHeight * Y_SCALE_MARGIN;

    /** 시기 밴드 (배경 색상 영역) — START_YEAR 이전 구간 클램프/제외 */
    const periodBands = wvPeriods
      .filter((bp) => bp.range[1] > START_YEAR)
      .map((bp) => {
        const clampedStart = Math.max(bp.range[0], START_YEAR);
        return {
          id: bp.id,
          label: bp.label,
          x: yearToX(clampedStart),
          width: yearToX(bp.range[1]) - yearToX(clampedStart),
          color: bp.band_colors[0],
          thickness: bp.band_thickness,
          blur: bp.blur_intensity,
        };
      });

    /** 작품 배치 */
    const yearWorkGroups = {};
    works.forEach((w) => {
      const key = w.year;
      if (!yearWorkGroups[key]) yearWorkGroups[key] = [];
      yearWorkGroups[key].push(w);
    });

    /** 작품 노드 높이 — 연도라벨(18) + 이미지(80) + 도트(6) + 여백(2) */
    const NODE_TOTAL_H = 106;
    const minNodeY = TOP_PADDING;
    const maxNodeY = axisY - NODE_TOTAL_H;

    const positionedWorks = works.map((work) => {
      const group = yearWorkGroups[work.year];
      const indexInYear = group.indexOf(work);
      const subOffset = indexInYear * Math.round(140 * (pxPerYear / 250));

      /** worldview_y 우선, emotion_y 폴백 (Rothko 데이터 호환) */
      const yValue =
        typeof work.worldview_y === 'number'
          ? work.worldview_y
          : work.emotion_y;
      const band = toBand(yValue);
      const bandRatio = BAND_POSITIONS[band];
      const jitter = seededJitter(work.id);
      const rawY = scaleTop + scaleHeight * (1 - bandRatio) + jitter;
      const y = Math.max(minNodeY, Math.min(maxNodeY, rawY));
      const x = yearToX(work.year) + subOffset;

      return { ...work, x, y, band };
    });

    /** 이벤트 배치 (축 하단) — 연도별 1개만, 단일 레인 */
    const sigOrder = { critical: 0, high: 1, medium: 2, low: 3 };

    /** 같은 연도에 여러 이벤트가 있으면 significance 높은 것만 */
    const yearBest = {};
    events.forEach((e) => {
      const rank = sigOrder[e.significance] ?? 9;
      if (!yearBest[e.year] || rank < (sigOrder[yearBest[e.year].significance] ?? 9)) {
        yearBest[e.year] = e;
      }
    });

    const positionedEvents = Object.values(yearBest)
      .map((e) => ({ ...e, x: yearToX(e.year), y: axisY + 12, lane: 0 }))
      .sort((a, b) => a.x - b.x);

    /** Y축 세계관 밴드 틱 데이터 */
    const emotionBands = BANDS.map((band) => {
      const ratio = BAND_POSITIONS[band.id];
      return {
        id: band.id,
        localeKey: BAND_LOCALE_KEYS[band.id],
        y: scaleTop + scaleHeight * (1 - ratio),
      };
    });

    /** 연도 틱 데이터 */
    const yearTicks = [];
    for (let yr = START_YEAR; yr <= END_YEAR; yr++) {
      if (yr % 5 === 0) {
        yearTicks.push({
          year: yr,
          x: yearToX(yr),
          isMajor: yr % 10 === 0,
        });
      }
    }

    return {
      positionedWorks,
      positionedEvents,
      emotionBands,
      periodBands,
      yearTicks,
      totalWidth,
      axisY,
      yearToX,
    };
  }, [worksData, eventsData, pxPerYear, viewportWidth, viewportHeight, axisRatio]);
}

export { useTimelineLayout };
