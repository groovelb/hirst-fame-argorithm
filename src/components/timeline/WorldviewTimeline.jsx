import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useInView, useMotionValue, useMotionValueEvent } from 'framer-motion';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { HorizontalScrollContainer } from '../content-transition/HorizontalScrollContainer.jsx';
import { BandLegend } from './BandLegend.jsx';
import { PeakHoverOverlay } from './PeakHoverOverlay.jsx';
import { SpecimenInfographicSection } from './SpecimenInfographicSection.jsx';
import { TimelineCanvas } from './TimelineCanvas.jsx';
import { TimelineMinimap } from './TimelineMinimap.jsx';
import { useTimelineLayout } from './useTimelineLayout.js';
import { WorkFocusOverlay } from './WorkFocusOverlay.jsx';

/**
 * WorldviewTimeline — 세계관 5밴드 기반 타임라인.
 *
 * Focus 관련 인터랙션은 모두 제거됨:
 *  - 작품 hover/active 상태 없음
 *  - viewport 중앙 작품의 band 강조 없음
 *  - BandLegend는 정적 표시
 * 유지되는 동작: 작품 등장(entry) fade-in, chunk 가상화, 가로 스크롤.
 *
 * Props:
 * @param {Object} worksData - works JSON [Required]
 * @param {Object} eventsData - events JSON [Required]
 * @param {Object} bioData - bio-specimen JSON [Optional]
 * @param {Object} trendData - trend JSON [Optional]
 * @param {number} pxPerYear - 연도당 픽셀 [Optional, 기본값: 250]
 * @param {string} backgroundColor - 배경색 [Optional]
 * @param {boolean} hideMinimap - 미니맵/legend 숨김 [Optional, 기본값: false]
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
  onModalStateChange,
}) {
  const [viewportWidth, setViewportWidth] = useState(
    typeof window !== 'undefined' ? window.innerWidth : 1920,
  );
  const [viewportHeight, setViewportHeight] = useState(
    typeof window !== 'undefined' ? window.innerHeight : 800,
  );
  const [hoveredId, setHoveredId] = useState(null);   /** 작품 dim 효과 전용 */
  const [activeId, setActiveId] = useState(null);     /** modal 열림 — 작품 */
  const [activePeakId, setActivePeakId] = useState(null); /** modal 열림 — peak */

  const theme = useTheme();
  const isBelowSm = useMediaQuery(theme.breakpoints.down('sm'));
  const isBelowMd = useMediaQuery(theme.breakpoints.down('md'));
  const isBelowLg = useMediaQuery(theme.breakpoints.down('lg'));

  const responsivePxPerYear = isBelowSm ? 120 : isBelowMd ? 160 : isBelowLg ? 200 : pxPerYear;
  const nodeScale = isBelowSm ? 0.53 : isBelowMd ? 0.67 : isBelowLg ? 0.83 : 1.0;

  const axisRatio = 0.62;

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

  const uniformWorkY = viewportHeight * 0.45;

  const flattenedWorks = useMemo(
    () => layout.positionedWorks.map((w) => ({ ...w, y: uniformWorkY })),
    [layout.positionedWorks, uniformWorkY],
  );

  const scrollProgress = useMotionValue(0);
  const scrollDistance = Math.max(0, layout.totalWidth - viewportWidth);
  const timelineProgress = scrollProgress;
  const scrollOffset = useMotionValue(0);
  useMotionValueEvent(timelineProgress, 'change', (p) => {
    scrollOffset.set(p * scrollDistance);
  });
  const specimenRef = useRef(null);
  const isSpecimenSectionActive = useInView(specimenRef, { amount: 0.2 });

  /** 가상화 — chunk 기반. */
  const CHUNK_WIDTH_FACTOR = 2;
  const BUFFER = 1;
  const chunkWidth = Math.max(1, viewportWidth * CHUNK_WIDTH_FACTOR);
  const chunkCount = Math.max(1, Math.ceil(layout.totalWidth / chunkWidth));
  const [visibleChunkIdx, setVisibleChunkIdx] = useState(0);
  useMotionValueEvent(timelineProgress, 'change', (p) => {
    const idx = Math.min(chunkCount - 1, Math.max(0, Math.floor(p * chunkCount)));
    setVisibleChunkIdx((prev) => (prev === idx ? prev : idx));
  });
  const visibleWorks = useMemo(() => {
    const minX = (visibleChunkIdx - BUFFER) * chunkWidth;
    const maxX = (visibleChunkIdx + 1 + BUFFER) * chunkWidth;
    return flattenedWorks.filter((w) => w.x >= minX && w.x <= maxX);
  }, [flattenedWorks, visibleChunkIdx, chunkWidth]);

  const handleScrollProgress = useCallback(
    (v) => { scrollProgress.set(v); },
    [scrollProgress],
  );
  /** Hover는 dim 전용. Click이 modal을 연다. */
  const handleItemHover = useCallback((id) => setHoveredId(id), []);
  const handleItemLeave = useCallback(() => setHoveredId(null), []);
  const handleItemClick = useCallback((id) => setActiveId(id), []);
  const handleItemModalClose = useCallback(() => setActiveId(null), []);
  const activeWork = useMemo(
    () => (activeId ? flattenedWorks.find((w) => w.id === activeId) ?? null : null),
    [activeId, flattenedWorks],
  );
  /** 하단 BandLegend 강조: hover 또는 click 상태의 작품 band를 반영 */
  const highlightedWorkId = activeId ?? hoveredId;
  const highlightedWork = useMemo(
    () => (highlightedWorkId
      ? flattenedWorks.find((w) => w.id === highlightedWorkId) ?? null
      : null),
    [highlightedWorkId, flattenedWorks],
  );

  /** Peak hover — TimelineTrendBackground는 peak object(date/value/trigger 등)를 넘긴다.
      data root: { trendData: { peaks, series }, events: [...] }.
      peak.eventId(이 워크플로의 출력)로 top-level events 배열에서 풀 detail을 lookup. */
  const eventById = useMemo(() => {
    const map = new Map();
    (trendData?.events ?? []).forEach((e) => map.set(e.id, e));
    return map;
  }, [trendData]);
  const peakEventIdByDate = useMemo(() => {
    const map = new Map();
    (trendData?.trendData?.peaks ?? []).forEach((p) => {
      if (p.eventId) map.set(p.date, p.eventId);
    });
    return map;
  }, [trendData]);
  /** Peak hover/leave는 현재 dim 대상 없음 → no-op. Click에서만 modal. */
  const handlePeakHover = useCallback(() => { }, []);
  const handlePeakLeave = useCallback(() => { }, []);
  const handlePeakClick = useCallback((peakObj) => {
    const eid = peakEventIdByDate.get(peakObj?.date);
    if (eid) setActivePeakId(eid);
  }, [peakEventIdByDate]);
  const handlePeakModalClose = useCallback(() => setActivePeakId(null), []);
  const activePeakEvent = activePeakId ? eventById.get(activePeakId) ?? null : null;
  /** modal(작품 or peak) 열림 상태 — Minimap·BandLegend·외부 토글 등 숨김 트리거 */
  const isModalOpen = !!(activeId || activePeakId);

  /** 부모(LandingPage 등)가 LanguageToggle 같은 외부 오버레이를 같이 숨길 수 있게 신호. */
  useEffect(() => {
    onModalStateChange?.(isModalOpen);
  }, [isModalOpen, onModalStateChange]);
  const getEventLabel = useCallback(
    (id) => {
      const ev = eventById.get(id);
      return ev?.label || ev?.title || id;
    },
    [eventById],
  );
  const handleMinimapNavigate = useCallback(
    (targetProgress) => {
      const targetY = targetProgress * scrollDistance;
      window.scrollTo({ top: targetY, behavior: 'smooth' });
    },
    [scrollDistance],
  );

  return (
    <>
      {!hideMinimap && !isModalOpen && !isSpecimenSectionActive && (
        <TimelineMinimap
          positionedWorks={flattenedWorks}
          totalWidth={layout.totalWidth}
          axisY={layout.axisY}
          viewportWidth={viewportWidth}
          scrollProgress={timelineProgress}
          onNavigate={handleMinimapNavigate}
        />
      )}

      <HorizontalScrollContainer
        backgroundColor={backgroundColor ?? theme.palette.background.default}
        onScrollProgress={handleScrollProgress}
      >
        <TimelineCanvas
          positionedWorks={visibleWorks}
          positionedEvents={layout.positionedEvents}
          emotionBands={[]}
          periodBands={layout.periodBands}
          yearTicks={layout.yearTicks}
          totalWidth={layout.totalWidth}
          axisY={layout.axisY}
          viewportHeight={viewportHeight}
          activeId={highlightedWorkId}
          onItemHover={handleItemHover}
          onItemLeave={handleItemLeave}
          onItemClick={handleItemClick}
          onPeakHover={handlePeakHover}
          onPeakLeave={handlePeakLeave}
          onPeakClick={handlePeakClick}
          scrollOffset={scrollOffset}
          nodeScale={nodeScale}
          bioData={bioData}
          trendData={trendData?.trendData}
          yearToX={layout.yearToX}
          scrollProgress={timelineProgress}
          viewportWidth={viewportWidth}
        />
      </HorizontalScrollContainer>

      <div ref={specimenRef}>
        <SpecimenInfographicSection
          bioData={bioData}
          worksData={worksData}
          width="100%"
          viewportHeight={viewportHeight}
        />
      </div>

      {!hideMinimap && !isModalOpen && !isSpecimenSectionActive && (
        <BandLegend activeBandId={highlightedWork?.band ?? null} />
      )}
      <WorkFocusOverlay activeWork={activeWork} onClose={handleItemModalClose} />
      <PeakHoverOverlay
        activeEvent={activePeakEvent}
        getEventLabel={getEventLabel}
        onClose={handlePeakModalClose}
      />
    </>
  );
}

export { WorldviewTimeline };
