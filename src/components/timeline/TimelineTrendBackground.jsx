import React, { useMemo } from 'react';
import { useTheme } from '@mui/material/styles';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import { PRODUCT } from './typography.js';
import { TOKENS } from '../../styles/themes/tokens.js';

/** search index 100 = 캔버스 상단 패딩. */
const TOP_PADDING = 200;
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
 * 퍼포먼스 전략 (Compositor 친화):
 * - 두 SVG의 폭을 viewport(=화면 폭)으로 좁힘. paint area = 19000×H → 1920×H (≈10× 감소).
 * - 외부 wrapper: motion track의 translateX를 상쇄(`x: scrollOffset`)해 SVG를 viewport에 박음.
 * - SVG는 overflow:hidden. 내부 `<motion.g x={negativeOffset}>`로 path 좌표를 현재 스크롤
 *   위치만큼 평행이동해 항상 viewport 안의 영역만 paint.
 * - 결과: GPU layer 크기 작아지고, transform-only 갱신이라 paint 발생 없음.
 *
 * Props:
 * @param {Array<[string, number]>} series [Required]
 * @param {Array<{date,value,trigger}>} peaks [Optional]
 * @param {number} axisY [Required]
 * @param {number} totalWidth [Required]
 * @param {function} yearToX [Required]
 * @param {Object} scrollProgress - framer-motion MotionValue (0~1) [Optional]
 * @param {number} viewportWidth [Optional]
 * @param {function} onPeakHover - (peakObj) => void [Optional]
 * @param {function} onPeakLeave - () => void [Optional]
 * @param {function} onPeakClick - (peakObj) => void. modal 열기 [Optional]
 */
function TimelineTrendBackground({
  series,
  peaks,
  axisY,
  totalWidth,
  yearToX,
  scrollProgress,
  viewportWidth,
  onPeakHover,
  onPeakLeave,
  onPeakClick,
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

  const safeViewportWidth = viewportWidth ?? 1920;
  const scrollDistance = Math.max(0, totalWidth - safeViewportWidth);

  const fallbackProgress = useMotionValue(0);
  const effectiveProgress = scrollProgress ?? fallbackProgress;
  /** wrapper의 +x → 트랙 translateX(-x) 보정 → viewport에 박힘. */
  const positiveOffset = useTransform(effectiveProgress, (p) => p * scrollDistance);
  /** inner g의 -x → totalWidth 좌표계의 path를 현재 viewport 위치로 평행이동. */
  const negativeOffset = useTransform(effectiveProgress, (p) => -p * scrollDistance);

  if (!path) return null;

  const strokeColor = theme.palette.mode === 'dark'
    ? TOKENS.alpha.onDark(0.95)
    : TOKENS.alpha.onLight(0.85);

  /** 공통 wrapper style — viewport-fixed, transform-only 갱신, GPU layer 고정.
      wrapper 자체는 pointer-events 차단 (작품 hover 방해 X). peak <g>에서만 auto. */
  const wrapperBase = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: safeViewportWidth,
    pointerEvents: 'none',
    willChange: 'transform',
  };
  const hasPeakHover = typeof onPeakHover === 'function';
  const hasPeakClick = typeof onPeakClick === 'function';
  const peakInteractive = hasPeakHover || hasPeakClick;

  return (
    <>
      {/* 라인 wrapper — zIndex 0 */}
      <motion.div
        style={ {
          ...wrapperBase,
          height: axisY + 1,
          zIndex: 0,
          x: positiveOffset,
        } }
        aria-hidden="true"
      >
        <svg
          width={ safeViewportWidth }
          height={ axisY + 1 }
          style={ { overflow: 'hidden', display: 'block' } }
        >
          <motion.g style={ { x: negativeOffset } }>
            <path
              d={ path }
              fill="none"
              stroke={ strokeColor }
              strokeWidth={ 1.5 }
              strokeLinejoin="round"
              strokeLinecap="round"
            />
          </motion.g>
        </svg>
      </motion.div>

      {/* Peak 마커 wrapper — zIndex 50 (작품/축 위) */}
      <motion.div
        style={ {
          ...wrapperBase,
          height: axisY + 200,
          zIndex: 50,
          x: positiveOffset,
        } }
        aria-hidden="true"
      >
        <svg
          width={ safeViewportWidth }
          height={ axisY + 200 }
          style={ { overflow: 'hidden', display: 'block' } }
        >
          <motion.g style={ { x: negativeOffset } }>
            { peakMarkers.map((p) => {
              /** 단순화: dot + 짧은 stick + 핵심 사건명 1줄.
                  큰 value 숫자, date, 외곽 ring, halo 모두 제거 — 라인 위에 깔끔히. */
              const isMax = p.value >= 100;
              const dotR = isMax ? 14 : 10;
              const markerColor = isMax ? '#E63946' : 'rgba(255,255,255,0.92)';
              const stickLen = 56;
              const stickTop = Math.max(p.py - stickLen, 0);
              const labelY = Math.max(stickTop - 8, 12);
              const hitW = 180;
              const hitH = (p.py - labelY) + dotR + 24;
              return (
                <g
                  key={ `${p.date}-${p.value}` }
                  onMouseEnter={ hasPeakHover ? () => onPeakHover(p) : undefined }
                  onMouseLeave={ hasPeakHover ? () => onPeakLeave?.() : undefined }
                  onClick={ hasPeakClick ? () => onPeakClick(p) : undefined }
                  style={ { cursor: peakInteractive ? 'pointer' : 'default', pointerEvents: 'auto' } }
                >
                  {/* invisible hit-rect */}
                  <rect
                    x={ p.px - hitW / 2 }
                    y={ labelY - 14 }
                    width={ hitW }
                    height={ hitH }
                    fill="transparent"
                  />
                  {/* 짧은 stick */}
                  <line
                    x1={ p.px }
                    y1={ p.py - dotR - 4 }
                    x2={ p.px }
                    y2={ stickTop + 4 }
                    stroke={ markerColor }
                    strokeWidth={ 1 }
                    opacity={ 0.65 }
                  />
                  {/* dot */}
                  <circle
                    cx={ p.px }
                    cy={ p.py }
                    r={ dotR }
                    fill={ markerColor }
                    stroke={ TOKENS.bg.page }
                    strokeWidth={ 1.5 }
                  />
                  {/* 핵심 사건명 한 줄 */}
                  <text
                    x={ p.px }
                    y={ labelY }
                    fill={ isMax ? markerColor : 'rgba(255,255,255,0.85)' }
                    fontSize={ 12 }
                    fontWeight={ 600 }
                    textAnchor="middle"
                    fontFamily={ PRODUCT }
                    letterSpacing="0.02em"
                  >
                    { p.trigger }
                  </text>
                </g>
              );
            }) }
          </motion.g>
        </svg>
      </motion.div>
    </>
  );
}

export { TimelineTrendBackground };
