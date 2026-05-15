import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { BRAND_DISPLAY, PRODUCT } from '../timeline/typography.js';
import { useLocale } from '../../i18n';
import { TOKENS } from '../../styles/themes/tokens.js';

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
 * @param {string} color - 텍스트 색상 [Optional, 기본값: TOKENS.text.onLight]
 * @param {string} layout - 'hero' | 'grid' [Optional, 기본값: 'hero']
 */
function BridgeSection({ section, color = TOKENS.text.onLight, layout = 'hero' }) {
  const { variant, bigType, deck, pictogram } = section;
  const { localized } = useLocale();
  /**
   * bigType은 영문 단일 (브랜드 톤). deck은 { ko, en } 객체 또는 문자열 모두 허용.
   * localized()가 문자열 입력은 그대로, 객체는 현재 locale 값을 반환한다.
   */
  const localizedDeck = localized(deck);
  const isCategory = variant === 'category';
  const isPivot = variant === 'pivot';
  const isGrid = layout === 'grid';
  /** color에 따라 divider도 cool tone alpha로 자동 매핑 */
  const dividerColor =
    color === TOKENS.text.onLight ? TOKENS.divider.onLight : TOKENS.divider.onDark;

  return (
    <Box
      component="section"
      sx={{
        position: 'relative',
        zIndex: 1,
        width: '100%',
        display: 'flex',
        justifyContent: isGrid
          ? 'flex-start'
          : { xs: 'center', md: 'flex-end' },
        alignItems: 'center',
      }}
    >
      <Box
        sx={{
          width: isGrid ? '100%' : { xs: '92%', md: '50%' },
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          gap: { xs: 3, md: 4 },
          px: isGrid
            ? { xs: 2, sm: 3, md: 4 }
            : { xs: 3, sm: 5, md: 7, lg: 10 },
          py: { xs: 4, md: 6 },
        }}
      >
        {isCategory && pictogram && (
          <Box
            aria-hidden="true"
            sx={{
              width: '100%',
              height: isGrid
                ? { xs: 140, sm: 180, md: 300, lg: 360 }
                : { xs: 48, sm: 56, md: 64, lg: 72 },
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-start',
              flexShrink: 0,
            }}
          >
            {/* pictogram 경로가 .mp4면 loop video, 아니면 img.
                video UI 숨김 + 다크 사이트 통합 3단계:
                 1) wrapper에 동일 사이트 배경(#0A0A0A) — stacking context backdrop 강제
                 2) mixBlendMode: lighten — 영상 #090909 검정 픽셀을 #0A0A0A 사이트로 흡수
                 3) maskImage radial fade — 영상 가장자리 압축 노이즈를 사이트로 부드럽게 페이드 */}
            {/\.mp4($|\?)/i.test(pictogram) ? (
              <Box
                sx={{
                  position: 'relative',
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'flex-start',
                  backgroundColor: TOKENS.bg.dark,
                }}
              >
                <Box
                  component="video"
                  src={pictogram}
                  autoPlay
                  loop
                  muted
                  playsInline
                  disablePictureInPicture
                  controlsList="nodownload noplaybackrate nofullscreen"
                  sx={{
                    maxWidth: '100%',
                    maxHeight: '100%',
                    width: 'auto',
                    height: 'auto',
                    objectFit: 'contain',
                    display: 'block',
                    pointerEvents: 'none',
                    mixBlendMode: 'lighten',
                    WebkitMaskImage:
                      'radial-gradient(closest-side, #000 78%, transparent 100%)',
                    maskImage:
                      'radial-gradient(closest-side, #000 78%, transparent 100%)',
                  }}
                />
              </Box>
            ) : (
              <Box
                component="img"
                src={pictogram}
                alt=""
                sx={{
                  maxWidth: '100%',
                  maxHeight: '100%',
                  width: 'auto',
                  height: 'auto',
                  objectFit: 'contain',
                  display: 'block',
                }}
              />
            )}
          </Box>
        )}

        <Typography
          component="h2"
          sx={{
            fontFamily: BRAND_DISPLAY,
            fontWeight: 900,
            fontSize: isCategory
              ? { xs: '3.2rem', sm: '5.5rem', md: '7rem', lg: '9rem' }
              : { xs: '2.4rem', sm: '3.4rem', md: '4.2rem', lg: '5rem' },
            lineHeight: 0.98,
            letterSpacing: isCategory ? '0.02em' : '0.01em',
            color,
            whiteSpace: 'pre-line',
            margin: 0,
          }}
        >
          {bigType}
        </Typography>

        {isPivot && (
          <Box
            aria-hidden="true"
            sx={{
              width: { xs: 56, md: 88 },
              height: '1px',
              backgroundColor: dividerColor,
            }}
          />
        )}

        <Typography
          sx={{
            fontFamily: PRODUCT,
            fontSize: { xs: '0.92rem', md: '1rem' },
            lineHeight: 1.75,
            color,
            maxWidth: { xs: '100%', md: 460 },
          }}
        >
          {localizedDeck}
        </Typography>
      </Box>
    </Box>
  );
}

export { BridgeSection };
