import { WorldviewMiniMap } from './WorldviewMiniMap.jsx';
import { StoryStage } from '../../stories/fixtures/StoryStage.jsx';
import erasData from '../../data/hirst/hirst_eras.json';

/**
 * WorldviewMiniMap 스토리
 *
 * 연대기 7구획의 앵커 내비. 현재 랜딩에서는 도달하지 않는다.
 */
export default {
  title: 'Custom Component/7. Era (미연결)/WorldviewMiniMap',
  component: WorldviewMiniMap,
  parameters: { layout: 'fullscreen' },
};

/** 연대기 7개 */
export const Default = {
  render: () => (
    <StoryStage minHeight={ 420 }>
      <WorldviewMiniMap eras={ erasData.eras } locale="ko" />
    </StoryStage>
  ),
};
