import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useMotionValue, useMotionValueEvent, useTransform } from 'framer-motion';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { HorizontalScrollContainer } from '../content-transition/HorizontalScrollContainer.jsx';
import { BandLegend } from './BandLegend.jsx';
import { TimelineCanvas } from './TimelineCanvas.jsx';
import { TimelineMinimap } from './TimelineMinimap.jsx';
import { useTimelineLayout } from './useTimelineLayout.js';

/**
 * WorldviewTimeline — 세계관 5밴드 기반 신규 타임라인.
 *
 * 기존 RothkoTimeline과 달리:
 * - 작품의 y를 worldview 밴드에 따라 분산하지 않고 모두 화면 수직 중앙으로 통일.
 * - 좌측 밴드 라벨(이미지+텍스트)을 제거하고, 동일한 BAND legend를 하단으로 이동.
 * - 가로 스크롤로 viewport 중앙에 도달한 focus 작품의 band를 하단 legend에서 강조,
 *   나머지 항목은 dim. 등장 fade-in / Voronoi focus 동작은 기존 컴포넌트 재사용.
 *
 * Props:
 * @param {Object} worksData - works JSON [Required]
 * @param {Object} eventsData - events JSON [Required]
 * @param {Object} bioData - bio-specimen JSON [Optional]
 * @param {Object} trendData - trend JSON [Optional]
 * @param {number} pxPerYear - 연도당 픽셀 [Optional, 기본값: 250]
 * @param {string} backgroundColor - 배경색 [Optional]
 * @param {boolean} hideMinimap - 미니맵 숨김 [Optional, 기본값: false]
 *
 * Example usage:
 * <WorldviewTimeline worksData={ works } eventsData={ events } trendData={ trend } />
 */
