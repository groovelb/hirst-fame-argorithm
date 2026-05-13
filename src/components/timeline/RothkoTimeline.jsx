import React, { useState, useCallback, useEffect } from 'react';
import { useMotionValue, useTransform } from 'framer-motion';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { HorizontalScrollContainer } from '../content-transition/HorizontalScrollContainer.jsx';
import { TimelineCanvas } from './TimelineCanvas.jsx';
import { TimelineMinimap } from './TimelineMinimap.jsx';
import { useTimelineLayout } from './useTimelineLayout.js';

/**
 * RothkoTimeline — 마크 로스코 인터랙티브 타임라인
 *
 * X축(시간, 1903-1970)을 화면 중앙에 배치하고,
 * 축 상단에 작품 이미지를 Y축 감정 밴드별로 배치.
 * HorizontalScrollContainer를 사용해 세로 스크롤→가로 이동 변환.
 *
 * Props:
 * @param {Object} worksData - works JSON 데이터 [Required]
 * @param {Object} eventsData - events JSON 데이터 (시기 밴드 등) [Required]
 * @param {Object} bioData - hirst-bio-specimen-data.js 의 default export (artworks/speciesSummary/sources/caveats) [Optional]
 * @param {Object} trendData - hirst-trend-data.json 전체 객체 (trendData/peaks 포함) [Optional]
 * @param {number} pxPerYear - 연도당 픽셀 수 [Optional, 기본값: 250]
 * @param {string} backgroundColor - 배경색 [Optional, 기본값: theme.palette.background.default]
 *
 * Example usage:
 * <RothkoTimeline worksData={ works } eventsData={ events } bioData={ bioData } trendData={ trend } />
 */
function RothkoTimeline({
  worksData,
  eventsData,
  bioData,
  trendData,
  pxPerYear = 250,
  backgroundColor,
}) {
  const [viewportWidth, setViewportWidth] = useState(
    typeof window !== 'undefined' ? window.innerWidth : 1920
  );
  const [viewportHeight, setViewportHeight] = useState(
    typeof window !== 'undefined' ? window.innerHeight : 800
  );
  const [activeId, setActiveId] = useState(null);

  /** 반응형 값 계산 */
  const theme = useTheme();
  const isBelowSm = useMediaQuery(theme.breakpoints.down('sm'));
  const isBelowMd = useMediaQuery(theme.breakpoints.down('md'));
  const isBelowLg = useMediaQuery(theme.breakpoints.down('lg'));

  const responsivePxPerYear = isBelowSm ? 120 : isBelowMd ? 160 : isBelowLg ? 200 : pxPerYear;
  /** 하단 패널 비활성 상태에서는 축을 화면 하단으로 내려 상단 타임라인을 풀스크린화 */
  const axisRatio = isBelowSm ? 0.9 : 0.85;
  const nodeScale = isBelowSm ? 0.53 : isBelowMd ? 0.67 : isBelowLg ? 0.83 : 1.0;

  useEffect(() => {
    const handleResize = () => {
      setViewportWidth(window.innerWidth);
      setViewportHeight(window.innerHeight);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const layout = useTimelineLayout({
    worksData,
    eventsData,
    pxPerYear: responsivePxPerYear,
    viewportWidth,
    viewportHeight,
    axisRatio,
  });

  /** 스크롤 진행도 → Y축 라벨 고정용 counter-offset */
  const scrollProgress = useMotionValue(0);
  const scrollDistance = Math.max(0, layout.totalWidth - viewportWidth);
  const scrollOffset = useTransform(
    scrollProgress,
    [0, 1],
    [0, scrollDistance]
  );

  const handleScrollProgress = useCallback((v) => {
    scrollProgress.set(v);
  }, [scrollProgress]);

  const handleItemHover = useCallback((id) => {
    setActiveId(id);
  }, []);

  const handleItemLeave = useCallback(() => {
    setActiveId(null);
  }, []);

  /** 미니맵 클릭 → 해당 위치로 스크롤 */
  const handleMinimapNavigate = useCallback((targetProgress) => {
    const targetY = targetProgress * scrollDistance;
    window.scrollTo({ top: targetY, behavior: 'smooth' });
  }, [scrollDistance]);

  return (
    <>
    <TimelineMinimap
      positionedWorks={ layout.positionedWorks }
      totalWidth={ layout.totalWidth }
      axisY={ layout.axisY }
      viewportWidth={ viewportWidth }
      scrollProgress={ scrollProgress }
      onNavigate={ handleMinimapNavigate }
    />
    <HorizontalScrollContainer
      backgroundColor={ backgroundColor ?? theme.palette.background.default }
      onScrollProgress={ handleScrollProgress }
    >
      <TimelineCanvas
        positionedWorks={ layout.positionedWorks }
        positionedEvents={ layout.positionedEvents }
        emotionBands={ layout.emotionBands }
        periodBands={ layout.periodBands }
        yearTicks={ layout.yearTicks }
        totalWidth={ layout.totalWidth }
        axisY={ layout.axisY }
        viewportHeight={ viewportHeight }
        activeId={ activeId }
        onItemHover={ handleItemHover }
        onItemLeave={ handleItemLeave }
        scrollOffset={ scrollOffset }
        nodeScale={ nodeScale }
        bioData={ bioData }
        trendData={ trendData?.trendData }
        yearToX={ layout.yearToX }
        scrollProgress={ scrollProgress }
        viewportWidth={ viewportWidth }
      />
    </HorizontalScrollContainer>
    </>
  );
}

export { RothkoTimeline };
