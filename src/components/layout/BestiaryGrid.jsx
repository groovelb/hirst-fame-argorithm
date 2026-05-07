import { Box } from '@mui/material';
import { useTheme } from '@mui/material/styles';

import { SpeciesStatCard } from '../card/SpeciesStatCard.jsx';

const TAXA_BY_SPECIES = {
  shark: 'fish',
  sheep: 'mammal',
  bovine: 'mammal',
  pig: 'mammal',
  zebra: 'mammal',
  dove: 'bird',
  cockerel: 'bird',
  butterfly_live_2012: 'insect',
  butterfly_paintings_cumulative: 'insect',
  fly_maggot: 'insect',
  fish_live: 'fish',
  human_remains: 'human',
};

/**
 * BestiaryGrid 컴포넌트
 *
 * 생체 도감의 종 카드 그리드. 분류군별 색 코드를 자동 부여.
 *
 * Props:
 * @param {object} speciesSummary - hirst-bio-specimen-data.js 의 speciesSummary 객체 [Required]
 * @param {string} locale - 'ko' | 'en' [Optional, 기본값: 'ko']
 *
 * Example usage:
 * <BestiaryGrid speciesSummary={ speciesSummary } locale="ko" />
 */
export function BestiaryGrid({ speciesSummary, locale = 'ko' }) {
  const theme = useTheme();
  const entries = Object.entries(speciesSummary ?? {});

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: {
          xs: '1fr',
          sm: 'repeat(2, 1fr)',
          md: 'repeat(3, 1fr)',
          lg: 'repeat(4, 1fr)',
        },
        gap: 2,
      }}
    >
      { entries.map(([key, summary]) => {
        const taxaKey = TAXA_BY_SPECIES[key] ?? 'human';
        const taxaColor = theme.customTaxa?.[taxaKey];
        return (
          <SpeciesStatCard
            key={ key }
            speciesKey={ key }
            summary={ summary }
            locale={ locale }
            taxaColor={ taxaColor }
          />
        );
      }) }
    </Box>
  );
}
