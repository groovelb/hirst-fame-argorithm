import { useMemo, useState } from 'react';
import { Box, Container, Stack, Typography } from '@mui/material';

import { EraSegment } from '../layout/EraSegment.jsx';
import { BestiaryGrid } from '../layout/BestiaryGrid.jsx';
import { EraThesisHeadline } from '../typography/EraThesisHeadline.jsx';
import { EraEventStrip } from '../data-display/EraEventStrip.jsx';
import { WorldviewMiniMap } from '../navigation/WorldviewMiniMap.jsx';
import { CaveatNote } from '../overlay-feedback/CaveatNote.jsx';
import { WorkDetailModal } from '../overlay-feedback/WorkDetailModal.jsx';
import { WorkImage } from './WorkImage.jsx';
import { TOKENS } from '../../styles/themes/tokens.js';

/**
 * HirstWorldviewTimeline 컴포넌트
 *
 * Hirst의 작업 인생을 7개 Era 세그먼트로 풀어 보여주는 단일 스크롤 셸.
 * 각 Era에는 명제·사건 스트립·대표작 정보가 들어가고, 베스티어리 섹션이 인라인 노출.
 *
 * Props:
 * @param {object} erasData - hirst_eras.json 의 루트 (meta + eras[]) [Required]
 * @param {object} worksData - hirst_works.json 의 루트 (meta + works[]) [Required]
 * @param {object} eventsData - hirst_events.json 의 루트 (meta + events[]) [Required]
 * @param {object} bioData - hirst-bio-specimen-data.js 의 default export (artworks/speciesSummary/sources/caveats) [Required]
 * @param {object} workBioMap - hirst_work_bio_map.json 의 루트 (workToBio: { workId: bioId }) [Optional]
 * @param {string} locale - 'ko' | 'en' [Optional, 기본값: 'ko']
 *
 * Example usage:
 * <HirstWorldviewTimeline erasData={ erasData } worksData={ worksData } eventsData={ eventsData } bioData={ bioData } workBioMap={ workBioMap } />
 */
export function HirstWorldviewTimeline({
  erasData,
  worksData,
  eventsData,
  bioData,
  workBioMap,
  locale = 'ko',
}) {
  const [activeWork, setActiveWork] = useState(null);

  const eras = erasData?.eras ?? [];

  const worksByEra = useMemo(
    () => groupBy(worksData?.works ?? [], 'worldview_period'),
    [worksData],
  );
  const eventsByEra = useMemo(
    () => groupBy(eventsData?.events ?? [], 'worldview_period'),
    [eventsData],
  );

  const sourceById = useMemo(
    () => Object.fromEntries((bioData?.sources ?? []).map((s) => [s.id, s])),
    [bioData],
  );
  const bioById = useMemo(
    () => Object.fromEntries((bioData?.artworks ?? []).map((a) => [a.id, a])),
    [bioData],
  );

  const workToBio = workBioMap?.workToBio ?? {};
  const handleWorkClick = (work) => {
    const mappedBioId = workToBio[work.id];
    const bioRecord = mappedBioId ? (bioById[mappedBioId] ?? null) : null;
    const era = eras.find((e) => e.id === work.worldview_period) ?? null;
    const sources = bioRecord?.sourceIds?.map((id) => sourceById[id]).filter(Boolean) ?? [];
    setActiveWork({ work, bioRecord, era, sources });
  };

  return (
    <Box component="main" sx={{ backgroundColor: TOKENS.bg.page }}>
      <WorldviewMiniMap eras={ eras } locale={ locale } />

      {/* Intro */}
      <Box id="intro" component="section" sx={{ py: { xs: 8, md: 12 }, scrollMarginTop: '64px' }}>
        <Container maxWidth="md">
          <Stack spacing={ 3 }>
            <Typography variant="overline" color="text.secondary">
              Damien Hirst · Worldview Timeline
            </Typography>
            <Typography variant="h1" component="h1" sx={{ maxWidth: 880 }}>
              { locale === 'ko' ? '세계관의 연대기' : 'Eras of a Worldview' }
            </Typography>
            <Typography variant="body1" color="text.secondary">
              { locale === 'ko'
                ? '아래로 스크롤하여 7개 시기의 사상적 발전을 따라가세요. 각 시기의 5축 가중치 평균과 작품·사건이 함께 노출됩니다.'
                : 'Scroll down to follow the conceptual development through seven eras. Each era surfaces the mean of 5-axis weights alongside works and events.' }
            </Typography>
          </Stack>
        </Container>
      </Box>

      {/* Era segments */}
      { eras.map((era) => {
        const eraWorks = (worksByEra[era.id] ?? []).slice(0, 4);
        const eraEvents = eventsByEra[era.id] ?? [];
        return (
          <EraSegment
            key={ era.id }
            era={ era }
            locale={ locale }
            left={
              <Stack spacing={ 3 }>
                <AxisWeightsBars axisWeights={ era.axisWeightsMean } />
                <RepresentativeWorks works={ eraWorks } locale={ locale } onSelect={ handleWorkClick } />
              </Stack>
            }
            right={
              <Stack spacing={ 3 }>
                <EraThesisHeadline thesis={ era.thesis } summary={ era.summary } locale={ locale } />
                <EraEventStrip events={ eraEvents } locale={ locale } />
              </Stack>
            }
          />
        );
      }) }

      {/* Bestiary section */}
      <Box id="bestiary" component="section" sx={{ py: { xs: 8, md: 12 }, scrollMarginTop: '64px' }}>
        <Container maxWidth="lg">
          <Stack spacing={ 4 }>
            <Stack spacing={ 1 }>
              <Typography variant="overline" color="text.secondary">
                { locale === 'ko' ? '생체 도감' : 'Bestiary' }
              </Typography>
              <Typography variant="h2">
                { locale === 'ko'
                  ? '작품에 사용된 동물·곤충·인간 유해'
                  : 'Animals, Insects, and Human Remains Used in the Work' }
              </Typography>
            </Stack>
            <BestiaryGrid speciesSummary={ bioData?.speciesSummary } locale={ locale } />
            <CaveatNote title="2012 Tate 한정 수치" severity="warning">
              { bioData?.caveats?.butterfly9000Scope }
            </CaveatNote>
            <CaveatNote title={ locale === 'ko' ? '검증 한계' : 'Verification limits' }>
              { bioData?.caveats?.unverifiedMillions }
            </CaveatNote>
          </Stack>
        </Container>
      </Box>

      {/* Methodology footer */}
      <Box id="methodology" component="footer" sx={{ py: { xs: 6, md: 8 }, borderTop: 1, borderColor: 'divider' }}>
        <Container maxWidth="md">
          <Stack spacing={ 2 }>
            <Typography variant="overline" color="text.secondary">
              Methodology
            </Typography>
            <Typography variant="body2" color="text.secondary">
              { `${locale === 'ko' ? '데이터 기준일' : 'As of'}: ${bioData?.caveats?.asOfDate ?? '—'}.` }
            </Typography>
            <Typography variant="caption" color="text.secondary">
              { bioData?.caveats?.noOfficialAggregate }
            </Typography>
          </Stack>
        </Container>
      </Box>

      <WorkDetailModal
        isOpen={ Boolean(activeWork) }
        onClose={ () => setActiveWork(null) }
        work={ activeWork?.work }
        bioRecord={ activeWork?.bioRecord }
        era={ activeWork?.era }
        sources={ activeWork?.sources ?? [] }
        locale={ locale }
      />
    </Box>
  );
}

