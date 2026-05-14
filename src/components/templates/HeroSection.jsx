import React, { useRef } from 'react';
import Box from '@mui/material/Box';
import { motion, useScroll, useTransform } from 'framer-motion';
import { HeroTypeBlock } from '../typography/HeroTypeBlock.jsx';
import SharkVitrine from '../shark-modeling/SharkVitrine.jsx';

/**
 * HeroSection — Landing의 첫 화면. 거대 타이포 sandwich + 중앙 상어 비트린.
 *
 * 외부 section: 200vh (scroll 트랜지션 공간).
 * sticky inner: 100dvh, **사방 동일 padding 6vw** (좌우 = 상하).
 * inner area 내부 3-slot: top 18% / middle 64% / bottom 18% (inner area 기준 %).
 *
 * Scroll phase (opacity fade 없음, 자연 스크롤):
 * - 0.0~0.5: vitrine invisible, 회전만 (상어만 보임)
 * - 0.5~0.9: 수조 + 물 동시 채워짐
 * - 0.9~1.0: page bg 흰→검정 (Timeline 진입)
 *
 * Props:
 * @param {function} onHeroProgress - hero scroll progress(0~1) motion value 노출 콜백 [Optional]
 * @param {boolean} isPaused - Hero가 화면 밖으로 빠진 뒤 R3F Canvas 렌더 루프를 멈추는 플래그 [Optional, 기본값: false]
 *
 * Example usage:
 * <HeroSection onHeroProgress={ setHeroProgress } isPaused={ isHeroFinished } />
 */
function HeroSection({ onHeroProgress, isPaused = false }) {
  const sectionRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  });

  React.useEffect(() => {
    onHeroProgress?.(scrollYProgress);
  }, [onHeroProgress, scrollYProgress]);

  /** 확대 phase(0.4~0.65) 동안 텍스트가 페이지와 함께 자연 스크롤되어 viewport 밖으로 사라짐.
      top: 위로 (-50vh), bottom: 아래로 (+50vh). vitrine은 고정 (zoom-in만). */
  const topTextY = useTransform(scrollYProgress, [0.4, 0.65], ['0vh', '-50vh']);
  const bottomTextY = useTransform(scrollYProgress, [0.4, 0.65], ['0vh', '50vh']);

  return (
    <Box
      ref={ sectionRef }
      component="section"
      sx={ {
        position: 'relative',
        height: '200vh',
      } }
    >
      {/* sticky inner — 사방 동일 padding 6vw */}
      <Box
        sx={ {
          position: 'sticky',
          top: 0,
          left: 0,
          width: '100%',
          height: '100dvh',
          padding: '3vw',
          boxSizing: 'border-box',
          overflow: 'hidden',
        } }
      >
        {/* 상어 비트린 — sticky inner 전체(100vw × 100dvh)를 덮어 clipping 방지.
            padding을 무시하고 viewport 전체로 확장. cameraPosition.z 보정으로
            기존 64% 슬롯에서 보이던 시각 크기를 유지 (canvas 1.75x ↑ → z 1.75x ↑). */}
        <Box
          sx={ {
            position: 'absolute',
            inset: 0,
            zIndex: 0,
          } }
        >
          <SharkVitrine
            background="transparent"
            height="100%"
            hasControls={ false }
            isAutoRotate={ false }
            isFloating={ false }
            sharkScale={ 0.5 }
            cameraPosition={ [0, 0, 19] }
            cameraFov={ 36 }
            progress={ scrollYProgress }
            frameloop={ isPaused ? 'never' : 'always' }
          />
        </Box>

        {/* inner area — padding 안쪽. 텍스트 슬롯의 % 기준이 됨. 비트린 위에 올림 */}
        <Box sx={ { position: 'relative', width: '100%', height: '100%', zIndex: 1, pointerEvents: 'none' } }>
          {/* 상단 타이포 — DAMIEN HIRST. 확대 phase 동안 위로 자연 스크롤 */}
          <Box
            component={ motion.div }
            style={ { y: topTextY } }
            sx={ {
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '18%',
            } }
          >
            <HeroTypeBlock text="DAMIEN HIRST" align="flex-start" color="#000000" padding={ 0 } />
          </Box>

          {/* 하단 타이포 — 활동연도 + FAME ALGORITHM. 확대 phase 동안 아래로 자연 스크롤 */}
          <Box
            component={ motion.div }
            style={ { y: bottomTextY } }
            sx={ {
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: '18%',
            } }
          >
            <HeroTypeBlock text="1988 — PRESENT : FAME ALGORITHM" align="flex-end" color="#000000" padding={ 0 } />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export { HeroSection };
