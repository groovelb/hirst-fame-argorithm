import { Box, Stack, Typography } from '@mui/material';

import { SpecimenCountBadge } from '../data-display/SpecimenCountBadge.jsx';

const SPECIES_LABEL_KO = {
  shark: '상어',
  sheep: '양',
  bovine: '소',
  pig: '돼지',
  zebra: '얼룩말',
  dove: '비둘기',
  cockerel: '수탉',
  butterfly_live_2012: '나비 (2012 Tate)',
  butterfly_paintings_cumulative: '나비 (회화 누적)',
  fly_maggot: '파리·구더기',
  fish_live: '어류 (생체)',
  human_remains: '인간 유해',
};

/**
 * SpeciesStatCard 컴포넌트
 *
 * 생체 도감의 종 카드. 종명 · 누적 작품 수 · 누적 개체 수 · 검증 배지 · 노트.
 *
 * Props:
 * @param {string} speciesKey - speciesSummary 객체의 키 (예: 'shark') [Required]
 * @param {object} summary - SpeciesSummary 1건 (species, artworkCount, individualCount, verified, note) [Required]
 * @param {string} locale - 'ko' | 'en' [Optional, 기본값: 'ko']
 * @param {string} taxaColor - 분류군 색(theme.customTaxa.*) [Optional]
 *
 * Example usage:
 * <SpeciesStatCard speciesKey="shark" summary={ summary.shark } taxaColor={ theme.customTaxa.fish } />
 */
export function SpeciesStatCard({ speciesKey, summary, locale = 'ko', taxaColor }) {
  if (!summary) return null;
  const label = locale === 'ko' ? (SPECIES_LABEL_KO[speciesKey] ?? speciesKey) : speciesKey;

  return (
    <Box
      sx={{
        p: 3,
        backgroundColor: 'background.paper',
        borderTop: 4,
        borderColor: taxaColor ?? 'primary.main',
        borderRight: 1,
        borderBottom: 1,
        borderLeft: 1,
        borderRightColor: 'divider',
        borderBottomColor: 'divider',
        borderLeftColor: 'divider',
      }}
    >
      <Stack spacing={ 2 }>
        <Stack spacing={ 0.5 }>
          <Typography variant="overline" color="text.secondary">
            { summary.species?.[0] ?? '' }
          </Typography>
          <Typography variant="h5" component="h3" sx={{ fontWeight: 800 }}>
            { label }
          </Typography>
        </Stack>

        <Stack direction="row" spacing={ 1 } flexWrap="wrap" useFlexGap>
          <SpecimenCountBadge count={ summary.individualCount } condition="deceased" locale={ locale } />
          <Typography variant="caption" color="text.secondary" sx={{ alignSelf: 'center' }}>
            { locale === 'ko'
              ? `누적 ${summary.artworkCount ?? '미공개'}점`
              : `across ${summary.artworkCount ?? '—'} works` }
          </Typography>
        </Stack>

        { summary.note && (
          <Typography variant="body2" color="text.secondary">
            { summary.note }
          </Typography>
        ) }
      </Stack>
    </Box>
  );
}
