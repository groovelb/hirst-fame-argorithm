import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import { WorkImage } from './WorkImage.jsx';
import { BRAND_DISPLAY, PRODUCT } from './typography.js';

/** framer-motion 가능한 MUI Box — sx + motion style 동시 사용 */
const MotionBox = motion(Box);

const IMAGE_WIDTH = 96;
const IMAGE_HEIGHT = 128;
const YEAR_LABEL_HEIGHT = 18;
/** focus(viewport 중앙 Voronoi cell 내) 작품의 이미지 scale */
const MAX_FOCUS_SCALE = 4.6;
/** 비-focus 작품의 이미지 scale */
const MIN_FOCUS_SCALE = 0.55;

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
  isDimmed = false,
  nodeScale = 1,
  viewportCenterX,
  focusRadius = 800,
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

  /** Voronoi 경계 — 양옆 작품 중간점. 이 사이에 viewportCenterX가 들어오면 focus.
      hard step은 거칠어 보이므로 경계 ±BLEND_PX 구간에서 linear blend. */
  const leftBoundary = prevX != null ? (prevX + work.x) / 2 : -Infinity;
  const rightBoundary = nextX != null ? (work.x + nextX) / 2 : Infinity;
  const BLEND_PX = 40;

  const fallbackCenter = useMotionValue(work.x);
  const sourceCenter = viewportCenterX ?? fallbackCenter;

  /** focusScale — useSpring 제거. scroll 구동 값은 이미 부드러우므로 useTransform 만으로 충분.
      경계 ±BLEND_PX 구간에서 MIN↔MAX 보간하여 snap 거칠음 해소. */
  const focusScale = useTransform(sourceCenter, (cx) => {
    if (cx < leftBoundary - BLEND_PX || cx >= rightBoundary + BLEND_PX) {
      return MIN_FOCUS_SCALE;
    }
    if (cx >= leftBoundary && cx < rightBoundary) return MAX_FOCUS_SCALE;
    const range = MAX_FOCUS_SCALE - MIN_FOCUS_SCALE;
    if (cx < leftBoundary) {
      const t = (cx - (leftBoundary - BLEND_PX)) / BLEND_PX;
      return MIN_FOCUS_SCALE + range * t;
    }
    const t = (rightBoundary + BLEND_PX - cx) / BLEND_PX;
    return MIN_FOCUS_SCALE + range * t;
  });

  /** Entry: 단일 useTransform으로 line-draw progress와 image opacity를 동시 계산.
      두 phase 0~0.5 / 0.5~1을 inline으로 처리해 motion-value 노드 3개 → 2개로 축소. */
  const triggerRadius = Math.max(focusRadius, 1);
  /** Connector scaleY (focus base × line draw progress)를 하나의 useTransform으로 통합.
      transform-origin: '50% 100%' (axis dot bottom). */
  const connectorScaleY = useTransform(sourceCenter, (cx) => {
    const distance = work.x - cx;
    const entry = distance <= 0
      ? 1
      : distance >= triggerRadius ? 0 : 1 - distance / triggerRadius;
    const lineDraw = entry < 0.5 ? entry / 0.5 : 1;
    if (connectorBaseH <= 0) return lineDraw;
    /** focus scale 재계산 — Voronoi 결과를 inline (구독 추가 없이). */
    let s;
    if (cx < leftBoundary - BLEND_PX || cx >= rightBoundary + BLEND_PX) {
      s = MIN_FOCUS_SCALE;
    } else if (cx >= leftBoundary && cx < rightBoundary) {
      s = MAX_FOCUS_SCALE;
    } else {
      const range = MAX_FOCUS_SCALE - MIN_FOCUS_SCALE;
      s = cx < leftBoundary
        ? MIN_FOCUS_SCALE + range * ((cx - (leftBoundary - BLEND_PX)) / BLEND_PX)
        : MIN_FOCUS_SCALE + range * ((rightBoundary + BLEND_PX - cx) / BLEND_PX);
    }
    const newLen = connectorBaseH - (scaledH * (s - 1)) / 2;
    const base = Math.max(0, newLen / connectorBaseH);
    return base * lineDraw;
  });

  /** 이미지 opacity — Phase 2 (entry 0.5~1.0). */
  const entryOpacity = useTransform(sourceCenter, (cx) => {
    const distance = work.x - cx;
    const entry = distance <= 0
      ? 1
      : distance >= triggerRadius ? 0 : 1 - distance / triggerRadius;
    return entry < 0.5 ? 0 : (entry - 0.5) / 0.5;
  });

  return (
    <>
      {/* 외부 컨테이너 — Entry transition(opacity, translateY) + hover dim 결합 */}
      <MotionBox
        onMouseEnter={ onMouseEnter }
        onMouseLeave={ onMouseLeave }
        onClick={ onClick }
        style={ {
          opacity: entryOpacity,
        } }
        sx={ {
          position: 'absolute',
          left: work.x,
          top: imageBoxTop,
          width: scaledW,
          height: scaledH,
          cursor: 'pointer',
          zIndex: isActive ? 30 : isDimmed ? 1 : 2,
          filter: isDimmed ? 'opacity(0.12)' : 'none',
          transition: 'filter 0.28s ease',
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
            fontFamily: PRODUCT,
            fontWeight: 500,
            color: 'text.disabled',
            fontSize: '0.65rem',
            lineHeight: `${YEAR_LABEL_HEIGHT}px`,
            height: YEAR_LABEL_HEIGHT,
            letterSpacing: '0.02em',
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

        {/* 호버 정보 카드 — scale 영향 X, isActive시 항상 표시.
            연도(BRAND, 큰 숫자) + 제목(BRAND) + 본문(PRODUCT) 분리. */}
        <Box
          className="work-tooltip"
          sx={ {
            position: 'absolute',
            left: '50%',
            ...(isFlipped
              ? { top: scaledH + 14, transform: 'translateX(-50%)' }
              : { top: -YEAR_LABEL_HEIGHT - 14, transform: 'translateX(-50%) translateY(-100%)' }
            ),
            opacity: 0,
            visibility: 'hidden',
            transition: 'opacity 0.22s ease, visibility 0.22s ease',
            backgroundColor: 'rgba(10, 10, 10, 0.92)',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(255,255,255,0.08)',
            p: 2,
            minWidth: 260,
            maxWidth: 320,
            boxShadow: '0 8px 32px rgba(0,0,0,0.6)',
            zIndex: 40,
            pointerEvents: 'none',
          } }
        >
          {/* color blocks (시각 식별) */}
          <Box sx={ { display: 'flex', gap: 0.5, mb: 1.5 } }>
            { work.color_blocks?.map((block, i) => (
              <Box
                key={ i }
                sx={ {
                  width: 14,
                  height: 14,
                  backgroundColor: block.color,
                  flexShrink: 0,
                } }
              />
            )) }
          </Box>

          {/* 연도 — BRAND 큰 monumental 숫자 */}
          <Typography
            sx={ {
              fontFamily: BRAND_DISPLAY,
              fontWeight: 900,
              fontSize: '1.6rem',
              lineHeight: 1,
              letterSpacing: '0.04em',
              color: 'text.primary',
              mb: 0.75,
            } }
          >
            { work.year }
          </Typography>

          {/* 작품 제목 — BRAND italic 같은 무게는 안 주되 serif로 */}
          <Typography
            sx={ {
              fontFamily: BRAND_DISPLAY,
              fontWeight: 500,
              fontSize: '1.05rem',
              lineHeight: 1.25,
              letterSpacing: '0.01em',
              color: 'text.primary',
              mb: 1,
            } }
          >
            { work.title }
          </Typography>

          {/* medium — PRODUCT (정보성) */}
          { work.medium && (
            <Typography
              sx={ {
                fontFamily: PRODUCT,
                fontSize: '0.78rem',
                fontWeight: 400,
                lineHeight: 1.45,
                color: 'text.secondary',
                display: 'block',
                mb: work.collection || work.description ? 0.75 : 0,
              } }
            >
              { work.medium }
            </Typography>
          ) }

          {/* collection — PRODUCT */}
          { work.collection && (
            <Typography
              sx={ {
                fontFamily: PRODUCT,
                fontSize: '0.72rem',
                fontWeight: 500,
                lineHeight: 1.4,
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
                color: 'text.disabled',
                display: 'block',
                mb: work.description ? 0.75 : 0,
              } }
            >
              { work.collection }
            </Typography>
          ) }

          {/* description — PRODUCT body */}
          { work.description && (
            <Typography
              sx={ {
                fontFamily: PRODUCT,
                fontSize: '0.78rem',
                fontWeight: 400,
                lineHeight: 1.5,
                color: 'text.secondary',
                display: 'block',
                mt: 0.5,
                opacity: 0.9,
              } }
            >
              { work.description }
            </Typography>
          ) }
        </Box>
      </MotionBox>

      {/* Connector(인디케이터) — 이미지 box 밖 별도 element.
          baseline은 scale=1일 때 이미지 bottom~axis. scaleY로 길이 동기.
          isDimmed시 함께 흐려짐. */}
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
            opacity: isDimmed ? 0.12 : 1,
            transition: 'opacity 0.28s ease',
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
          opacity: isDimmed ? 0.12 : 1,
          transition: 'opacity 0.28s ease',
        } }
      />
    </>
  );
}

export { TimelineWorkItem };
