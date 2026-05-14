import React, { useMemo } from 'react';
import { useTheme } from '@mui/material/styles';
import { BRAND_DISPLAY, PRODUCT } from './typography.js';

/** search index 100 = 캔버스 상단 패딩. 상단 타이틀(Damien Hirst) 영역과 겹치지 않도록
    충분한 여백 확보 (타이틀 영역 ≈ top 32 + 6rem 폰트 + sub 라벨 ≈ 160~170px). */
const TOP_PADDING = 200;
/** Catmull-Rom → Cubic Bezier 변환 tension */
const BEZIER_TENSION = 1 / 6;

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
 * TimelineTrendBackground — Google Trends 라인 + peak 마커
 *
 * - 라인 SVG: zIndex 0, clip-path reveal 적용 (scroll-tied)
 * - Peak 마커 SVG: zIndex 50, clip 영향 X, 항상 최상위 표시 (작품/축 위)
 *
 * Props:
 * @param {Array<[string, number]>} series - [["YYYY-MM", value], ...] [Required]
 * @param {Array<{date,value,trigger}>} peaks - peak 데이터 [Optional]
 * @param {number} axisY [Required]
 * @param {number} totalWidth [Required]
 * @param {function} yearToX [Required]
 * @param {Object} scrollProgress [Optional]
 * @param {number} viewportWidth [Optional]
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
    const upperBudget = axisY - TOP_PADDING;
    const dateToX = (dateStr) => {
      const [y, m] = dateStr.split('-').map(Number);
      const frac = y + (m - 1) / 12;
      return yearToX(frac);
    };
    const indexToY = (v) => axisY - (v / 100) * upperBudget;
    const dataPoints = series.map(([date, value]) => [dateToX(date), indexToY(value)]);
    const firstDate = series[0][0];
    const [fy, fm] = firstDate.split('-').map(Number);
    const firstFrac = fy + (fm - 1) / 12;
    const points = [[yearToX(firstFrac - 1), axisY], ...dataPoints];
    return buildBezierPath(points);
  }, [series, axisY, yearToX]);

  const peakMarkers = useMemo(() => {
    if (!peaks?.length || typeof yearToX !== 'function') return [];
    const upperBudget = axisY - TOP_PADDING;
    return peaks.map((p) => {
      const [y, m] = p.date.split('-').map(Number);
      const frac = y + (m - 1) / 12;
      return {
        ...p,
        px: yearToX(frac),
        py: axisY - (p.value / 100) * upperBudget,
      };
    });
  }, [peaks, axisY, yearToX]);

  /** scroll-tied reveal 자체 제거 — 19000px SVG 두 장의 clip-path 매 프레임 보간이
      가로 스크롤 jank의 최대 원인. 정적 SVG로 전환해 매 프레임 paint·motion 평가 0. */
  void scrollProgress; void viewportWidth;

  if (!path) return null;

  const strokeColor = theme.palette.mode === 'dark'
    ? 'rgba(255, 255, 255, 0.95)'
    : 'rgba(0, 0, 0, 0.85)';

  return (
    <>
      {/* 라인 SVG — 정적. clip-path/motion 제거. */}
      <svg
        width={ totalWidth }
        height={ axisY + 1 }
        style={ {
          position: 'absolute',
          top: 0,
          left: 0,
          pointerEvents: 'none',
          zIndex: 0,
          overflow: 'visible',
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
      </svg>

      {/* Peak 마커 SVG — 정적. clip-path 제거. */}
      <svg
        width={ totalWidth }
        height={ axisY + 200 }
        style={ {
          position: 'absolute',
          top: 0,
          left: 0,
          pointerEvents: 'none',
          zIndex: 50,
          overflow: 'visible',
        } }
        aria-hidden="true"
      >
        { peakMarkers.map((p) => {
          const isMax = p.value >= 100;
          const dotR = isMax ? 22 : 13;
          const ringR = dotR + 14;
          const outerRingR = ringR + 14;
          const markerColor = isMax ? '#E63946' : 'rgba(255,255,255,0.98)';
          const stickLen = isMax ? 160 : 130;
          const stickTop = Math.max(p.py - stickLen, 0);
          return (
            <g key={ `${p.date}-${p.value}` }>
              {/* vertical stick */}
              <line
                x1={ p.px }
                y1={ p.py - dotR - 6 }
                x2={ p.px }
                y2={ stickTop + 12 }
                stroke={ markerColor }
                strokeWidth={ isMax ? 3 : 2 }
                strokeDasharray={ isMax ? 'none' : '4,4' }
              />
              {/* 외곽 링 */}
              <circle
                cx={ p.px }
                cy={ p.py }
                r={ ringR }
                fill="none"
                stroke={ markerColor }
                strokeWidth={ isMax ? 2 : 1.5 }
                opacity={ isMax ? 0.6 : 0.4 }
              />
              {/* max용 추가 halo */}
              { isMax && (
                <circle
                  cx={ p.px }
                  cy={ p.py }
                  r={ outerRingR }
                  fill="none"
                  stroke={ markerColor }
                  strokeWidth={ 1.25 }
                  opacity={ 0.3 }
                />
              ) }
              {/* peak point dot */}
              <circle
                cx={ p.px }
                cy={ p.py }
                r={ dotR }
                fill={ markerColor }
                stroke="#0A0A0A"
                strokeWidth={ isMax ? 3 : 2 }
              />
              {/* value 라벨 — BRAND (큰 monumental 숫자) */}
              <text
                x={ p.px }
                y={ stickTop }
                fill={ markerColor }
                fontSize={ isMax ? 56 : 38 }
                fontWeight={ 900 }
                textAnchor="middle"
                fontFamily={ BRAND_DISPLAY }
                letterSpacing="0.04em"
              >
                { p.value }
              </text>
              {/* trigger 라벨 — PRODUCT (정보성) */}
              <text
                x={ p.px }
                y={ stickTop + (isMax ? 32 : 24) }
                fill={ isMax ? markerColor : 'rgba(255,255,255,0.88)' }
                fontSize={ isMax ? 16 : 13 }
                fontWeight={ isMax ? 600 : 500 }
                textAnchor="middle"
                fontFamily={ PRODUCT }
                letterSpacing="0.02em"
              >
                { p.trigger }
              </text>
              {/* date 라벨 — PRODUCT */}
              <text
                x={ p.px }
                y={ stickTop + (isMax ? 52 : 42) }
                fill="rgba(255,255,255,0.55)"
                fontSize={ isMax ? 12 : 10 }
                fontWeight={ 500 }
                textAnchor="middle"
                fontFamily={ PRODUCT }
                letterSpacing="0.12em"
              >
                { p.date }
              </text>
            </g>
          );
        }) }
      </svg>
    </>
  );
}

export { TimelineTrendBackground };
