import { EraEventStrip } from './EraEventStrip.jsx';
import { StoryStage } from '../../stories/fixtures/StoryStage.jsx';
import eventsData from '../../data/hirst/hirst_events.json';

/**
 * EraEventStrip 스토리
 *
 * 연대기 안의 사건을 좌에서 우로 훑는 띠. 현재 랜딩에서는 도달하지 않는다.
 */
export default {
  title: 'Custom Component/7. Era (미연결)/EraEventStrip',
  component: EraEventStrip,
  parameters: { layout: 'padded' },
};

/** 첫 연대기에 속한 사건들 */
export const Default = {
  render: () => (
    <StoryStage minHeight={ 240 }>
      <EraEventStrip
        events={ eventsData.events.filter((e) => e.worldview_period === 'WV_PEDAGOGY') }
        locale="ko"
      />
    </StoryStage>
  ),
};
