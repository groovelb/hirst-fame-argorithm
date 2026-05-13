import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { motion } from 'framer-motion';
import { useLocale } from '../../i18n';

const BAND_IMAGE_SRC = {
  TRANSCENDENCE: '/images/hirst/grotesque-bitmap/transcendence-sacred-heart.png',
  SYSTEM: '/images/hirst/grotesque-bitmap/system-medicine-cabinet.png',
  RITUAL: '/images/hirst/grotesque-bitmap/ritual-vanitas-burning-money.png',
  VANITAS: '/images/hirst/grotesque-bitmap/ritual-vanitas-burning-money.png',
  MORTALITY: '/images/hirst/grotesque-bitmap/mortality-skull.png',
};

/**
 * TimelineAxis — 중앙 수평 축선 + 연도 틱 + 시기 배경 밴드 + Y축 감정 밴드 틱
 *
 * Props:
 * @param {number} totalWidth - 캔버스 전체 너비 (px) [Required]
 * @param {number} axisY - 축의 Y 위치 (px) [Required]
 * @param {Array} yearTicks - 연도 틱 데이터 [{year, x, isMajor}] [Required]
 * @param {Array} periodBands - 시기 밴드 데이터 [{id, x, width, color, label}] [Required]
 * @param {Array} emotionBands - Y축 감정 밴드 [{id, label, y}] [Required]
 * @param {number} viewportHeight - 뷰포트 높이 [Required]
 * @param {Object} scrollOffset - Y축 라벨 고정용 framer-motion MotionValue [Optional]
 *
 * Example usage:
 * <TimelineAxis totalWidth={8000} axisY={400} yearTicks={ticks} periodBands={bands} emotionBands={eBands} viewportHeight={800} />
 */
function TimelineAxis({ totalWidth, axisY, yearTicks, periodBands, emotionBands, viewportHeight, scrollOffset }) {
  const { t } = useLocale();

  return (
    <>

      {/* Y축 세계관 카테고리 행 구분선 */}
      { emotionBands.map((band) => (
        <Box
          key={ band.id }
          sx={ {
            position: 'absolute',
            left: 0,
            top: band.y,
            width: totalWidth,
            height: '1px',
            backgroundColor: 'rgba(246, 246, 236, 0.04)',
            pointerEvents: 'none',
          } }
        />
      )) }

      {/* Y축 세계관 밴드 메타포 + 라벨 (스크롤 시 화면 고정) */}
      { emotionBands.map((band) => {
        const imageSrc = BAND_IMAGE_SRC[band.id];

        return (
          <motion.div
            key={ `label-${band.id}` }
            style={ {
              position: 'absolute',
              left: 18,
              top: band.y,
              transform: 'translateY(-50%)',
              pointerEvents: 'none',
              zIndex: 5,
              x: scrollOffset,
            } }
          >
            <Box
              sx={ {
                display: 'flex',
                alignItems: 'center',
                gap: 1.25,
                height: 64,
              } }
            >
              { imageSrc && (
                <Box
                  component="img"
                  src={ imageSrc }
                  alt=""
                  aria-hidden="true"
                  sx={ {
                    width: { xs: 42, sm: 48, md: 56 },
                    height: { xs: 42, sm: 48, md: 56 },
                    objectFit: 'contain',
                    opacity: 1,
                    mixBlendMode: 'normal',
                    filter: 'none',
                    backgroundColor: 'transparent',
                    userSelect: 'none',
                    flexShrink: 0,
                  } }
                />
              ) }
              <Typography
                variant="caption"
                sx={ {
                  color: 'rgba(246, 246, 236, 0.36)',
                  fontSize: { xs: '0.55rem', md: '0.6rem' },
                  fontWeight: 600,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  userSelect: 'none',
                  whiteSpace: 'nowrap',
                  textShadow: 'none',
                } }
              >
                { band.localeKey ? t(band.localeKey) : band.label }
              </Typography>
            </Box>
          </motion.div>
        );
      }) }

      {/* 연도 vertical guide lines — 화면 height 전체로 확장한 grid */}
      { yearTicks.map((tick) => (
        <Box
          key={ `vline-${tick.year}` }
          sx={ {
            position: 'absolute',
            left: tick.x,
            top: 0,
            width: '1px',
            height: viewportHeight,
            backgroundColor: tick.isMajor
              ? 'rgba(255, 255, 255, 0.06)'
              : 'rgba(255, 255, 255, 0.022)',
            transform: 'translateX(-0.5px)',
            pointerEvents: 'none',
            zIndex: 0,
          } }
        />
      )) }

      {/* 수평 축선 — 강조된 horizontal axis */}
      <Box
        sx={ {
          position: 'absolute',
          left: 0,
          top: axisY,
          width: totalWidth,
          height: '1px',
          backgroundColor: 'rgba(255, 255, 255, 0.18)',
          pointerEvents: 'none',
          zIndex: 1,
        } }
      />

      {/* 연도 라벨 */}
      { yearTicks.map((tick) => (
        <Typography
          key={ `label-${tick.year}` }
          variant="caption"
          sx={ {
            position: 'absolute',
            left: tick.x,
            top: axisY + 8,
            transform: 'translateX(-50%)',
            color: tick.isMajor ? 'text.disabled' : 'action.disabled',
            fontWeight: tick.isMajor ? 600 : 400,
            fontSize: tick.isMajor ? '0.75rem' : '0.625rem',
            whiteSpace: 'nowrap',
            userSelect: 'none',
            pointerEvents: 'none',
            fontFamily: '"IM Fell English", "Cinzel", "Times New Roman", serif',
            letterSpacing: '0.05em',
          } }
        >
          { tick.year }
        </Typography>
      )) }
    </>
  );
}

export { TimelineAxis };
