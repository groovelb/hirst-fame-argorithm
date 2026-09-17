import { BestiaryGrid } from './BestiaryGrid.jsx';
import { StoryStage } from '../../stories/fixtures/StoryStage.jsx';
import bioData from '../../data/hirst/hirst-bio-specimen-data.js';

/**
 * BestiaryGrid 스토리
 *
 * 종별 집계 카드를 격자로 편다. 현재 화면은 SpecimenInfographicSection 을 쓰고
 * 이 격자는 도달하지 않는다.
 */
export default {
  title: 'Custom Component/7. Era (미연결)/BestiaryGrid',
  component: BestiaryGrid,
  parameters: { layout: 'padded' },
};

/** 종 12개 전량 */
export const Default = {
  render: () => (
    <StoryStage>
      <BestiaryGrid speciesSummary={ bioData.speciesSummary } locale="ko" />
    </StoryStage>
  ),
};
