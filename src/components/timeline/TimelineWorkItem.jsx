import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import { WorkImage } from './WorkImage.jsx';
import { PRODUCT } from './typography.js';

const IMAGE_WIDTH = 96;
const IMAGE_HEIGHT = 128;
const YEAR_LABEL_HEIGHT = 18;

/**
 * TimelineWorkItem — 타임라인 축 상단의 개별 작품 노드.
 *
 * Focus/hover 인터랙션이 모두 제거된 단순 노드.
 * 유지되는 동작:
 *  - 등장(entry) fade-in: 작품이 viewport 중앙에서 우측 trigger 거리 안으로 들어오면
 *    connector가 axis dot에서 위로 그려진 뒤 이미지가 페이드인.
 *  - axis dot, 연도 라벨, connector dashed line은 정적.
 *
 * 제거된 동작: Voronoi focus scale(MAX/MIN), hover tooltip, active/dim 상태.
 *
 * Props:
 * @param {Object} work - 배치 계산된 작품 데이터 [Required]
 * @param {number} axisY [Required]
 * @param {number} nodeScale [Optional, 기본값: 1]
 * @param {Object} viewportCenterX [Optional]
 * @param {number} focusRadius [Optional, 기본값: 800]
 * @param {boolean} isDimmed - hover 중 다른 작품이 active일 때 흐림 처리 [Optional, 기본값: false]
 * @param {function} onMouseEnter - 마우스 진입 콜백(work.id) [Optional]
 * @param {function} onMouseLeave - 마우스 이탈 콜백 [Optional]
 * @param {function} onClick - 클릭 콜백(work.id). modal 열기 [Optional]
 *
 * Example usage:
 * <TimelineWorkItem work={pw} axisY={400} onMouseEnter={ fn } onClick={ fn } />
 */
function TimelineWorkItem({
  work,
  axisY,
  nodeScale = 1,
  viewportCenterX,
  focusRadius = 800,
  isDimmed = false,
  onMouseEnter,
  onMouseLeave,
  onClick,
}) {
  const dotSize = 6;
  const scaledW = Math.round(IMAGE_WIDTH * nodeScale);
  const scaledH = Math.round(IMAGE_HEIGHT * nodeScale);

  const imageBoxTop = work.y - scaledH / 2;
  const connectorTop = work.y + scaledH / 2;
  const connectorBaseH = Math.max(0, axisY - connectorTop);
  const dotTop = axisY - dotSize / 2;
  const centerX = work.x + scaledW / 2;

  const fallbackCenter = useMotionValue(work.x);
  const sourceCenter = viewportCenterX ?? fallbackCenter;
  const triggerRadius = Math.max(focusRadius, 1);

  /** Entry progress 단일 source — opacity, connector lineDraw 모두 여기서 파생.
      distance > triggerRadius: 0, ≤0: 1, 그 사이: linear. */
  /** Connector scaleY = lineDraw (Phase 1, 0~0.5 → 0~1). transform-origin: bottom. */
  const connectorScaleY = useTransform(sourceCenter, (cx) => {
    const distance = work.x - cx;
    const entry = distance <= 0
      ? 1
      : distance >= triggerRadius ? 0 : 1 - distance / triggerRadius;
    return entry < 0.5 ? entry / 0.5 : 1;
  });

  /** 이미지 opacity (Phase 2, 0.5~1 → 0~1). */
  const entryOpacity = useTransform(sourceCenter, (cx) => {
    const distance = work.x - cx;
    const entry = distance <= 0
      ? 1
      : distance >= triggerRadius ? 0 : 1 - distance / triggerRadius;
    return entry < 0.5 ? 0 : (entry - 0.5) / 0.5;
  });

  return (
    <>
      {/* 외부 컨테이너 — entry opacity + hover dim + click modal. */}
      <motion.div
        onMouseEnter={ () => onMouseEnter?.(work.id) }
        onMouseLeave={ () => onMouseLeave?.() }
        onClick={ () => onClick?.(work.id) }
        style={ {
          position: 'absolute',
          left: work.x,
          top: imageBoxTop,
          width: scaledW,
          height: scaledH,
          opacity: entryOpacity,
          visibility: isDimmed ? 'hidden' : 'visible',
          transition: 'opacity 0.28s ease, visibility 0.28s ease',
          cursor: 'pointer',
          zIndex: 2,
          pointerEvents: isDimmed ? 'none' : 'auto',
        } }
      >
        {/* 연도 라벨 */}
        <Typography
          variant="caption"
          sx={ {
            position: 'absolute',
            top: -YEAR_LABEL_HEIGHT,
            left: 0,
            width: '100%',
            textAlign: 'center',
            fontFamily: PRODUCT,
            fontWeight: 500,
            color: 'text.disabled',
            fontSize: '0.65rem',
            lineHeight: `${YEAR_LABEL_HEIGHT}px`,
            height: YEAR_LABEL_HEIGHT,
            letterSpacing: '0.02em',
            userSelect: 'none',
          } }
        >
          { work.year }
        </Typography>

        {/* 이미지 — focus scale 제거, 항상 1.0. */}
        <Box
          sx={ {
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
          } }
        >
          <WorkImage
            work={ work }
            sx={ {
              display: 'block',
              width: '100%',
              height: '100%',
              objectFit: 'contain',
            } }
          />
        </Box>
      </motion.div>

      {/* Connector — dim 시 함께 숨김 */}
      { connectorBaseH > 0 && (
        <motion.div
          aria-hidden="true"
          style={ {
            scaleY: connectorScaleY,
            transformOrigin: '50% 100%',
            position: 'absolute',
            left: centerX - 0.5,
            top: connectorTop,
            width: '1px',
            height: connectorBaseH,
            borderLeft: '1px dashed rgba(255,255,255,0.14)',
            pointerEvents: 'none',
            zIndex: 1,
            visibility: isDimmed ? 'hidden' : 'visible',
            transition: 'visibility 0.28s ease',
          } }
        />
      ) }

      {/* 축 도트 — dim 시 함께 숨김 */}
      <Box
        sx={ {
          position: 'absolute',
          left: centerX,
          top: dotTop,
          width: dotSize,
          height: dotSize,
          borderRadius: '50%',
          backgroundColor: 'text.disabled',
          transform: 'translateX(-50%)',
          pointerEvents: 'none',
          visibility: isDimmed ? 'hidden' : 'visible',
          transition: 'visibility 0.28s ease',
          zIndex: 1,
        } }
      />
    </>
  );
}

export { TimelineWorkItem };
