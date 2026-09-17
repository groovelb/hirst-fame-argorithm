import { LoadingScreen } from './LoadingScreen.jsx';
import { StoryStage } from '../../stories/fixtures/StoryStage.jsx';

/**
 * LoadingScreen 스토리
 *
 * 도입 영상을 내려받는 동안 덮는 대기 화면. 마커 도판이 번갈아 뜨고 진행률이 올라간다.
 */
export default {
  title: 'Custom Component/6. Overlays & Modals/LoadingScreen',
  component: LoadingScreen,
  parameters: { layout: 'fullscreen' },
};

/** 진행률 38% */
export const Default = {
  render: () => (
    <StoryStage minHeight={ 520 } isFlush>
      <LoadingScreen visible progress={ 0.38 } />
    </StoryStage>
  ),
};

/** 거의 다 받은 상태 */
export const AlmostDone = {
  render: () => (
    <StoryStage minHeight={ 520 } isFlush>
      <LoadingScreen visible progress={ 0.96 } />
    </StoryStage>
  ),
};
