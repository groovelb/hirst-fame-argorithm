import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { WorkImage } from './WorkImage.jsx';

const IMAGE_WIDTH = 60;
const IMAGE_HEIGHT = 80;
const YEAR_LABEL_HEIGHT = 18;
/** focus(viewport 중앙 Voronoi cell 내) 작품의 이미지 scale */
const MAX_FOCUS_SCALE = 3.6;
/** 비-focus 작품의 이미지 scale */
const MIN_FOCUS_SCALE = 0.4;

/**
 * TimelineWorkItem — 타임라인 축 상단의 개별 작품 노드
 *
 * 레이아웃 규약 (CRITICAL):
 * - work.y (yScale) = 이미지 box의 정확한 중앙 Y. 컨테이너 top = work.y - scaledH/2.
 * - **scale 대상은 이미지 element 한 개만**. 연도 라벨/툴팁은 scale 영향 받지 않음.
 * - 이미지 transform-origin: 50% 50% (이미지 자체 중앙) → 위·아래로 동시 확대,
 *   중앙은 work.y에 고정.
 * - focus는 한 번에 단 1개: viewport 중앙 X가 작품의 Voronoi cell
 *   (양옆 작품 중간점 사이) 안에 있으면 MAX_FOCUS_SCALE, 아니면 MIN_FOCUS_SCALE.
 * - useSpring으로 진입/이탈에서만 부드러운 transition (그 외엔 정지).
 * - Connector(인디케이터): 이미지 box 밖 별도 element. baseline = 이미지 box bottom~axis,
 *   focusScale로 이미지가 아래로 커지면 connector를 scaleY(축소)로 동기.
 * - 축 도트는 axisY에 절대 고정.
 *
 * Props:
 * @param {Object} work - 배치 계산된 작품 데이터 {x, y, band, title, year, image, ...} [Required]
 * @param {number} axisY - 축 Y 위치 (px) [Required]
 * @param {boolean} isActive - 호버/선택 상태 [Optional, 기본값: false]
 * @param {number} nodeScale - 노드 기본 크기 scale (반응형) [Optional, 기본값: 1]
 * @param {Object} viewportCenterX - viewport 중앙의 canvas X 좌표 MotionValue [Optional]
 * @param {number} prevX - 좌측 인접 작품의 x 좌표 (Voronoi 경계 계산) [Optional]
 * @param {number} nextX - 우측 인접 작품의 x 좌표 (Voronoi 경계 계산) [Optional]
 * @param {function} onMouseEnter - 마우스 진입 콜백 [Optional]
 * @param {function} onMouseLeave - 마우스 이탈 콜백 [Optional]
 * @param {function} onClick - 클릭 콜백 [Optional]
 *
 * Example usage:
 * <TimelineWorkItem work={pw} axisY={400} viewportCenterX={mv} prevX={1200} nextX={1500} />
 */
