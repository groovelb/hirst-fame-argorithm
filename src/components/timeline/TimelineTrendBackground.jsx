import React, { useMemo } from 'react';
import { useTheme } from '@mui/material/styles';
import { motion, useMotionTemplate, useMotionValue, useSpring, useTransform } from 'framer-motion';

/** search index 100 = 캔버스 상단 패딩. 상단 타이틀(Damien Hirst) 영역과 겹치지 않도록
    충분한 여백 확보 (타이틀 영역 ≈ top 32 + 6rem 폰트 + sub 라벨 ≈ 160~170px). */
const TOP_PADDING = 200;
/** Catmull-Rom → Cubic Bezier 변환 tension (낮을수록 점에 더 타이트하게 붙음) */
const BEZIER_TENSION = 1 / 6;

/**
 * 점 배열을 Catmull-Rom 보간 기반 Cubic Bezier path로 변환
 * @param {Array<[number, number]>} pts - [[x, y], ...]
 * @returns {string} SVG path d 문자열
 */
function buildBezierPath(pts) {
  if (pts.length === 0) return '';
  if (pts.length === 1) return `M ${pts[0][0]} ${pts[0][1]}`;

  let d = `M ${pts[0][0]} ${pts[0][1]}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] ?? pts[i];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2] ?? p2;

    const c1x = p1[0] + (p2[0] - p0[0]) * BEZIER_TENSION;
    const c1y = p1[1] + (p2[1] - p0[1]) * BEZIER_TENSION;
    const c2x = p2[0] - (p3[0] - p1[0]) * BEZIER_TENSION;
    const c2y = p2[1] - (p3[1] - p1[1]) * BEZIER_TENSION;

    d += ` C ${c1x},${c1y} ${c2x},${c2y} ${p2[0]},${p2[1]}`;
  }
  return d;
}

/**
 * TimelineTrendBackground — 타임라인 X축 위에 Google Trends 라인 차트를 배경으로 렌더링
 *
 * - X scale: yearToX 그대로 사용 → 타임라인과 정확히 공유
 * - Y scale: 0~100 search index → axisY ~ TOP_PADDING 전체 높이 매핑 (Y max = 100)
 * - Zero anchor: 첫 데이터 1년 전 한 점만 axisY에 깔아 시작 곡선 휨 방지
 * - 보간: Catmull-Rom → Cubic Bezier (BEZIER_TENSION=1/6)
 * - Reveal transition: viewport 중앙의 canvas X 좌표를 frontier로, scroll에 따라
 *   CSS clip-path inset 우측을 줄여나가는 방식 (GPU compositing, will-change)
 * - Drawing speed lag: scrollProgress source에 직접 useSpring → 매핑 → clip 순서로 연결,
 *   spring 초기값이 항상 source.get()(=0)으로 안전하게 잡혀 첫 paint에서 클립 깨지지 않음
 *
 * Props:
 * @param {Array<[string, number]>} series - [["YYYY-MM", value], ...] 트렌드 시리즈 [Required]
 * @param {number} axisY - 타임라인 축 Y 위치 (px), Y 0 기준선 [Required]
 * @param {number} totalWidth - 캔버스 전체 너비 (px) [Required]
 * @param {function} yearToX - 연도(소수 허용) → X 픽셀 매핑 함수 [Required]
 * @param {Object} scrollProgress - framer-motion MotionValue (0~1). 미주입 시 풀 노출 [Optional]
 * @param {number} viewportWidth - 현재 뷰포트 너비 (px), reveal frontier 시작 좌표 [Optional]
 *
 * Example usage:
 * <TimelineTrendBackground
 *   series={ trendData.series }
 *   axisY={ layout.axisY }
 *   totalWidth={ layout.totalWidth }
 *   yearToX={ layout.yearToX }
 *   scrollProgress={ scrollProgress }
 *   viewportWidth={ viewportWidth }
 * />
 */
function TimelineTrendBackground({
  series,
  peaks,
  axisY,
  totalWidth,
  yearToX,
  scrollProgress,
  viewportWidth,
}) {
  const theme = useTheme();

  const path = useMemo(() => {
    if (!series?.length || typeof yearToX !== 'function') return '';

    /** Y축 최대값(100)을 캔버스 상단(TOP_PADDING)에 매핑 → 전체 높이 활용 */
    const upperBudget = axisY - TOP_PADDING;

    const dateToX = (dateStr) => {
      const [y, m] = dateStr.split('-').map(Number);
      const frac = y + (m - 1) / 12;
      return yearToX(frac);
    };
    const indexToY = (v) => axisY - (v / 100) * upperBudget;

    const dataPoints = series.map(([date, value]) => [dateToX(date), indexToY(value)]);

    /** 데이터 시작 이전 구간: 첫 데이터 정확히 1년 전 한 점만 zero anchor.
        너무 멀리 끌고 가면 Catmull-Rom 보간이 과도하게 휘는 문제를 방지. */
    const firstDate = series[0][0];
    const [fy, fm] = firstDate.split('-').map(Number);
    const firstFrac = fy + (fm - 1) / 12;
    const points = [
      [yearToX(firstFrac - 1), axisY],
      ...dataPoints,
    ];

    return buildBezierPath(points);
  }, [series, axisY, yearToX]);

  /** Peak 마커 좌표 계산 — line의 (x, y)와 정확히 동일 식 사용. */
  const peakMarkers = useMemo(() => {
    if (!peaks?.length || typeof yearToX !== 'function') return [];
    const upperBudget = axisY - TOP_PADDING;
    return peaks.map((p) => {
      const [y, m] = p.date.split('-').map(Number);
      const frac = y + (m - 1) / 12;
      const px = yearToX(frac);
      const py = axisY - (p.value / 100) * upperBudget;
      return { ...p, px, py };
    });
  }, [peaks, axisY, yearToX]);

  /** scrollProgress (0~1) source 자체에 spring을 걸어 초기값이 source.get()=0으로
      안전하게 잡히게 함. (이전: useTransform 결과에 spring을 걸면 첫 평가 전 0으로
      초기화되어 clip-path가 전체를 가리는 버그 발생.) */
  const fallbackProgress = useMotionValue(1);
  const effectiveProgress = scrollProgress ?? fallbackProgress;
  const smoothProgress = useSpring(effectiveProgress, {
    stiffness: 90,
    damping: 28,
    mass: 1,
  });

  /** Reveal frontier — viewport 중앙의 canvas X 좌표를 정확히 추종.
      [0,1] → [viewportWidth/2, totalWidth - viewportWidth/2] 로 매핑하면
      scroll=p에서 line 끝점이 정확히 화면 중앙에 위치. */
  const halfViewport = Math.max((viewportWidth ?? 0) / 2, 0);
  const startX = halfViewport;
  const endX = Math.max(totalWidth - halfViewport, halfViewport);
  const revealX = useTransform(smoothProgress, [0, 1], [startX, endX]);

  /** CSS clip-path inset(top right bottom left) — GPU compositing layer.
      SVG <clipPath>의 매-프레임 path 재래스터화 비용 회피 → 스크롤 끊김 완화. */
  const rightInset = useTransform(revealX, (v) => Math.max(0, totalWidth - v));
  const clipPathValue = useMotionTemplate`inset(0px ${rightInset}px 0px 0px)`;

  if (!path) return null;

  const strokeColor = theme.palette.mode === 'dark'
    ? 'rgba(255, 255, 255, 0.95)'
    : 'rgba(0, 0, 0, 0.85)';

  return (
    <motion.svg
      width={ totalWidth }
      height={ axisY + 1 }
      style={ {
        position: 'absolute',
        top: 0,
        left: 0,
        pointerEvents: 'none',
        zIndex: 0,
        overflow: 'visible',
        clipPath: clipPathValue,
        WebkitClipPath: clipPathValue,
        willChange: 'clip-path',
      } }
      aria-hidden="true"
    >
      <path
        d={ path }
        fill="none"
        stroke={ strokeColor }
        strokeWidth={ 1.5 }
        strokeLinejoin="round"
        strokeLinecap="round"
      />

      {/* Peak 마커 — 트렌드 라인 위에 점 + value 라벨 + trigger 텍스트.
          peak.value가 100인 경우 강조(빨강+큰 dot), 그 외는 흰색 점. */}
      { peakMarkers.map((p) => {
        const isMax = p.value >= 100;
        const dotR = isMax ? 14 : 8;
        const ringR = dotR + 10;
        const markerColor = isMax ? '#E63946' : 'rgba(255,255,255,0.98)';
        const stickLen = isMax ? 110 : 90;
        const stickTop = Math.max(p.py - stickLen, 0);
        return (
          <g key={ `${p.date}-${p.value}` }>
            {/* vertical stick */}
            <line
              x1={ p.px }
              y1={ p.py - dotR - 4 }
              x2={ p.px }
              y2={ stickTop + 8 }
              stroke={ markerColor }
              strokeWidth={ isMax ? 2 : 1.4 }
              strokeDasharray={ isMax ? 'none' : '3,3' }
            />
            {/* 외곽 링 (전 peak 공통, max는 더 강조) */}
            <circle
              cx={ p.px }
              cy={ p.py }
              r={ ringR }
              fill="none"
              stroke={ markerColor }
              strokeWidth={ isMax ? 1.5 : 1 }
              opacity={ isMax ? 0.55 : 0.35 }
            />
            { isMax && (
              <circle
                cx={ p.px }
                cy={ p.py }
                r={ ringR + 8 }
                fill="none"
                stroke={ markerColor }
                strokeWidth={ 1 }
                opacity={ 0.25 }
              />
            ) }
            {/* peak point dot */}
            <circle
              cx={ p.px }
              cy={ p.py }
              r={ dotR }
              fill={ markerColor }
              stroke="#0A0A0A"
              strokeWidth={ isMax ? 2 : 1.5 }
            />
            {/* value 라벨 — 매우 크게 */}
            <text
              x={ p.px }
              y={ stickTop }
              fill={ markerColor }
              fontSize={ isMax ? 32 : 22 }
              fontWeight={ 900 }
              textAnchor="middle"
              fontFamily='"Cinzel", "IM Fell English", serif'
              letterSpacing="0.04em"
            >
              { p.value }
            </text>
            {/* trigger 라벨 */}
            <text
              x={ p.px }
              y={ stickTop + (isMax ? 22 : 18) }
              fill={ isMax ? markerColor : 'rgba(255,255,255,0.78)' }
              fontSize={ isMax ? 14 : 12 }
              fontWeight={ isMax ? 700 : 500 }
              textAnchor="middle"
              fontFamily='"IM Fell English", "Times New Roman", serif'
              letterSpacing="0.06em"
            >
              { p.trigger }
            </text>
            {/* date 라벨 */}
            <text
              x={ p.px }
              y={ stickTop + (isMax ? 40 : 34) }
              fill="rgba(255,255,255,0.5)"
              fontSize={ isMax ? 11 : 10 }
              textAnchor="middle"
              fontFamily='"IM Fell English", serif'
              letterSpacing="0.18em"
            >
              { p.date }
            </text>
          </g>
        );
      }) }
    </motion.svg>
  );
}

export { TimelineTrendBackground };
