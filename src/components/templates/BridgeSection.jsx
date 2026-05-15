import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { BRAND_DISPLAY, PRODUCT } from '../timeline/typography.js';

/**
 * BridgeSection — 자연 스크롤로 흐르는 단일 텍스트 섹션.
 *
 * 구조: 고정 height 없이 콘텐츠 박스만 자연 흐름에 배치한다.
 * 섹션 간 호흡은 부모 gap으로 관리하고, 배경색 사용 금지 — 영상/페이지 배경이 그대로 노출.
 *
 * variant:
 *  - 'prologue' | 'pivot': pictogram 없음.
 *  - 'category':           pictogram(작게, 텍스트 위) + big type + deck.
 *
 * layout:
 *  - 'hero': hero overlay 모드 (기존). 우측 정렬, 내부 50% width.
 *  - 'grid': grid cell 모드. 좌측 정렬, 100% width, pictogram 크게.
 *
 * Props:
 * @param {Object} section - {id, variant, bigType, deck, pictogram} [Required]
 * @param {string} color - 텍스트 색상 [Optional, 기본값: '#000000']
 * @param {string} layout - 'hero' | 'grid' [Optional, 기본값: 'hero']
 */
function BridgeSection({ section, color = '#000000', layout = 'hero' }) {
  const { variant, bigType, deck, pictogram } = section;
  const isCategory = variant === 'category';
  const isPivot = variant === 'pivot';
  const isGrid = layout === 'grid';
  const dividerColor =
    color === '#000000' ? 'rgba(0, 0, 0, 0.4)' : 'rgba(255, 255, 255, 0.4)';

  return (
    <Box
      component="section"
      sx={ {
        position: 'relative',
        zIndex: 1,
        width: '100%',
        display: 'flex',
        justifyContent: isGrid
          ? 'flex-start'
          : { xs: 'center', md: 'flex-end' },
        alignItems: 'center',
      } }
    >
      <Box
        sx={ {
          width: isGrid ? '100%' : { xs: '92%', md: '50%' },
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          gap: { xs: 3, md: 4 },
          px: isGrid
            ? { xs: 2, sm: 3, md: 4 }
            : { xs: 3, sm: 5, md: 7, lg: 10 },
          py: { xs: 4, md: 6 },
        } }
      >
        { isCategory && pictogram && (
          <Box
            aria-hidden="true"
            sx={ {
              width: '100%',
              height: isGrid
                ? { xs: 180, sm: 240, md: 300, lg: 360 }
                : { xs: 48, sm: 56, md: 64, lg: 72 },
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-start',
              flexShrink: 0,
            } }
          >
            <Box
              component="img"
              src={ pictogram }
              alt=""
              sx={ {
                maxWidth: '100%',
                maxHeight: '100%',
                width: 'auto',
                height: 'auto',
                objectFit: 'contain',
                display: 'block',
              } }
            />
          </Box>
        ) }

        <Typography
          component="h2"
          sx={ {
            fontFamily: BRAND_DISPLAY,
            fontWeight: 900,
            fontSize: isCategory
              ? { xs: '4rem', sm: '5.5rem', md: '7rem', lg: '9rem' }
              : { xs: '2.6rem', sm: '3.4rem', md: '4.2rem', lg: '5rem' },
            lineHeight: 0.98,
            letterSpacing: isCategory ? '0.02em' : '0.01em',
            color,
            whiteSpace: 'pre-line',
            margin: 0,
          } }
        >
          { bigType }
        </Typography>

        { isPivot && (
          <Box
            aria-hidden="true"
            sx={ {
              width: { xs: 56, md: 88 },
              height: '1px',
              backgroundColor: dividerColor,
            } }
          />
        ) }

        <Typography
          sx={ {
            fontFamily: PRODUCT,
            fontSize: { xs: '0.92rem', md: '1rem' },
            lineHeight: 1.75,
            color,
            maxWidth: 460,
          } }
        >
          { deck }
        </Typography>
      </Box>
    </Box>
  );
}

export { BridgeSection };
