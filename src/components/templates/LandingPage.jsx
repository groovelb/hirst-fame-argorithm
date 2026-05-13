import React, { useState } from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import { LanguageToggle } from '../navigation/LanguageToggle.jsx';
import { RothkoTimeline as HirstTimeline } from '../timeline/index.js';
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

  /** Page background color — 흰 → 검정 보간 */
  const pageBg = useTransform(
    heroProgress,
    [0, 0.35, 0.85, 1],
    ['#FFFFFF', '#FFFFFF', '#0A0A0A', '#0A0A0A'],
  );

  return (
    <motion.div
      style={ {
        position: 'relative',
        minHeight: '100dvh',
        background: pageBg,
      } }
    >
      <LanguageToggle />

      <HeroSection onHeroProgress={ setHeroProgress } />

      <HirstTimeline
        worksData={ worksData }
        eventsData={ eventsData }
        bioData={ bioData }
        trendData={ trendData }
      />
    </motion.div>
  );
}

export { LandingPage };