function TimelineWorkItem({
  work,
  axisY,
  isActive = false,
  nodeScale = 1,
  viewportCenterX,
  prevX,
  nextX,
  onMouseEnter,
  onMouseLeave,
  onClick,
}) {
  const dotSize = 6;
  const scaledW = Math.round(IMAGE_WIDTH * nodeScale);
  const scaledH = Math.round(IMAGE_HEIGHT * nodeScale);

  /** 이미지 box top — 이미지 center가 work.y(yScale)에 매칭 */
  const imageBoxTop = work.y - scaledH / 2;
  /** 이미지 box bottom (scale=1 기준) = connector layout top */
  const connectorTop = work.y + scaledH / 2;
  /** baseline connector 길이 (scale=1) */
  const connectorBaseH = Math.max(0, axisY - connectorTop);
  /** dot은 axisY에 절대 고정 */
  const dotTop = axisY - dotSize / 2;
  /** 툴팁 플립 기준 */
  const isFlipped = imageBoxTop < 140;
  /** 도트/connector 중심 X */
  const centerX = work.x + scaledW / 2;

  /** Voronoi 경계 — 양옆 작품 중간점. 이 사이에 viewportCenterX가 들어오면 focus. */
  const leftBoundary = prevX != null ? (prevX + work.x) / 2 : -Infinity;
  const rightBoundary = nextX != null ? (work.x + nextX) / 2 : Infinity;

  /** focus 판정 — 한 번에 단 1개만 MAX, 나머지는 MIN. */
  const fallbackCenter = useMotionValue(work.x);
  const sourceCenter = viewportCenterX ?? fallbackCenter;
  const targetScale = useTransform(sourceCenter, (cx) => {
    return (cx >= leftBoundary && cx < rightBoundary)
      ? MAX_FOCUS_SCALE
      : MIN_FOCUS_SCALE;
  });

  /** 진입/이탈 시점에만 부드러운 spring transition.
      stiffness 높여 빠른 snap, damping으로 출렁임 억제. */
  const focusScale = useSpring(targetScale, {
    stiffness: 220,
    damping: 26,
    mass: 1,
  });

  /** Connector scaleY — 이미지 visual bottom = work.y + scaledH·s/2 추종.
      newLen = baseline - scaledH·(s-1)/2 → scaleY = newLen / baseline. */
  const connectorScaleY = useTransform(focusScale, (s) => {
    if (connectorBaseH <= 0) return 1;
    const newLen = connectorBaseH - (scaledH * (s - 1)) / 2;
    return Math.max(0, newLen / connectorBaseH);
  });

  return (
    <>
      {/* 외부 컨테이너 — scale 적용 X. 레이아웃 anchor + hover 영역 */}
      <Box
        onMouseEnter={ onMouseEnter }
        onMouseLeave={ onMouseLeave }
        onClick={ onClick }
        sx={ {
          position: 'absolute',
          left: work.x,
          top: imageBoxTop,
          width: scaledW,
          height: scaledH,
          cursor: 'pointer',
          zIndex: isActive ? 10 : 2,
          '&:hover .work-tooltip': {
            opacity: 1,
            visibility: 'visible',
          },
        } }
      >
        {/* 연도 라벨 — scale 영향 X, 이미지 위쪽 고정 */}
        <Typography
          variant="caption"
          sx={ {
            position: 'absolute',
            top: -YEAR_LABEL_HEIGHT,
            left: 0,
            width: '100%',
            textAlign: 'center',
            color: 'text.disabled',
            fontSize: '0.6rem',
            lineHeight: `${YEAR_LABEL_HEIGHT}px`,
            height: YEAR_LABEL_HEIGHT,
            userSelect: 'none',
            pointerEvents: 'none',
          } }
        >
          { work.year }
        </Typography>

        {/* 이미지 — scale 대상. transform-origin: 50% 50% (이미지 자체 중앙).
            컨테이너 내부 absolute로 100% × 100% 채워서 박스 중앙 = work.y 일치. */}
        <motion.div
          style={ {
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            scale: focusScale,
            transformOrigin: '50% 50%',
            willChange: 'transform',
            pointerEvents: 'none',
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
        </motion.div>

        {/* 호버 툴팁 — scale 영향 X */}
        <Box
          className="work-tooltip"
          sx={ {
            position: 'absolute',
            left: '50%',
            ...(isFlipped
              ? { top: scaledH + 8, transform: 'translateX(-50%)' }
              : { top: -YEAR_LABEL_HEIGHT - 8, transform: 'translateX(-50%) translateY(-100%)' }
            ),
            opacity: 0,
            visibility: 'hidden',
            transition: 'opacity 0.2s ease, visibility 0.2s ease',
            backgroundColor: 'background.paper',
            p: 1.5,
            minWidth: 180,
            maxWidth: 220,
            boxShadow: (theme) => theme.customShadows?.md ?? theme.shadows[4],
            zIndex: 20,
            pointerEvents: 'none',
          } }
        >
          <Box sx={ { display: 'flex', gap: 0.5, mb: 1 } }>
            { work.color_blocks?.map((block, i) => (
              <Box
                key={ i }
                sx={ {
                  width: 12,
                  height: 12,
                  backgroundColor: block.color,
                  flexShrink: 0,
                } }
              />
            )) }
          </Box>

          <Typography
            variant="subtitle2"
            sx={ { fontWeight: 600, lineHeight: 1.3, mb: 0.25 } }
          >
            { work.title }
          </Typography>
          <Typography variant="caption" sx={ { color: 'text.secondary', display: 'block' } }>
            { work.year } · { work.medium }
          </Typography>
          { work.collection && (
            <Typography
              variant="caption"
              sx={ { color: 'text.disabled', display: 'block', mt: 0.25 } }
            >
              { work.collection }
            </Typography>
          ) }
        </Box>
      </Box>

      {/* Connector(인디케이터) — 이미지 box 밖 별도 element.
          baseline은 scale=1일 때 이미지 bottom~axis. scaleY로 길이 동기. */}
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
            willChange: 'transform',
          } }
        />
      ) }

      {/* 축 도트 — axisY에 절대 고정 */}
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
          zIndex: 1,
        } }
      />
    </>
  );
}

export { TimelineWorkItem };