/**
 * 5축 가중치 막대(라이트). 도넛 변형(KeywordAxisDonut)이 들어가기 전 임시 viz.
 *
 * Props:
 * @param {object} axisWeights - { MORTALITY, SYSTEM, FAITH, VALUE, FORM } 0~1 [Required]
 */
function AxisWeightsBars({ axisWeights }) {
  if (!axisWeights) return null;
  const axes = ['MORTALITY', 'SYSTEM', 'FAITH', 'VALUE', 'FORM'];
  return (
    <Stack spacing={ 1 }>
      <Typography variant="overline" color="text.secondary">
        Axis Weights · mean
      </Typography>
      { axes.map((key) => {
        const v = axisWeights[key] ?? 0;
        return (
          <Stack key={ key } direction="row" alignItems="center" spacing={ 1.5 }>
            <Typography variant="caption" sx={{ width: 84, fontFamily: 'monospace' }}>
              { key }
            </Typography>
            <Box sx={{ flex: 1, height: 6, backgroundColor: 'action.hover' }}>
              <Box
                sx={(theme) => ({
                  width: `${Math.round(v * 100)}%`,
                  height: '100%',
                  backgroundColor: theme.customAxes?.[key] ?? theme.palette.primary.main,
                })}
              />
            </Box>
            <Typography variant="caption" sx={{ width: 40, textAlign: 'right', fontFamily: 'monospace' }}>
              { v.toFixed(2) }
            </Typography>
          </Stack>
        );
      }) }
    </Stack>
  );
}

/**
 * 대표작 1~4점 카드. 클릭 시 상세 모달 트리거.
 *
 * Props:
 * @param {array} works - Work[] [Required]
 * @param {string} locale - 'ko' | 'en' [Optional, 기본값: 'ko']
 * @param {function} onSelect - 클릭 콜백 (work) => void [Required]
 */
function RepresentativeWorks({ works, locale = 'ko', onSelect }) {
  if (!works || works.length === 0) return null;
  return (
    <Stack spacing={ 1 }>
      <Typography variant="overline" color="text.secondary">
        { locale === 'ko' ? '대표작' : 'Representative Works' }
      </Typography>
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 1 }}>
        { works.map((w) => (
          <Box
            key={ w.id }
            role="button"
            tabIndex={ 0 }
            onClick={ () => onSelect?.(w) }
            onKeyDown={ (e) => {
              if (e.key === 'Enter' || e.key === ' ') onSelect?.(w);
            } }
            sx={{
              cursor: 'pointer',
              transition: 'outline-color 200ms',
              outline: 1,
              outlineColor: 'transparent',
              '&:hover': { outlineColor: 'primary.main' },
            }}
          >
            <WorkImage
              work={{ ...w, title: typeof w.title === 'object' ? (w.title[locale] ?? w.title.en) : w.title }}
              sx={{ width: '100%', aspectRatio: '3 / 4' }}
              showTitleInPlaceholder={ true }
            />
          </Box>
        )) }
      </Box>
    </Stack>
  );
}

function groupBy(arr, key) {
  const out = {};
  for (const x of arr) {
    const k = x?.[key];
    if (!k) continue;
    if (!out[k]) out[k] = [];
    out[k].push(x);
  }
  return out;
}
