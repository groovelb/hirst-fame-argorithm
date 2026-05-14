import React, { useRef, useState } from 'react';
import { motion, useMotionValue, useMotionValueEvent, useScroll, useTransform } from 'framer-motion';
import { LanguageToggle } from '../navigation/LanguageToggle.jsx';
import { WorldviewTimeline as HirstTimeline } from '../timeline/index.js';
import { HeroSection } from './HeroSection.jsx';

/**
 * LandingPage — 라우트 `/`의 최상위 페이지 템플릿.
 *
 * 구조:
 * - 외부 motion.div: 페이지 root. background 색을 heroProgress에 따라 흰→검정 보간
 * - LanguageToggle (position fixed): 모든 phase에서 보임
 * - HeroSection: 200vh, 자체 scroll progress 노출
 * - HirstTimeline: 기존 RothkoTimeline. 자체 horizontal scroll
 *
 * Scroll 트랜지션:
 * - HeroSection이 heroProgress (0~1) motion value를 onHeroProgress 콜백으로 노출
 * - LandingPage가 그 motion value를 받아 useTransform으로 page background 색 계산
 * - 보간 keyframe: [0, 0.35, 0.85, 1] → [#FFFFFF, #FFFFFF, #0A0A0A, #0A0A0A]
 *   (0~0.35: 흰색 유지, 0.35~0.85: 흰→검정 보간, 0.85~1: 검정 유지)
 *
 * Props:
 * @param {Object} worksData - works JSON [Required]
 * @param {Object} eventsData - events JSON [Required]
 * @param {Object} bioData - bio-specimen JSON [Optional]
 * @param {Object} trendData - trend JSON [Optional]
 *
 * Example usage:
 * <LandingPage worksData={ works } eventsData={ events } bioData={ bio } trendData={ trend } />
 */
function LandingPage({ worksData, eventsData, bioData, trendData }) {
  /** Hero 영역이 노출한 scroll progress motion value를 저장.
      초기엔 fallback motion value(=0)로 background 색은 흰색에서 시작. */
  const fallbackProgress = useMotionValue(0);
  const [heroProgress, setHeroProgress] = useState(fallbackProgress);

  /** Page background — Hero 내내 흰색 유지, 수조 완성(0.9) 후 0.9~1.0 구간에서만 흰→검정 fade. */
  const pageBg = useTransform(
    heroProgress,
    [0, 0.9, 1],
    ['#FFFFFF', '#FFFFFF', '#0A0A0A'],
  );

  /** Timeline 영역 fade-in — Timeline section의 자체 진입 progress 기반.
      offset ['start end', 'start start']: timeline top이 viewport bottom→top 이동 구간.
      큰 motion.div opacity 보간은 GPU 레이어를 들고 있는 동안 비용이 큼.
      → 입력 [0.8, 1.0] 구간만 사용해 페이드 시간(=레이어 promotion 구간)을 viewport의 20%로 단축. */
  const timelineRef = useRef(null);
  const { scrollYProgress: timelineEnter } = useScroll({
    target: timelineRef,
    offset: ['start end', 'start start'],
  });
  const timelineFadeOpacity = useTransform(timelineEnter, [0.8, 1], [0, 1]);


  /** Hero 영역에선 Minimap 숨김. progress >= 0.95에서 Timeline 진입으로 보이게.
      boolean state로 mount/unmount 처리 → 매 frame re-render 회피. */
  const [isHeroFinished, setIsHeroFinished] = useState(false);
  useMotionValueEvent(heroProgress, 'change', (v) => {
    setIsHeroFinished((prev) => {
      const next = v >= 0.95;
      return prev === next ? prev : next;
    });
  });

  return (
    <motion.div
      style={ {
        position: 'relative',
        minHeight: '100dvh',
        background: pageBg,
      } }
    >
      <LanguageToggle />

      <HeroSection onHeroProgress={ setHeroProgress } isPaused={ isHeroFinished } />

      <motion.div ref={ timelineRef } style={ { opacity: timelineFadeOpacity } }>
        <HirstTimeline
          worksData={ worksData }
          eventsData={ eventsData }
          bioData={ bioData }
          trendData={ trendData }
          hideMinimap={ !isHeroFinished }
        />
      </motion.div>
    </motion.div>
  );
}

export { LandingPage };
