import { BandLegend } from './BandLegend.jsx';
import { StoryStage } from '../../stories/fixtures/StoryStage.jsx';

/**
 * BandLegend 스토리
 *
 * 세계관 다섯 밴드의 범례. 활성 밴드 하나만 강조된다.
 */
export default {
  title: 'Custom Component/2. Timeline Canvas/BandLegend',
  component: BandLegend,
  parameters: { layout: 'fullscreen' },
};

/** 강조 없음 */
export const Default = {
  render: () => (
    <StoryStage minHeight={ 320 }>
      <BandLegend activeBandId={ null } />
    </StoryStage>
  ),
};

/** MORTALITY 밴드 강조 */
export const ActiveMortality = {
  render: () => (
    <StoryStage minHeight={ 320 }>
      <BandLegend activeBandId="MORTALITY" />
    </StoryStage>
  ),
};
