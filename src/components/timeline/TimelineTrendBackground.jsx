import React, { useMemo } from 'react';
import { useTheme } from '@mui/material/styles';
import { motion, useMotionTemplate, useMotionValue, useSpring, useTransform } from 'framer-motion';

/** search index 100 = 캔버스 상단 패딩. 작품 영역의 최상단(Y 최대값)과 동일 좌표 */
const TOP_PADDING = 40;
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
    </motion.svg>
  );
}

export { TimelineTrendBackground };
