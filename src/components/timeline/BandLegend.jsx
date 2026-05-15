import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { BAND_IMAGE_SRC, BAND_LABEL_EN, BAND_ORDER } from './bandMeta.js';
import { PRODUCT } from './typography.js';

/**
 * BandLegend — 화면 하단 고정 5밴드 범례.
 *
 * activeBandId 주어지면 해당 밴드를 강조(밝게 + 위로 살짝 부상)하고
 * 나머지는 dim(grayscale + opacity↓) 처리. 영어 라벨 고정, border 없음.
 *
 * Props:
 * @param {string|null} activeBandId - 강조할 밴드 ID [Optional, 기본값: null]
 *
 * Example usage:
 * <BandLegend activeBandId={ 'MORTALITY' } />
 */
function BandLegend({ activeBandId = null }) {
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
        /* xs: "Transcendence" 13자 × 5 라벨 + gap → 360px viewport에서 빠듯
           gap 1 (8px), px 1 (8px), 라벨 fontSize는 아래 0.5rem으로 축소 */
        gap: { xs: 1, md: 3 },
        px: { xs: 1, md: 3 },
        py: { xs: 1, md: 1.5 },
        maxWidth: '100vw',
        pointerEvents: 'none',
        userSelect: 'none',
      } }
    >
      { BAND_ORDER.map((bandId) => {
        const imageSrc = BAND_IMAGE_SRC[bandId];
        const isActive = activeBandId === bandId;
        const isDimmed = activeBandId != null && !isActive;
        return (
          <Box
            key={ bandId }
            sx={ {
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 0.5,
              opacity: isDimmed ? 0.32 : 1,
              transform: isActive ? 'translateY(-4px)' : 'translateY(0)',
              filter: isDimmed ? 'grayscale(0.7)' : 'none',
              transition: 'opacity 0.28s ease, transform 0.28s ease, filter 0.28s ease',
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
                fontFamily: PRODUCT,
                fontSize: { xs: '0.5rem', md: '0.62rem' },
                fontWeight: 600,
                letterSpacing: { xs: '0.08em', md: '0.16em' },
                textTransform: 'uppercase',
                color: isActive ? 'text.primary' : 'rgba(246, 246, 236, 0.72)',
                whiteSpace: 'nowrap',
                transition: 'color 0.28s ease',
              } }
            >
              { BAND_LABEL_EN[bandId] }
            </Typography>
          </Box>
        );
      }) }
    </Box>
  );
}

export { BandLegend };
