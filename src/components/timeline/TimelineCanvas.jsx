import React, { useMemo, useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import { useLocale } from '../../i18n';
import { TOKENS } from '../../styles/themes/tokens.js';
import { ColorDonutChart } from './ColorDonutChart.jsx';
import { ColorDetailModal } from './ColorDetailModal.jsx';
import { TimelineAxis } from './TimelineAxis.jsx';
import { BRAND_DISPLAY, PRODUCT } from './typography.js';
import { TimelineEventItem } from './TimelineEventItem.jsx';
import { TimelineWorkItem } from './TimelineWorkItem.jsx';
import { TimelineTrendBackground } from './TimelineTrendBackground.jsx';
import { WorkImage } from './WorkImage.jsx';

/** hex → [r, g, b] (0~255) */
function hexToRgb(hex) {
  return [
    parseInt(hex.slice(1, 3), 16),
    parseInt(hex.slice(3, 5), 16),
    parseInt(hex.slice(5, 7), 16),
  ];
}

/** [r, g, b] → hex */
function rgbToHex(r, g, b) {
  return '#' + [r, g, b].map((v) => Math.round(v).toString(16).padStart(2, '0')).join('');
}

/* eslint-disable no-unused-vars */
/**
 * 유사 색상 클러스터링 — RGB를 step 단위로 양자화, 같은 버킷 합산.
 * 키워드/축 도넛 컨셉으로 전환 후 본 파일에서는 미사용. ColorDetailModal/색 컨셉 부활 시 재활용 위해 보존.
 * @returns {Array<{color: string, weight: number}>} 내림차순 정렬
 */
function clusterColors(colorEntries, step = 48) {
  const buckets = {};
  colorEntries.forEach(({ color, weight }) => {
    const [r, g, b] = hexToRgb(color);
    const qr = Math.round(r / step) * step;
    const qg = Math.round(g / step) * step;
    const qb = Math.round(b / step) * step;
    const key = `${qr},${qg},${qb}`;
    if (!buckets[key]) buckets[key] = { sumR: 0, sumG: 0, sumB: 0, totalW: 0 };
    buckets[key].sumR += r * weight;
    buckets[key].sumG += g * weight;
    buckets[key].sumB += b * weight;
    buckets[key].totalW += weight;
  });
  return Object.values(buckets)
    .map((b) => ({
      color: rgbToHex(b.sumR / b.totalW, b.sumG / b.totalW, b.sumB / b.totalW),
      weight: b.totalW,
    }))
    .sort((a, b) => b.weight - a.weight);
}

/**
 * 소스 추적 포함 색상 클러스터링 — 도넛 차트용
 * @returns {Array<{color, pct, bands: [{id, count}], works: [{id, title, image, year, band}]}>}
 */
function clusterColorsWithSources(works, step = 48) {
  const buckets = {};
  works.forEach((work) => {
    (work.color_blocks || []).forEach((block) => {
      const [r, g, b] = hexToRgb(block.color);
      const qr = Math.round(r / step) * step;
      const qg = Math.round(g / step) * step;
      const qb = Math.round(b / step) * step;
      const key = `${qr},${qg},${qb}`;
      if (!buckets[key]) {
        buckets[key] = { sumR: 0, sumG: 0, sumB: 0, totalW: 0, workIds: new Set(), bandCounts: {} };
      }
      const bk = buckets[key];
      bk.sumR += r * block.ratio;
      bk.sumG += g * block.ratio;
      bk.sumB += b * block.ratio;
      bk.totalW += block.ratio;
      bk.workIds.add(work.id);
      bk.bandCounts[work.band] = (bk.bandCounts[work.band] || 0) + 1;
    });
  });

  const workMap = {};
  works.forEach((w) => { workMap[w.id] = w; });

  const clusters = Object.values(buckets)
    .map((bk) => ({
      color: rgbToHex(bk.sumR / bk.totalW, bk.sumG / bk.totalW, bk.sumB / bk.totalW),
      weight: bk.totalW,
      workIds: bk.workIds,
      bandCounts: bk.bandCounts,
    }))
    .sort((a, b) => b.weight - a.weight);

  const total = clusters.reduce((s, c) => s + c.weight, 0);

  /** pct < 2% 세그먼트는 'Other'로 병합 */
  const main = [];
  let otherWeight = 0;
  const otherWorkIds = new Set();
  const otherBandCounts = {};

  clusters.forEach((c) => {
    if (c.weight / total >= 0.02) {
      main.push(c);
    } else {
      otherWeight += c.weight;
      c.workIds.forEach((id) => otherWorkIds.add(id));
      Object.entries(c.bandCounts).forEach(([band, cnt]) => {
        otherBandCounts[band] = (otherBandCounts[band] || 0) + cnt;
      });
    }
  });

  if (otherWeight > 0) {
    main.push({
      color: '#BDBDBD',
      weight: otherWeight,
      workIds: otherWorkIds,
      bandCounts: otherBandCounts,
    });
  }

  const finalTotal = main.reduce((s, c) => s + c.weight, 0);

  return main.map((c) => ({
    color: c.color,
    pct: finalTotal > 0 ? c.weight / finalTotal : 0,
    bands: Object.entries(c.bandCounts)
      .map(([id, count]) => ({ id, count }))
      .sort((a, b) => b.count - a.count),
    works: [...c.workIds]
      .map((id) => workMap[id])
      .filter(Boolean)
      .sort((a, b) => a.year - b.year),
  }));
}
/* eslint-enable no-unused-vars */

/** Y축 밴드 순서 (상→하) — Hirst 5세계관 밴드 */
const BAND_ORDER = ['TRANSCENDENCE', 'SYSTEM', 'RITUAL', 'VANITAS', 'MORTALITY'];

/** 5 사상축 (작품 axis_weights 키와 글자 단위 일치) */
const AXIS_KEYS = ['MORTALITY', 'SYSTEM', 'FAITH', 'VALUE', 'FORM'];
/** 5 사상축 표시 색 (블루 베이스 톤과 어울리는 뮤트 어스) */
const AXIS_COLORS = {
  MORTALITY: '#3F4A5B',
  SYSTEM:    '#9C8B5C',
  FAITH:     '#A36C3F',
  VALUE:     '#5B7878',
  FORM:      '#BDB6A2',
};
/** 5 사상축 i18n 키 */
const AXIS_LOCALE_KEYS = {
  MORTALITY: 'axis.mortality',
  SYSTEM:    'axis.system',
  FAITH:     'axis.faith',
  VALUE:     'axis.value',
  FORM:      'axis.form',
};

/** Col 2 — Bio-Specimen 카테고리 (artworks[].category 와 일치) */
const BIO_CATEGORIES = ['formaldehyde', 'butterfly', 'fly_cycle', 'aquatic', 'human_remains'];
const BIO_CATEGORY_LABEL_KO = {
  formaldehyde: '포름알데히드',
  butterfly: '나비',
  fly_cycle: '파리·구더기',
  aquatic: '어류',
  human_remains: '인간 유해',
};
const BIO_CATEGORY_LABEL_EN = {
  formaldehyde: 'Formaldehyde',
  butterfly: 'Butterfly',
  fly_cycle: 'Fly cycle',
  aquatic: 'Aquatic',
  human_remains: 'Human remains',
};
const CONDITION_LABEL_KO = {
  deceased: '사체',
  live: '생체',
  mixed: '혼합',
  remains: '잔해',
};

/**
 * 모든 작품의 axis_weights를 합산해 5축 도넛 데이터 생성.
 * @returns {Array<{ color, pct, label, axisId, works, weightSum }>}
 */
function buildAxisDonutData(works, t) {
  const sums = Object.fromEntries(AXIS_KEYS.map((k) => [k, 0]));
  const worksByAxis = Object.fromEntries(AXIS_KEYS.map((k) => [k, []]));
  works.forEach((w) => {
    const aw = w.axis_weights || {};
    AXIS_KEYS.forEach((k) => {
      const v = Number(aw[k] || 0);
      sums[k] += v;
      if (v > 0) worksByAxis[k].push(w);
    });
  });
  const total = AXIS_KEYS.reduce((s, k) => s + sums[k], 0) || 1;
  return AXIS_KEYS.map((k) => ({
    axisId: k,
    color: AXIS_COLORS[k],
    label: t(AXIS_LOCALE_KEYS[k]) || k,
    pct: sums[k] / total,
    weightSum: sums[k],
    works: worksByAxis[k],
  }));
}

/** 이벤트 스트립 높이 — 축 바로 아래, 하단 패널 위 */
const EVENT_STRIP_H = 80;

/** 하단 4컬럼 에디토리얼 패널 활성화 플래그.
    false면 트리 자체를 mount하지 않아 초기 cost/메모리/render 부담을 제거.
    되살릴 때 true. */
const SHOW_BOTTOM_PANEL = false;

/**
 * TimelineCanvas — 전체 좌표계를 담는 절대 위치 캔버스
 *
 * X축 상단에 작품을 감정 밴드별로 배치.
 * X축 하단: 이벤트 스트립 + 4컬럼 에디토리얼 패널.
 *
 * Props:
 * @param {Array} positionedWorks - 배치 계산된 작품 배열 [Required]
 * @param {Array} positionedEvents - 배치 계산된 이벤트 배열 [Required]
 * @param {Array} emotionBands - Y축 감정 밴드 틱 [{id, label, y}] [Required]
 * @param {Array} periodBands - 시기 밴드 데이터 [Required]
 * @param {Array} yearTicks - 연도 틱 데이터 [Required]
 * @param {number} totalWidth - 캔버스 전체 너비 (px) [Required]
 * @param {number} axisY - 축 Y 위치 (px) [Required]
 * @param {number} viewportHeight - 뷰포트 높이 (px) [Required]
 * @param {string|null} activeId - 현재 활성 아이템 ID [Optional]
 * @param {function} onItemHover - 호버 콜백 [Optional]
 * @param {function} onItemLeave - 호버 해제 콜백 [Optional]
 * @param {Object} scrollOffset - 화면 고정용 framer-motion MotionValue [Optional]
 * @param {number} nodeScale - 작품 노드 크기 스케일 (0~1) [Optional, 기본값: 1]
 * @param {Object} bioData - hirst-bio-specimen-data.js 의 default export (artworks/speciesSummary/sources/caveats) [Optional]
 * @param {Object} trendData - hirst-trend-data.json의 trendData 객체 {series, peaks, ...} [Optional]
 * @param {function} yearToX - 연도(소수 허용) → X 픽셀 매핑 함수, useTimelineLayout 제공 [Optional]
 * @param {Object} scrollProgress - framer-motion MotionValue (0~1), trend reveal frontier 계산용 [Optional]
 * @param {number} viewportWidth - 현재 뷰포트 너비 (px), trend reveal frontier 시작 좌표 [Optional]
 *
 * Example usage:
 * <TimelineCanvas {...layoutData} viewportHeight={800} bioData={ bioData } trendData={ trendData } />
 */
function TimelineCanvas({
  positionedWorks,
  positionedEvents,
  emotionBands,
  periodBands,
  yearTicks,
  totalWidth,
  axisY,
  viewportHeight,
  activeId = null,
  onItemHover,
  onItemLeave,
  onItemClick,
  onPeakHover,
  onPeakLeave,
  onPeakClick,
  scrollOffset,
  nodeScale = 1,
  bioData,
  trendData,
  yearToX,
  scrollProgress,
  viewportWidth,
}) {
  /** focus/hover 인터랙션 제거됨. activeId/activeWork는 더 이상 시각 동작에 영향 X
      (panel 비활성 상태에선 아예 사용되지 않음). */
  const activeWork = activeId
    ? positionedWorks.find((w) => w.id === activeId)
    : null;

  const { t, localized } = useLocale();
  const panelTop = axisY + EVENT_STRIP_H;
  const panelHeight = viewportHeight - panelTop;
  const [selectedBioCategory, setSelectedBioCategory] = useState(BIO_CATEGORIES[0]);
  const [selectedSegment, setSelectedSegment] = useState(null);

  /** Col 1 도넛 — 전체 작품의 5축 가중치 합산 ("Keyword Cloud / 사상축 분포") */
  const donutData = useMemo(
    () => buildAxisDonutData(positionedWorks, t),
    [positionedWorks, t],
  );

  /** Col 2 — Bio-Specimen 패널 데이터 */
  const bioArtworksByCategory = useMemo(() => {
    const out = Object.fromEntries(BIO_CATEGORIES.map((c) => [c, []]));
    (bioData?.artworks ?? []).forEach((a) => {
      if (out[a.category]) out[a.category].push(a);
    });
    return out;
  }, [bioData]);
  const bioSourceById = useMemo(
    () => Object.fromEntries((bioData?.sources ?? []).map((s) => [s.id, s])),
    [bioData],
  );
  const selectedBioArtworks = bioArtworksByCategory[selectedBioCategory] ?? [];

  /** viewport 중앙 canvas X 좌표 — 이제 작품의 entry fade-in trigger용으로만 사용.
      focus scale 로직(Voronoi)은 제거됨. */
  const fallbackProgress = useMotionValue(0);
  const sourceProgress = scrollProgress ?? fallbackProgress;
  const scrollDistance = Math.max(0, totalWidth - (viewportWidth ?? 0));
  const halfViewport = (viewportWidth ?? 0) / 2;
  const viewportCenterX = useTransform(
    sourceProgress,
    (p) => p * scrollDistance + halfViewport,
  );
  /** entry fade-in 시작 반경 (viewport 우측 끝) */
  const focusRadius = Math.max(halfViewport, 1);

  return (
    <Box
      sx={ {
        position: 'relative',
        width: totalWidth,
        height: viewportHeight,
        flexShrink: 0,
        backgroundColor: TOKENS.bg.dark,
        /** CSS containment — 자식 transform/opacity 변경이 외부로 invalidation 누수
            못하게 차단. paint도 이 박스 내부로 클립. */
        contain: 'layout paint',
      } }
    >
      {/* 좌상단 고정 타이틀 — 그로테스크 high-contrast serif, viewport-fixed.
          xs(<375px): left/top 16px + fontSize 2.2rem (35px)로 "DAMIEN HIRST" overflow 방지. */}
      <motion.div
        style={ {
          position: 'absolute',
          left: 16,
          top: 16,
          pointerEvents: 'none',
          zIndex: 5,
          x: scrollOffset,
        } }
      >
        <Box
          sx={ {
            /* xs는 16px offset, md+는 기존 32px 동등 효과를 위해 16px 추가 padding */
            pl: { xs: 0, md: 2 },
            pt: { xs: 0, md: 2 },
          } }
        >
          <Typography
            sx={ {
              display: 'block',
              fontFamily: BRAND_DISPLAY,
              fontSize: { xs: '2.2rem', sm: '3rem', md: '4.5rem', lg: '6rem' },
              fontWeight: 900,
              fontStyle: 'normal',
              lineHeight: 0.92,
              color: 'text.primary',
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
            } }
          >
            Damien Hirst
          </Typography>
          <Typography
            variant="caption"
            sx={ {
              display: 'block',
              mt: { xs: 1, md: 1.5 },
              fontFamily: PRODUCT,
              fontSize: { xs: '0.66rem', md: '0.78rem' },
              letterSpacing: '0.32em',
              textTransform: 'uppercase',
              color: 'text.disabled',
            } }
          >
            1965 — present
          </Typography>
        </Box>
      </motion.div>

      {/* 우측 고정 Trend Y축 라벨 (0~100 search index) */}
      { trendData?.series && (
        <motion.div
          style={ {
            position: 'absolute',
            left: Math.max(0, (viewportWidth ?? 0) - 64),
            top: 0,
            height: axisY,
            width: 56,
            pointerEvents: 'none',
            zIndex: 5,
            x: scrollOffset,
          } }
        >
          { [100, 75, 50, 25, 0].map((v) => {
            /** TimelineTrendBackground와 동일한 TOP_PADDING.
                상단 타이틀 영역과 겹치지 않도록 조정됨. */
            const TOP_PADDING = 200;
            const upperBudget = axisY - TOP_PADDING;
            const y = axisY - (v / 100) * upperBudget;
            return (
              <Box
                key={ v }
                sx={ {
                  position: 'absolute',
                  top: y,
                  left: 0,
                  right: 0,
                  transform: 'translateY(-50%)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.75,
                  justifyContent: 'flex-end',
                  pr: 1,
                } }
              >
                <Typography
                  variant="caption"
                  sx={ {
                    fontFamily: PRODUCT,
                    fontSize: '0.7rem',
                    fontWeight: 500,
                    color: 'text.disabled',
                    fontVariantNumeric: 'tabular-nums',
                    letterSpacing: '0.02em',
                    userSelect: 'none',
                  } }
                >
                  { v }
                </Typography>
                <Box
                  sx={ {
                    width: 6,
                    height: '1px',
                    backgroundColor: 'action.disabled',
                  } }
                />
              </Box>
            );
          }) }
          {/* 축 라벨 — Google Trends 출처 명시.
              100 tick (TOP_PADDING = 200) 바로 위에 위치. LanguageToggle(fixed)에 가리지 않도록
              viewport 최상단 대신 차트 영역 안쪽 배치. */}
          <Box
            sx={ {
              position: 'absolute',
              top: 156,
              right: 8,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-end',
              gap: 0.25,
              userSelect: 'none',
            } }
          >
            <Typography
              component="span"
              sx={ {
                fontFamily: PRODUCT,
                fontSize: '0.64rem',
                fontWeight: 700,
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
                color: 'text.secondary',
                lineHeight: 1.2,
              } }
            >
              Google Trends
            </Typography>
            <Typography
              component="span"
              sx={ {
                fontFamily: PRODUCT,
                fontSize: '0.56rem',
                fontWeight: 500,
                letterSpacing: '0.16em',
                textTransform: 'uppercase',
                color: 'text.disabled',
                lineHeight: 1.2,
              } }
            >
              Search Index · 0–100
            </Typography>
          </Box>
        </motion.div>
      ) }

      {/* 트렌드 배경 — 축 위 라인 차트, X scale은 타임라인과 동일.
          scrollProgress + viewportWidth가 주어지면 우측 frontier reveal 트랜지션 적용 */}
      { trendData?.series && yearToX && (
        <TimelineTrendBackground
          series={ trendData.series }
          peaks={ trendData.peaks }
          axisY={ axisY }
          totalWidth={ totalWidth }
          yearToX={ yearToX }
          scrollProgress={ scrollProgress }
          viewportWidth={ viewportWidth }
          onPeakHover={ onPeakHover }
          onPeakLeave={ onPeakLeave }
          onPeakClick={ onPeakClick }
        />
      ) }

      {/* 축 + Y축 감정 틱 */}
      <TimelineAxis
        totalWidth={ totalWidth }
        axisY={ axisY }
        yearTicks={ yearTicks }
        periodBands={ periodBands }
        emotionBands={ emotionBands }
        viewportHeight={ viewportHeight }
        scrollOffset={ scrollOffset }
      />

      {/* 작품 노드 — hover 인터랙션: 활성 작품 overlay + 나머지 dim. */}
      { positionedWorks.map((work) => {
        const isDimmed = activeId != null && activeId !== work.id;
        return (
          <TimelineWorkItem
            key={ work.id }
            work={ work }
            axisY={ axisY }
            nodeScale={ nodeScale }
            viewportCenterX={ viewportCenterX }
            focusRadius={ focusRadius }
            isDimmed={ isDimmed }
            onMouseEnter={ onItemHover }
            onMouseLeave={ onItemLeave }
            onClick={ onItemClick }
          />
        );
      }) }

      {/* 이벤트 노드 (축 하단 — 이벤트 스트립 영역) */}
      { positionedEvents.map((event) => (
        <TimelineEventItem
          key={ event.id }
          event={ event }
          axisY={ axisY }
        />
      )) }

      {/* 하단 고정 패널 — 이벤트 스트립 아래, 4컬럼 에디토리얼 그리드.
          현재 비활성: 트리 자체를 mount하지 않아 초기 비용/메모리 절감.
          되살릴 땐 SHOW_BOTTOM_PANEL=true 로 토글. */}
      { SHOW_BOTTOM_PANEL && (
      <motion.div
        style={ {
          position: 'absolute',
          left: 0,
          top: panelTop,
          width: '100vw',
          height: panelHeight,
          display: 'none',
          paddingTop: 0,
          pointerEvents: 'none',
          zIndex: 4,
          x: scrollOffset,
        } }
      >
        {/* ── Col 1 — Color Palette (Donut) ── */}
        <Box
          sx={ {
            width: { xs: '100%', lg: '25%' },
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            px: { xs: 3, sm: 4, md: 5, lg: 6, xl: 9 },
            py: { xs: 1.5, sm: 2, md: 2.5, lg: 3, xl: 4 },
            overflow: 'hidden',
            pointerEvents: 'auto',
          } }
        >
          <Typography
            variant="h4"
            sx={ {
              color: 'text.primary',
              mb: 0.5,
              flexShrink: 0,
              fontSize: { lg: '1.25rem', xl: '1.5rem' },
            } }
          >
            { t('ui.entropyTitle') }
          </Typography>
          <Typography
            variant="body2"
            sx={ {
              color: 'text.disabled',
              mb: { lg: 2, xl: 3 },
              flexShrink: 0,
            } }
          >
            { t('ui.entropyDesc') }
          </Typography>

          <Box
            sx={ {
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            } }
          >
            <ColorDonutChart
              data={ donutData }
              size={ Math.min(Math.max(panelHeight * 0.65, 200), 360) }
              onSegmentClick={ setSelectedSegment }
              totalWorks={ positionedWorks.length }
            />
          </Box>
        </Box>

        {/* ── Col 2 — Color Analysis ── */}
        <Box
          sx={ {
            width: { md: '33%', lg: '25%' },
            height: '100%',
            display: { xs: 'none', md: 'flex' },
            flexDirection: 'column',
            borderLeft: { md: '1px solid' },
            borderColor: { md: 'divider' },
            overflow: 'hidden',
            pointerEvents: 'auto',
          } }
        >
          <Box sx={ { px: { md: 3, lg: 5, xl: 7.5 }, pt: { md: 2, lg: 3, xl: 4 }, pb: { md: 1, lg: 1.5, xl: 2 }, flexShrink: 0 } }>
            <Typography
              variant="h4"
              sx={ {
                color: 'text.primary',
                fontSize: { md: '1.125rem', lg: '1.25rem', xl: '1.5rem' },
              } }
            >
              { t('ui.colorAnalysis') }
            </Typography>
          </Box>

          {/* Bio 카테고리 탭 */}
          <Box
            sx={ {
              display: 'flex',
              px: { md: 1.5, lg: 2, xl: 3 },
              gap: '2px',
              flexShrink: 0,
            } }
          >
            { BIO_CATEGORIES.map((id) => (
              <Box
                key={ id }
                onClick={ () => setSelectedBioCategory(id) }
                sx={ {
                  flex: 1,
                  py: 1,
                  textAlign: 'center',
                  cursor: 'pointer',
                  borderRadius: '4px 4px 0 0',
                  backgroundColor: selectedBioCategory === id ? 'action.selected' : 'transparent',
                  transition: 'background-color 0.15s',
                  '&:hover': { backgroundColor: selectedBioCategory === id ? 'action.selected' : 'action.hover' },
                } }
              >
                <Typography
                  variant="body2"
                  sx={ {
                    fontWeight: selectedBioCategory === id ? 600 : 400,
                    color: selectedBioCategory === id ? 'text.primary' : 'text.disabled',
                    fontSize: { md: '0.7rem', lg: '0.75rem', xl: '0.8rem' },
                  } }
                >
                  { localized({ ko: BIO_CATEGORY_LABEL_KO[id], en: BIO_CATEGORY_LABEL_EN[id] }) }
                </Typography>
              </Box>
            )) }
          </Box>

          {/* 스크롤 영역 — 카테고리 요약 + bio 작품 리스트 */}
          <Box
            sx={ {
              flex: 1,
              overflowY: 'auto',
              '&::-webkit-scrollbar': { width: 3 },
              '&::-webkit-scrollbar-thumb': { backgroundColor: 'divider', borderRadius: 2 },
            } }
          >
            {/* 카테고리 요약: 작품 수 + 누적 마리수(검증 가능 분만) */}
            <Box sx={ { px: { md: 3, lg: 5, xl: 7.5 }, py: { md: 1.5, lg: 2, xl: 2 }, backgroundColor: 'action.hover' } }>
              <Typography
                variant="caption"
                sx={ { color: 'text.secondary', lineHeight: 1.6 } }
              >
                { (() => {
                  const arts = selectedBioArtworks;
                  const verifiedCount = arts.filter((a) => a.verified).length;
                  const totalIndividuals = arts.reduce((s, a) => {
                    return s + (a.species ?? []).reduce((ss, sp) => ss + (Number(sp.count) || 0), 0);
                  }, 0);
                  return localized({
                    ko: `${arts.length}개 작품 · 검증 ${verifiedCount}건 · 정량 누적 ${totalIndividuals.toLocaleString()}개체(검증 가능 분)`,
                    en: `${arts.length} works · ${verifiedCount} verified · ${totalIndividuals.toLocaleString()} individuals (where countable)`,
                  });
                })() }
              </Typography>
            </Box>

            {/* Bio 작품 리스트 */}
            <Box sx={ { px: { md: 3, lg: 4, xl: 6 }, py: { md: 2, lg: 2.5, xl: 3 } } }>
              { selectedBioArtworks.length > 0 ? selectedBioArtworks.map((art) => (
                <Box
                  key={ art.id }
                  sx={ {
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 1.5,
                    py: 1,
                    borderBottom: '1px solid',
                    borderColor: 'divider',
                    '&:last-child': { borderBottom: 'none' },
                  } }
                >
                  <Box sx={ { flex: 1, minWidth: 0 } }>
                    <Typography
                      variant="body2"
                      sx={ {
                        fontWeight: 500,
                        lineHeight: 1.3,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                      } }
                      title={ art.titleEn }
                    >
                      { art.titleEn }
                    </Typography>
                    <Box sx={ { display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 0.5 } }>
                      { (art.species ?? []).map((sp, i) => {
                        const cond = sp.condition;
                        const condLabel = localized({
                          ko: CONDITION_LABEL_KO[cond] || cond || '',
                          en: cond || '',
                        });
                        const countText = sp.count != null
                          ? sp.count.toLocaleString()
                          : localized({ ko: '미공개', en: '—' });
                        return (
                          <Box
                            key={ i }
                            sx={ {
                              display: 'inline-flex',
                              alignItems: 'baseline',
                              gap: 0.5,
                              px: 0.75,
                              py: 0.25,
                              backgroundColor: sp.count != null ? 'text.primary' : 'action.disabledBackground',
                              color: sp.count != null ? 'background.paper' : 'text.secondary',
                              borderRadius: '2px',
                              fontSize: '0.65rem',
                              lineHeight: 1.2,
                            } }
                          >
                            <Box component="span" sx={ { fontWeight: 700 } }>
                              { countText }
                            </Box>
                            <Box component="span" sx={ { opacity: 0.85 } }>
                              { sp.commonName ?? '—' }
                            </Box>
                            { condLabel && (
                              <Box component="span" sx={ { opacity: 0.6, fontSize: '0.6rem' } }>
                                { condLabel }
                              </Box>
                            ) }
                          </Box>
                        );
                      }) }
                    </Box>
                    { (art.sourceIds?.length ?? 0) > 0 && (
                      <Box sx={ { display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 0.5 } }>
                        { art.sourceIds.map((sid) => {
                          const src = bioSourceById[sid];
                          if (!src) return null;
                          return (
                            <Typography
                              key={ sid }
                              variant="caption"
                              title={ src.citation }
                              sx={ {
                                color: 'text.disabled',
                                fontFamily: 'monospace',
                                fontSize: '0.6rem',
                                cursor: 'help',
                              } }
                            >
                              { sid }
                            </Typography>
                          );
                        }) }
                      </Box>
                    ) }
                  </Box>
                  <Typography
                    variant="caption"
                    sx={ { color: 'text.disabled', flexShrink: 0, whiteSpace: 'nowrap' } }
                  >
                    { art.year ?? '—' }
                  </Typography>
                </Box>
              )) : (
                <Typography
                  variant="body2"
                  sx={ { color: 'text.disabled', pt: 2 } }
                >
                  { localized({ ko: '해당 카테고리 작품 없음', en: 'No works in this category' }) }
                </Typography>
              ) }
            </Box>
          </Box>
        </Box>

        {/* ── Col 3 — Selected Work ── */}
        <Box
          sx={ {
            width: { md: '33%', lg: '25%' },
            height: '100%',
            display: { xs: 'none', md: 'flex' },
            flexDirection: 'column',
            borderLeft: { md: '1px solid' },
            borderColor: { md: 'divider' },
            overflow: 'hidden',
          } }
        >
          <Box sx={ { px: { md: 4, lg: 5, xl: 7.5 }, pt: { md: 2, lg: 3, xl: 4 }, pb: { md: 1, lg: 1.5, xl: 2 }, flexShrink: 0 } }>
            <Typography
              variant="h4"
              sx={ {
                color: 'text.primary',
                fontSize: { md: '1.125rem', lg: '1.25rem', xl: '1.5rem' },
              } }
            >
              { activeWork ? t('ui.selectedWork') : t('ui.portrait') }
            </Typography>
          </Box>
          <Box
            sx={ {
              flex: 1,
              overflow: 'hidden',
              backgroundColor: activeWork ? 'background.paper' : 'transparent',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              p: activeWork
                ? { md: 3, lg: 4, xl: 6 }
                : { md: 2, lg: 3, xl: 4 },
            } }
          >
            { activeWork ? (
              <WorkImage
                work={ activeWork }
                showTitleInPlaceholder
                sx={ {
                  maxWidth: '100%',
                  maxHeight: '100%',
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                } }
              />
            ) : (
              <Box
                sx={ {
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                  overflow: 'hidden',
                } }
              >
                <Box
                  component="img"
                  src="/images/hirst/hirst-portrait.jpg"
                  alt="Damien Hirst"
                  onError={ (e) => { e.currentTarget.style.display = 'none'; } }
                  sx={ {
                    maxWidth: '100%',
                    maxHeight: '100%',
                    objectFit: 'contain',
                    opacity: 0.85,
                  } }
                />
              </Box>
            ) }
          </Box>
        </Box>

        {/* ── Col 4 — Details ── */}
        <Box
          sx={ {
            width: { md: '34%', lg: '25%' },
            height: '100%',
            display: { xs: 'none', md: 'flex' },
            flexDirection: 'column',
            px: { md: 4, lg: 6, xl: 9 },
            py: { md: 2, lg: 3, xl: 4 },
            borderLeft: { md: '1px solid' },
            borderColor: { md: 'divider' },
            overflow: 'hidden',
          } }
        >
          <Typography
            variant="h4"
            sx={ {
              color: 'text.primary',
              mb: { md: 2, lg: 3, xl: 4 },
              flexShrink: 0,
              fontSize: { md: '1.125rem', lg: '1.25rem', xl: '1.5rem' },
            } }
          >
            { activeWork ? t('ui.details') : t('ui.about') }
          </Typography>

          { activeWork ? (
            <Box sx={ { flex: 1, display: 'flex', flexDirection: 'column', overflowY: 'auto' } }>
              {/* 5축 가중치 막대 — 색 스와치 자리 대체 */}
              { activeWork.axis_weights && (
                <Box sx={ { mb: 3 } }>
                  { AXIS_KEYS.map((k) => {
                    const v = Number(activeWork.axis_weights[k] || 0);
                    return (
                      <Box
                        key={ k }
                        sx={ { display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 } }
                      >
                        <Typography
                          variant="caption"
                          sx={ {
                            width: 64,
                            color: 'text.secondary',
                            fontFamily: 'monospace',
                            fontSize: '0.65rem',
                          } }
                        >
                          { k }
                        </Typography>
                        <Box sx={ { flex: 1, height: 4, backgroundColor: 'action.disabledBackground' } }>
                          <Box
                            sx={ {
                              width: `${Math.round(v * 100)}%`,
                              height: '100%',
                              backgroundColor: AXIS_COLORS[k],
                              transition: 'width 0.2s',
                            } }
                          />
                        </Box>
                        <Typography
                          variant="caption"
                          sx={ {
                            width: 32,
                            textAlign: 'right',
                            color: 'text.disabled',
                            fontFamily: 'monospace',
                            fontSize: '0.65rem',
                          } }
                        >
                          { v.toFixed(2) }
                        </Typography>
                      </Box>
                    );
                  }) }
                </Box>
              ) }

              <Typography
                variant="h4"
                sx={ { mb: 1 } }
              >
                { activeWork.title }
              </Typography>

              <Typography
                variant="subtitle1"
                sx={ { color: 'text.secondary', mb: 0.5 } }
              >
                { activeWork.year }
              </Typography>

              <Typography
                variant="body1"
                sx={ { color: 'text.disabled', mb: 0.5 } }
              >
                { t(`band.${activeWork.band.toLowerCase()}`) || activeWork.band }
              </Typography>

              <Typography
                variant="body1"
                sx={ { color: 'text.disabled', mb: 1 } }
              >
                { activeWork.medium }
              </Typography>

              { activeWork.collection && (
                <Typography
                  variant="body2"
                  sx={ { color: 'text.disabled' } }
                >
                  { activeWork.collection }
                </Typography>
              ) }

              {/* 키워드 칩 */}
              { (activeWork.keyword_tags?.length ?? 0) > 0 && (
                <Box sx={ { display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 2 } }>
                  { activeWork.keyword_tags.map((tag, i) => (
                    <Box
                      key={ i }
                      sx={ {
                        px: 0.75,
                        py: 0.25,
                        backgroundColor: 'action.hover',
                        color: 'text.secondary',
                        fontSize: '0.7rem',
                        fontFamily: 'monospace',
                        borderRadius: '2px',
                      } }
                    >
                      { tag }
                    </Box>
                  )) }
                </Box>
              ) }
            </Box>
          ) : (
            <Box sx={ { flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' } }>
              <Typography
                variant="h5"
                sx={ { color: 'text.primary', mb: 2 } }
              >
                Damien Hirst
              </Typography>
              <Typography
                variant="subtitle2"
                sx={ { color: 'text.secondary', mb: 2 } }
              >
                1965, Bristol — present
              </Typography>
              <Typography
                variant="body2"
                sx={ { color: 'text.secondary', lineHeight: 1.7, mb: 2 } }
              >
                { t('ui.aboutDesc') }
              </Typography>
              <Typography
                variant="body2"
                sx={ { color: 'text.disabled', lineHeight: 1.7 } }
              >
                { t('ui.hoverGuide') }
              </Typography>
            </Box>
          ) }
        </Box>
      </motion.div>
      ) }

      {/* 색상 세그먼트 상세 모달 */}
      <ColorDetailModal
        open={ !!selectedSegment }
        onClose={ () => setSelectedSegment(null) }
        segment={ selectedSegment }
      />
    </Box>
  );
}

export { TimelineCanvas };
