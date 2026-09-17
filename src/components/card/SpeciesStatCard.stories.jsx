import Grid from '@mui/material/Grid';
import { SpeciesStatCard } from './SpeciesStatCard.jsx';
import { StoryStage } from '../../stories/fixtures/StoryStage.jsx';
import bioData from '../../data/hirst/hirst-bio-specimen-data.js';

/**
 * SpeciesStatCard 스토리
 *
 * 종 하나의 누적 집계 카드. 작품 수, 개체 수, 검증 배지가 한 장에 온다.
 */
export default {
  title: 'Custom Component/7. Era (미연결)/SpeciesStatCard',
  component: SpeciesStatCard,
  parameters: { layout: 'padded' },
};

/** 앞의 종 여섯 개 */
export const Default = {
  render: () => (
    <StoryStage>
      <Grid container spacing={ 2 }>
        { Object.entries(bioData.speciesSummary).slice(0, 6).map(([key, summary]) => (
          <Grid key={ key } size={ { xs: 12, sm: 6, md: 4 } }>
            <SpeciesStatCard speciesKey={ key } summary={ summary } locale="ko" />
          </Grid>
        )) }
      </Grid>
    </StoryStage>
  ),
};

/** 개체 수가 공개되지 않은 종 */
export const Unverified = {
  render: () => (
    <StoryStage>
      <SpeciesStatCard
        speciesKey="butterfly_paintings_cumulative"
        summary={ bioData.speciesSummary.butterfly_paintings_cumulative }
        locale="ko"
      />
    </StoryStage>
  ),
};
