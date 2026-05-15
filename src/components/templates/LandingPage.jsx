import React, { useEffect, useRef, useState } from 'react';
import Box from '@mui/material/Box';
import {
  motion,
  useMotionValue,
  useScroll,
  useTransform,
} from 'framer-motion';
import { LanguageToggle } from '../navigation/LanguageToggle.jsx';
import { WorldviewTimeline as HirstTimeline } from '../timeline/index.js';
import { HeroSection } from './HeroSection.jsx';
import { BridgeSection } from './BridgeSection.jsx';
import { BRIDGE_SECTIONS } from './bridgeNarrative.js';
import { TOKENS } from '../../styles/themes/tokens.js';

/**
 * ParallaxGridItem — 4 BridgeSection 그리드 카드에 정적 y-offset(레이아웃) + 스크롤 패럴럭스 동시 적용.
 *
 * - offsetY (vh): 카드의 시작 위치 (experimental 배치, 균등 정렬 깨기)
 * - depth (vh): 그리드가 viewport를 통과하는 동안 추가로 위로 이동하는 거리
 * - progress: gridRef 기반 [start end, end start] 스크롤 진행도(0~1)
 *
 * y = offsetY → offsetY - depth (progress 0→1 동안)
 * 즉 각 카드가 자기 시작점에서 자기 depth만큼 후행(위로) 이동.
 */
function ParallaxGridItem({ progress, offsetY, depth, children }) {
  const y = useTransform(
    progress,
    [0, 1],
    [`${offsetY}vh`, `${offsetY - depth}vh`]
  );
  /**
   * 분리 BridgeSection 영역은 PROLOGUE 이후 검정 배경. ParallaxGridItem이 transform으로
   * own stacking context 생성하므로 motion.div backdrop을 TOKENS.bg.dark로 명시.
   */
  return (
    <motion.div
      style={{
        y,
        willChange: 'transform',
        backgroundColor: TOKENS.bg.dark,
      }}
    >
      {children}
    </motion.div>
  );
}

/** 4 카드별 정적 y-offset (vh) — 균등 정렬을 살짝만 깨는 잔잔한 비대칭 */
const GRID_OFFSETS = [0, 5, -3, 7];

/** 4 카드별 패럴럭스 추가 이동 거리 (vh) — 카드 간 속도 편차 크게 */
const GRID_DEPTHS = [10, 50, 22, 65];

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

  /**
   * Page background — heroProgress 1 (PROLOGUE가 viewport 정확히 채운 순간) 직전까지는
   * 영상 흰 배경과 매칭되는 흰색(TOKENS.bg.page = #FFFFFF), 그 이후엔 다크 토큰으로 전환.
   * 분리 BridgeSection·HirstTimeline 영역에서 검정 배경 + 흰 텍스트 디자인을 위함.
   */
  const pageBg = useTransform(
    heroProgress,
    [0.95, 1],
    [TOKENS.bg.page, TOKENS.text.onLight]
  );

  /** Timeline 안의 작품/peak modal 열림 신호 — LanguageToggle 같이 숨김. */
  const [isTimelineModalOpen, setIsTimelineModalOpen] = useState(false);

  /** 4개 BridgeSection 그리드의 viewport 진행도 — 카드 패럴럭스 구동에 사용 */
  const gridRef = useRef(null);
  const { scrollYProgress: gridProgress } = useScroll({
    target: gridRef,
    offset: ['start end', 'end start'],
  });

  /** HirstTimeline의 viewport 가시성 — minimap은 timeline이 보일 때만 노출. */
  const timelineRef = useRef(null);
  const [isTimelineVisible, setIsTimelineVisible] = useState(false);
  useEffect(() => {
    const el = timelineRef.current;
    if (!el) return undefined;
    const observer = new IntersectionObserver(
      ([entry]) => setIsTimelineVisible(entry.isIntersecting),
      { threshold: 0.05 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <motion.div
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
          ref={gridRef}
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' },
            columnGap: { xs: '4vw', md: '6vw' },
            rowGap: { xs: '12vh', md: '18vh' },
          }}
        >
          {BRIDGE_SECTIONS.slice(1, 5).map((section, i) => (
            <ParallaxGridItem
              key={section.id}
              progress={gridProgress}
              offsetY={GRID_OFFSETS[i]}
              depth={GRID_DEPTHS[i]}
            >
              <BridgeSection
                section={section}
                color={TOKENS.text.onDark}
                layout="grid"
              />
            </ParallaxGridItem>
          ))}
        </Box>

        {/* INDEX pivot — 그리드 아래 풀폭 */}
        <Box sx={{ mt: { xs: '20vh', md: '28vh' } }}>
          <BridgeSection
            section={BRIDGE_SECTIONS[5]}
            color={TOKENS.text.onDark}
          />
        </Box>
      </Box>

      <div ref={timelineRef}>
        <HirstTimeline
          worksData={worksData}
          eventsData={eventsData}
          bioData={bioData}
          trendData={trendData}
          backgroundColor={TOKENS.bg.dark}
          hideMinimap={!isTimelineVisible}
          onModalStateChange={setIsTimelineModalOpen}
        />
      </div>
    </motion.div>
  );
}

export { LandingPage };
