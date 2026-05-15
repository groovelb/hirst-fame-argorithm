import React, { Fragment } from 'react';
import Box from '@mui/material/Box';
import { motion, useTransform } from 'framer-motion';
import { FitText } from './FitText.jsx';
import { BRAND_DISPLAY } from '../timeline/typography.js';

/**
 * ParallaxWord — 단일 단어에 scroll progress 기반 translateY 적용.
 *
 * progress(0→1)가 변화하는 동안 단어가 0 → -depth(vh) 만큼 위로 이동한다.
 * transform CSS string으로 직접 합성하여 vh 단위 보장 (style.y의 px 기본 해석 회피).
 * inline-block + transform이라 layout/측정에 영향 없음 → FitText 측정값 보존.
 */
function ParallaxWord({ progress, depth, children }) {
  const transform = useTransform(
    progress,
    [0, 1],
    [`translate3d(0, 0vh, 0)`, `translate3d(0, -${ depth }vh, 0)`]
  );
  return (
    <motion.span
      style={ {
        transform,
        display: 'inline-block',
        verticalAlign: 'baseline',
        willChange: 'transform',
      } }
    >
      { children }
    </motion.span>
  );
}

/**
 * 단어 N개에 자동으로 다른 depth(vh) 분배.
 * 인접 단어 간 격차를 작게 유지(과하게 튀지 않도록).
 */
function autoDepths(count) {
  const pattern = [10, 14, 12, 16, 13, 17, 11, 15];
  return Array.from({ length: count }, (_, i) => pattern[i % pattern.length]);
}

/**
 * HeroTypeBlock — Landing Hero의 거대 단어 한 줄.
 *
 * FitText를 헤드라인 변형으로 사용하여 컨테이너 폭을 가득 채운다.
 * scrollProgress가 주어지면 각 단어가 서로 다른 depth로 패럴럭스 이동.
 *
 * Props:
 * @param {string} text - 표시할 단어 (대문자 권장) [Required]
 * @param {string} align - 수직 정렬 ('flex-start' | 'center' | 'flex-end') [Optional, 기본값: 'center']
 * @param {number} padding - 좌·우 패딩 (vw 단위 number) [Optional, 기본값: 4]
 * @param {string} color - 텍스트 색 [Optional, 기본값: 'text.primary']
 * @param {Object} scrollProgress - 단어별 패럴럭스를 구동할 MotionValue(0~1) [Optional]
 * @param {number} speed - 전체 패럴럭스 진폭 배율 (1=기본, 0.5=절반 속도, 2=2배) [Optional, 기본값: 1]
 */
function HeroTypeBlock({
  text,
  align = 'center',
  padding = 4,
  color = 'text.primary',
  scrollProgress,
  speed = 1,
}) {
  const words = text.split(' ');
  const depths = autoDepths(words.length).map((d) => d * speed);
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
      >
        { scrollProgress
          ? words.map((word, i) => (
              <Fragment key={ `${ word }-${ i }` }>
                <ParallaxWord progress={ scrollProgress } depth={ depths[i] }>
                  { word }
                </ParallaxWord>
                { i < words.length - 1 ? ' ' : null }
              </Fragment>
            ))
          : null }
      </FitText>
    </Box>
  );
}

export { HeroTypeBlock };