function WorldviewTimeline({
  worksData,
  eventsData,
  bioData,
  trendData,
  pxPerYear = 250,
  backgroundColor,
  hideMinimap = false,
}) {
  const [viewportWidth, setViewportWidth] = useState(
    typeof window !== 'undefined' ? window.innerWidth : 1920,
  );
  const [viewportHeight, setViewportHeight] = useState(
    typeof window !== 'undefined' ? window.innerHeight : 800,
  );
  const [activeId, setActiveId] = useState(null);
  const [activeBandId, setActiveBandId] = useState(null);

  const theme = useTheme();
  const isBelowSm = useMediaQuery(theme.breakpoints.down('sm'));
  const isBelowMd = useMediaQuery(theme.breakpoints.down('md'));
  const isBelowLg = useMediaQuery(theme.breakpoints.down('lg'));

  const responsivePxPerYear = isBelowSm ? 120 : isBelowMd ? 160 : isBelowLg ? 200 : pxPerYear;
  const nodeScale = isBelowSm ? 0.53 : isBelowMd ? 0.67 : isBelowLg ? 0.83 : 1.0;

  /** 작품 중앙 y는 화면의 45%, 축은 62% — 하단 legend 공간 확보. */
  const axisRatio = 0.62;
  const uniformWorkY = viewportHeight * 0.45;

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

  /** 작품 y 통일 — 밴드별 분산 폐기, 모두 화면 중앙. band 정보는 legend 강조용으로 유지. */
  const flattenedWorks = useMemo(
    () => layout.positionedWorks.map((w) => ({ ...w, y: uniformWorkY })),
    [layout.positionedWorks, uniformWorkY],
  );

  /** 가로 스크롤 진행 → viewport 중앙 X */
  const scrollProgress = useMotionValue(0);
  const scrollDistance = Math.max(0, layout.totalWidth - viewportWidth);
  const scrollOffset = useTransform(scrollProgress, [0, 1], [0, scrollDistance]);
  const viewportCenterX = useTransform(
    scrollProgress,
    (p) => p * scrollDistance + viewportWidth / 2,
  );

  /** 가상화 — 가로 스크롤 위치 기준 viewport 폭 단위 chunk로 나눠
      현재 chunk ± BUFFER 안의 작품만 mount. 화면 밖 노드의 motion 평가/렌더 비용 제거.
      fade-in 거리(=halfViewport)보다 BUFFER가 커야 자연스러운 등장 보장. */
  const CHUNK_WIDTH_FACTOR = 2; /** chunk 폭 = viewportWidth × factor (chunk 전환 빈도 낮춤) */
  const BUFFER = 1;             /** ±1 chunk buffer */
  const chunkWidth = Math.max(1, viewportWidth * CHUNK_WIDTH_FACTOR);
  const chunkCount = Math.max(1, Math.ceil(layout.totalWidth / chunkWidth));
  const [visibleChunkIdx, setVisibleChunkIdx] = useState(0);
  useMotionValueEvent(scrollProgress, 'change', (p) => {
    const idx = Math.min(chunkCount - 1, Math.max(0, Math.floor(p * chunkCount)));
    setVisibleChunkIdx((prev) => (prev === idx ? prev : idx));
  });
  const visibleWorks = useMemo(() => {
    const minX = (visibleChunkIdx - BUFFER) * chunkWidth;
    const maxX = (visibleChunkIdx + 1 + BUFFER) * chunkWidth;
    return flattenedWorks.filter((w) => w.x >= minX && w.x <= maxX);
  }, [flattenedWorks, visibleChunkIdx, chunkWidth]);

  /** active band 추적 — viewport 중앙에서 가장 가까운 작품의 band.
      x 정렬 후 binary search로 O(log n). band 전환 시에만 setState. */
  const sortedByX = useMemo(() => {
    const arr = [...flattenedWorks].sort((a, b) => a.x - b.x);
    return {
      xs: arr.map((w) => w.x),
      bands: arr.map((w) => w.band),
    };
  }, [flattenedWorks]);

  useMotionValueEvent(viewportCenterX, 'change', (cx) => {
    const { xs, bands } = sortedByX;
    if (xs.length === 0) return;
    let lo = 0;
    let hi = xs.length - 1;
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      if (xs[mid] < cx) lo = mid + 1;
      else hi = mid;
    }
    const candidates = [];
    if (lo > 0) candidates.push(lo - 1);
    candidates.push(lo);
    let bestIdx = candidates[0];
    let bestD = Math.abs(xs[bestIdx] - cx);
    for (let i = 1; i < candidates.length; i++) {
      const d = Math.abs(xs[candidates[i]] - cx);
      if (d < bestD) { bestD = d; bestIdx = candidates[i]; }
    }
    const nextBand = bands[bestIdx];
    setActiveBandId((prev) => (prev === nextBand ? prev : nextBand));
  });

  const handleScrollProgress = useCallback(
    (v) => { scrollProgress.set(v); },
    [scrollProgress],
  );
  const handleItemHover = useCallback((id) => setActiveId(id), []);
  const handleItemLeave = useCallback(() => setActiveId(null), []);
  const handleMinimapNavigate = useCallback(
    (targetProgress) => {
      const targetY = targetProgress * scrollDistance;
      window.scrollTo({ top: targetY, behavior: 'smooth' });
    },
    [scrollDistance],
  );

  return (
    <>
      { !hideMinimap && (
        <TimelineMinimap
          positionedWorks={ flattenedWorks }
          totalWidth={ layout.totalWidth }
          axisY={ layout.axisY }
          viewportWidth={ viewportWidth }
          scrollProgress={ scrollProgress }
          onNavigate={ handleMinimapNavigate }
        />
      ) }

      <HorizontalScrollContainer
        backgroundColor={ backgroundColor ?? theme.palette.background.default }
        onScrollProgress={ handleScrollProgress }
      >
        <TimelineCanvas
          positionedWorks={ visibleWorks }
          positionedEvents={ layout.positionedEvents }
          emotionBands={ [] }
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

      { !hideMinimap && <BandLegend activeBandId={ activeBandId } /> }
    </>
  );
}

export { WorldviewTimeline };
