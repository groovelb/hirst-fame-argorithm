import React, { useState } from 'react';
import Box from '@mui/material/Box';
import { useMotionValue, useMotionValueEvent } from 'framer-motion';
import { LanguageToggle } from '../navigation/LanguageToggle.jsx';
import { WorldviewTimeline as HirstTimeline } from '../timeline/index.js';
import { HeroSection } from './HeroSection.jsx';
import { BridgeSection } from './BridgeSection.jsx';
import { BRIDGE_SECTIONS } from './bridgeNarrative.js';

/**
 * LandingPage — 라우트 `/`의 최상위 페이지 템플릿.
 *
 * 구조:
 * - 외부 div: 페이지 root. 검정 톤 고정.
 * - LanguageToggle (position fixed): timeline modal 열림 시 숨김.
 * - HeroBridgeScene: 콘텐츠 기반 자연 스크롤. 영상 스크럽 + 6 브릿지 섹션(스토리텔링).
 * - HirstTimeline: 가로 스크롤 타임라인.
 *
 * Scroll 트랜지션:
 * - HeroBridgeScene이 wrapper scrollYProgress(0~1)을 onProgress 콜백으로 노출
 * - LandingPage가 그 motion value를 받아 isHeroFinished(>=0.995) 트리거로
 *   timeline minimap·legend 표시 시점 결정.
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
  /** HeroBridgeScene scrollYProgress motion value. fallback은 0 (브릿지 진입 전). */
  const fallbackProgress = useMotionValue(0);
  const [heroProgress, setHeroProgress] = useState(fallbackProgress);

  /** Page background — BRIDGE 검정 톤과 일관. 보간 제거(검정 단일). */
  const pageBg = '#0A0A0A';

  /** Hero 영역에선 Minimap 숨김. progress >= 0.995에서 Timeline 진입으로 보이게.
      boolean state로 mount/unmount 처리 → 매 frame re-render 회피. */
  const [isHeroFinished, setIsHeroFinished] = useState(false);
  useMotionValueEvent(heroProgress, 'change', (v) => {
    setIsHeroFinished((prev) => {
      const next = v >= 0.995;
      return prev === next ? prev : next;
    });
  });

  /** Timeline 안의 작품/peak modal 열림 신호 — LanguageToggle 같이 숨김. */
  const [isTimelineModalOpen, setIsTimelineModalOpen] = useState(false);

  return (
    <div
      style={{
        position: 'relative',
        minHeight: '100dvh',
        background: pageBg,
      }}
    >
      {!isTimelineModalOpen && <LanguageToggle />}

      <HeroSection onHeroProgress={setHeroProgress} />

      {/* HeroSection의 비디오 스크러빙 영역에서 분리된 BridgeSection들 — 영상 무관 자연 스크롤.
          4개 category (DEATH / PRICE / GRID / BURN) → 2×2 grid (타이틀 이미지 크게)
          INDEX (pivot) → 그리드 아래 별도 섹션 (타임라인 전환 anchor)
          페이지 검정 배경 위에 흰색 텍스트로 렌더. */}
      <Box
        component="section"
        sx={{
          position: 'relative',
          py: { xs: '20vh', md: '28vh' },
          px: { xs: '4vw', md: '6vw', lg: '8vw' },
        }}
      >
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' },
            columnGap: { xs: '4vw', md: '6vw' },
            rowGap: { xs: '12vh', md: '18vh' },
          }}
        >
          {BRIDGE_SECTIONS.slice(1, 5).map((section) => (
            <BridgeSection
              key={section.id}
              section={section}
              color="#FFFFFF"
              layout="grid"
            />
          ))}
        </Box>

        {/* INDEX pivot — 그리드 아래 풀폭 */}
        <Box sx={{ mt: { xs: '20vh', md: '28vh' } }}>
          <BridgeSection
            section={BRIDGE_SECTIONS[5]}
            color="#FFFFFF"
          />
        </Box>
      </Box>

      <div>
        <HirstTimeline
          worksData={worksData}
          eventsData={eventsData}
          bioData={bioData}
          trendData={trendData}
          hideMinimap={!isHeroFinished}
          onModalStateChange={setIsTimelineModalOpen}
        />
      </div>
    </div>
  );
}

export { LandingPage };
