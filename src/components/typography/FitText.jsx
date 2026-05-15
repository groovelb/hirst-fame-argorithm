import { useEffect, useRef, useState, useCallback } from 'react';
import { Box } from '@mui/material';

/**
 * FitText 컴포넌트
 *
 * 컨테이너 너비에 꽉 차도록 텍스트 크기가 자동으로 조절되는 반응형 타이포그래피 컴포넌트.
 *
 * children mode:
 *  - children이 제공되면 표시는 children 사용 (예: 단어별 motion.span 패럴럭스)
 *  - text는 여전히 측정용으로 사용 (호출부에서 동일 텍스트 전달 책임)
 *  - children 없으면 기존 동작: text 그대로 표시
 *
 * Props:
 * @param {string} text - 표시·측정용 텍스트 [Required]
 * @param {React.ReactNode} children - 표시용 커스텀 노드 (단어별 패럴럭스 등) [Optional]
 * @param {string} variant - 타이포그래피 변형 ('body' | 'h1' | 'headline') [Optional, 기본값: 'body']
 * @param {number} minFontSize - 최소 폰트 크기 (px) [Optional, 기본값: 0]
 * @param {number} maxFontSize - 최대 폰트 크기 (px) [Optional, 기본값: 9999]
 * @param {number} letterSpacing - 자간 배율 [Optional, 기본값: 1]
 * @param {number} wordSpacing - 단어 간격 배율 [Optional, 기본값: 1]
 * @param {number} fontWeight - 폰트 굵기 [Optional]
 * @param {string} fontFamily - 폰트 패밀리 (variant 기본값 오버라이드) [Optional]
 */
export function FitText({
  text,
  children,
  variant = 'body',
  minFontSize = 0,
  maxFontSize = 9999,
  letterSpacing = 1,
  wordSpacing = 1,
  fontWeight,
  fontFamily: fontFamilyProp,
  ...props
}) {
  const containerRef = useRef(null);
  const measureRef = useRef(null);
  const [fontSize, setFontSize] = useState(minFontSize);

  /**
   * variant에 따른 폰트 스타일 결정
   * - headline/h1: Chillax 폰트, 타이트한 행간(0.9), 기본 굵기 400
   * - body: Inter 폰트, 여유로운 행간(1.3), 기본 굵기 300
   */
  const isHeadline = variant === 'h1' || variant === 'headline';
  const fontFamily = fontFamilyProp || (isHeadline ? '"Chillax", sans-serif' : '"Inter", sans-serif');
  const lineHeight = isHeadline ? 0.9 : 1.3;
  const defaultFontWeight = isHeadline ? 400 : 300;
  const finalFontWeight = fontWeight !== undefined ? fontWeight : defaultFontWeight;

  /**
   * 자간/단어 간격 계산
   * - 기본값(1)일 때: 자간 0.02em, 단어 간격 0.2em
   * - 값을 2로 설정하면 간격이 2배로 넓어짐
   */
  const baseLetterSpacing = 0.02;
  const baseWordSpacing = 0.2;
  const finalLetterSpacing = `${ baseLetterSpacing * letterSpacing }em`;
  const finalWordSpacing = `${ baseWordSpacing * wordSpacing }em`;

  /**
   * 폰트 크기 계산 함수
   * - 숨겨진 측정 요소(100px 기준)와 컨테이너 너비를 비교하여 비율 계산
   * - 계산된 크기가 min/max 범위를 벗어나면 범위 내로 제한
   */
  const updateFontSize = useCallback(() => {
    if (!containerRef.current || !measureRef.current) return;

    const containerWidth = containerRef.current.offsetWidth;
    const measureWidth = measureRef.current.offsetWidth;

    if (measureWidth === 0) return;

    // 0.98 버퍼: 렌더링 차이로 인한 미세한 오버플로우 방지
    const ratio = (containerWidth * 0.98) / measureWidth;
    const calculatedFontSize = 100 * ratio;
    const finalSize = Math.min(Math.max(calculatedFontSize, minFontSize), maxFontSize);

    setFontSize(finalSize);
  }, [minFontSize, maxFontSize]);

  /**
   * 크기 변화 감지 및 자동 업데이트
   * - ResizeObserver로 컨테이너 크기 변화 감지
   * - text, letterSpacing, wordSpacing 변경 시에도 재계산
   */
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new ResizeObserver(() => {
      updateFontSize();
    });

    observer.observe(container);
    updateFontSize();

    return () => observer.disconnect();
  }, [text, letterSpacing, wordSpacing, updateFontSize]);

  return (
    <Box
      ref={ containerRef }
      className="text-fit"
      sx={ {
        display: 'flex',
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        ...props.sx
      } }
      { ...props }
    >
      {/* 실제 표시되는 텍스트 (children이 있으면 그것을 렌더, 없으면 text) */}
      <Box
        component="span"
        sx={ {
          display: 'block',
          fontFamily,
          lineHeight,
          fontWeight: finalFontWeight,
          fontSize: `${ fontSize }px`,
          letterSpacing: finalLetterSpacing,
          wordSpacing: finalWordSpacing,
          whiteSpace: 'nowrap',
          textAlign: 'center',
          transition: 'font-size 0.1s ease-out',
        } }
      >
        { children ?? text }
      </Box>

      {/* 숨겨진 측정용 요소 - 100px 기준으로 텍스트 너비 측정 */}
      <Box
        ref={ measureRef }
        component="span"
        aria-hidden="true"
        sx={ {
          position: 'absolute',
          left: '-9999px',
          top: 0,
          visibility: 'hidden',
          whiteSpace: 'nowrap',
          fontFamily,
          fontWeight: finalFontWeight,
          fontSize: '100px',
          letterSpacing: finalLetterSpacing,
          wordSpacing: finalWordSpacing,
          pointerEvents: 'none',
        } }
      >
        { text }
      </Box>
    </Box>
  );
}
