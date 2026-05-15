import React, { Fragment } from 'react';
import Box from '@mui/material/Box';

import { useLocale } from '../../i18n';
import { TOKENS } from '../../styles/themes/tokens.js';

const LOCALES = ['en', 'ko'];

/**
 * LanguageToggle — 사이트 GNB(글로벌 네비게이션)의 로케일 선택기.
 *
 * Ghost 버튼 스타일:
 *  - 배경/테두리 없음, 텍스트만
 *  - 활성 locale: 흰색 + 정상 opacity
 *  - 비활성 locale: 흰색 + 낮은 opacity
 *  - hover 시 비활성 → 흰색 풀 opacity로 전환
 *
 * 우측 상단 fixed.
 */
function LanguageToggle() {
  const { locale, setLocale } = useLocale();

  return (
    <Box
      component="nav"
      aria-label="Language"
      sx={ {
        position: 'fixed',
        top: { xs: 16, md: 24 },
        right: { xs: 16, md: 28 },
        zIndex: 1200,
        display: 'flex',
        alignItems: 'center',
        gap: 1.25,
        pointerEvents: 'auto',
        /**
         * Hero 영역(흰 배경) ↔ PROLOGUE 이후(검정 배경) 양쪽에 fixed로 머무르므로
         * mix-blend-mode로 텍스트 색을 배경에 따라 자동 반전. 텍스트 베이스는 흰.
         */
        mixBlendMode: 'difference',
      } }
    >
      { LOCALES.map((lc, i) => (
        <Fragment key={ lc }>
          <Box
            component="button"
            type="button"
            onClick={ () => setLocale(lc) }
            aria-current={ locale === lc ? 'true' : undefined }
            sx={ {
              all: 'unset',
              cursor: 'pointer',
              fontSize: { xs: '0.72rem', md: '0.78rem' },
              fontWeight: 500,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: locale === lc
                ? TOKENS.text.onDark
                : TOKENS.alpha.onDark(0.4),
              transition: 'color 160ms ease',
              '&:hover': { color: TOKENS.text.onDark },
              '&:focus-visible': {
                outline: `1px solid ${ TOKENS.alpha.onDark(0.6) }`,
                outlineOffset: 4,
              },
            } }
          >
            { lc }
          </Box>
          { i < LOCALES.length - 1 && (
            <Box
              aria-hidden="true"
              sx={ {
                color: TOKENS.alpha.onDark(0.25),
                fontSize: { xs: '0.7rem', md: '0.76rem' },
                lineHeight: 1,
                userSelect: 'none',
              } }
            >
              /
            </Box>
          ) }
        </Fragment>
      )) }
    </Box>
  );
}

export { LanguageToggle };
