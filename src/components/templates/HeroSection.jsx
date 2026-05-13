import React, { useRef } from 'react';
import Box from '@mui/material/Box';
import { useScroll } from 'framer-motion';
import { HeroTypeBlock } from '../typography/HeroTypeBlock.jsx';
import SharkVitrine from '../shark-modeling/SharkVitrine.jsx';

/**
 * HeroSection — Landing의 첫 화면. 거대 타이포 sandwich + 중앙 상어 비트린.
 *
 * 구조:
 * - 외부 section: height 200vh (스크롤 트랜지션 공간)
 * - 내부 sticky: top 0, height 100dvh
 * - sticky 안 3-slot absolute (top 타이포 / 중앙 비트린 / bottom 타이포)
 *
 * Scroll 트랜지션 (opacity fade 없음, 자연 스크롤):
 * - 처음: 카메라 +X축 측면([10,0,0]), 빈 vitrine, 상어 측면(rotation.y=π/2)
 * - 진행 시 vitrine shell+glass scaleY 0→1 (bottom-pivot, 0.2~0.7)
 * - 진행 시 액체(formaldehyde) scaleY 0→1 (0.5~1.0)
 * - 진행 시 상어 회전 π/2 → 0 (정면, 0.5~1.0)
 * - Hero 끝나면 sticky 해제 → Timeline이 자연스럽게 등장 (fade 없이)
 *
 * Props:
 * @param {function} onHeroProgress - hero scroll progress(0~1) motion value 노출 콜백 [Optional]
 *
 * Example usage:
 * <HeroSection onHeroProgress={ setHeroProgress } />
 */
function HeroSection({ onHeroProgress }) {
  const sectionRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  });

  /** 부모(LandingPage)에 progress motion value 노출 — page bg 보간용 */
  React.useEffect(() => {
    onHeroProgress?.(scrollYProgress);
  }, [onHeroProgress, scrollYProgress]);

  return (
    <Box
      ref={ sectionRef }
      component="section"
      sx={ {
        position: 'relative',
        height: '200vh',
      } }
    >
      {/* sticky inner — 화면 고정 100dvh */}
      <Box
        sx={ {
          position: 'sticky',
          top: 0,
          left: 0,
          width: '100%',
          height: '100dvh',
          overflow: 'hidden',
        } }
      >
        {/* 상단 타이포 — DAMIEN. mix-blend-mode: difference로 흰/검정 bg 양쪽에서 가독성 확보 */}
        <Box
          sx={ {
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '24dvh',
            mixBlendMode: 'difference',
          } }
        >
          <HeroTypeBlock text="DAMIEN" align="flex-start" color="#FFFFFF" />
        </Box>

        {/* 중앙 상어 비트린 — 카메라 측면 [10,0,0], 배경 투명, scroll progress 주입.
            영역 52dvh로 확대 → vitrine 시각 크기 ↑ */}
        <Box
          sx={ {
            position: 'absolute',
            top: '24dvh',
            left: 0,
            right: 0,
            height: '52dvh',
          } }
        >
          <SharkVitrine
            background="transparent"
            height="100%"
            hasControls={ false }
            isAutoRotate={ false }
            isFloating={ false }
            cameraPosition={ [0, 0, 9] }
            cameraFov={ 40 }
            progress={ scrollYProgress }
          />
        </Box>

        {/* 하단 타이포 — HIRST */}
        <Box
          sx={ {
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '24dvh',
            mixBlendMode: 'difference',
          } }
        >
          <HeroTypeBlock text="HIRST" align="flex-end" color="#FFFFFF" />
        </Box>
      </Box>
    </Box>
  );
}

export { HeroSection };
