import React from 'react';
import Box from '@mui/material/Box';
import { FitText } from './FitText.jsx';
import { BRAND_DISPLAY } from '../timeline/typography.js';

/**
 * HeroTypeBlock — Landing Hero의 거대 단어 한 줄.
 *
 * FitText를 헤드라인 변형으로 사용하여 컨테이너 폭을 가득 채운다.
 * Brand 서체(Cinzel) 강제 주입, 무거운 weight(900), 좁은 자간으로 monumental 톤.
 *
 * Props:
 * @param {string} text - 표시할 단어 (대문자 권장) [Required]
 * @param {string} align - 수직 정렬 ('flex-start' | 'center' | 'flex-end') [Optional, 기본값: 'center']
 * @param {number} padding - 좌·우 패딩 (vw 단위 number) [Optional, 기본값: 4]
 * @param {string} color - 텍스트 색 [Optional, 기본값: 'text.primary']
 *
 * Example usage:
 * <HeroTypeBlock text="DAMIEN" align="flex-start" />
 * <HeroTypeBlock text="HIRST" align="flex-end" />
 */
function HeroTypeBlock({
  text,
  align = 'center',
  padding = 4,
  color = 'text.primary',
}) {
  return (
    <Box
      sx={ {
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: align,
        justifyContent: 'center',
        px: `${padding}vw`,
        color,
        pointerEvents: 'none',
        userSelect: 'none',
      } }
    >
      <FitText
        text={ text }
        variant="headline"
        fontFamily={ BRAND_DISPLAY }
        fontWeight={ 900 }
        maxFontSize={ 9999 }
        letterSpacing={ -1.5 }
        wordSpacing={ 1 }
      />
    </Box>
  );
}

export { HeroTypeBlock };
