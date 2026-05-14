import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useLocale } from '../../i18n';
import { BRAND_LABEL } from './typography.js';

/** 5밴드 표시 순서 — 좌→우 */
const BAND_ORDER = ['MORTALITY', 'VANITAS', 'RITUAL', 'SYSTEM', 'TRANSCENDENCE'];

/** 밴드별 이미지 — TimelineAxis.jsx와 동일 자산 사용 */
const BAND_IMAGE_SRC = {
  TRANSCENDENCE: '/images/hirst/grotesque-bitmap/transcendence-sacred-heart.png',
  SYSTEM: '/images/hirst/grotesque-bitmap/system-medicine-cabinet.png',
  RITUAL: '/images/hirst/grotesque-bitmap/ritual-vanitas-burning-money.png',
  VANITAS: '/images/hirst/grotesque-bitmap/ritual-vanitas-burning-money.png',
  MORTALITY: '/images/hirst/grotesque-bitmap/mortality-skull.png',
};

const BAND_LOCALE_KEYS = {
  TRANSCENDENCE: 'band.transcendence',
  SYSTEM: 'band.system',
  RITUAL: 'band.ritual',
  VANITAS: 'band.vanitas',
  MORTALITY: 'band.mortality',
};

/**
 * BandLegend — 화면 하단 고정 5밴드 범례.
 *
 * WorldviewTimeline에서 모든 작품 y를 화면 중앙으로 통일한 뒤,
 * 좌측에 있던 카테고리 라벨을 이곳으로 옮긴 컴포넌트.
 * 가로 스크롤로 viewport 중앙에 도달한 작품의 band가 `activeBandId`로 들어오면
 * 해당 항목만 강조하고 나머지는 dim한다.
 *
 * Props:
 * @param {string|null} activeBandId - 강조할 밴드 ID [Optional, 기본값: null]
 *
 * Example usage:
 * <BandLegend activeBandId={ 'MORTALITY' } />
 */
function BandLegend({ activeBandId = null }) {
  const { t } = useLocale();

  return (
    <Box
      sx={ {
        position: 'fixed',
        left: '50%',
        bottom: { xs: 16, md: 24 },
        transform: 'translateX(-50%)',
        zIndex: 50,
        display: 'flex',
        alignItems: 'flex-end',
        gap: { xs: 1.5, md: 3 },
        px: { xs: 1.5, md: 3 },
        py: { xs: 1, md: 1.5 },
        backgroundColor: 'rgba(10, 10, 10, 0.55)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255,255,255,0.06)',
        borderRadius: 1,
        pointerEvents: 'none',
        userSelect: 'none',
      } }
    >
      { BAND_ORDER.map((bandId) => {
        const isActive = activeBandId === bandId;
        const isDimmed = activeBandId != null && !isActive;
        const imageSrc = BAND_IMAGE_SRC[bandId];
        const localeKey = BAND_LOCALE_KEYS[bandId];

        return (
          <Box
            key={ bandId }
            sx={ {
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 0.5,
              opacity: isDimmed ? 0.28 : 1,
              transform: isActive ? 'translateY(-4px)' : 'translateY(0)',
              transition: 'opacity 0.32s ease, transform 0.32s ease, filter 0.32s ease',
              filter: isDimmed ? 'grayscale(0.6)' : 'none',
            } }
          >
            { imageSrc && (
              <Box
                component="img"
                src={ imageSrc }
                alt=""
                aria-hidden="true"
                sx={ {
                  width: { xs: 32, sm: 40, md: 48 },
                  height: { xs: 32, sm: 40, md: 48 },
                  objectFit: 'contain',
                  flexShrink: 0,
                } }
              />
            ) }
            <Typography
              variant="caption"
              sx={ {
                fontFamily: BRAND_LABEL,
                fontSize: { xs: '0.55rem', md: '0.62rem' },
                fontWeight: 600,
                letterSpacing: '0.16em',
                textTransform: 'uppercase',
                color: isActive ? 'text.primary' : 'rgba(246, 246, 236, 0.48)',
                whiteSpace: 'nowrap',
                transition: 'color 0.32s ease',
              } }
            >
              { t(localeKey) || bandId }
            </Typography>
          </Box>
        );
      }) }
    </Box>
  );
}

export { BandLegend };
