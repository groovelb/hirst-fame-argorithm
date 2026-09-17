import SharkModel from './SharkModel.jsx';
import { ThreeStage } from '../../../stories/fixtures/ThreeStage.jsx';

/**
 * SharkModel 스토리
 *
 * 비트린 없이 상어 모델만. `/crysis_shark.glb` 를 불러 부유 움직임을 준다.
 */
export default {
  title: 'Custom Component/8. Shark 3D (미연결)/SharkModel',
  component: SharkModel,
  parameters: { layout: 'fullscreen' },
};

/** 부유 움직임 있음 */
export const Default = {
  render: () => (
    <ThreeStage>
      <SharkModel url="/crysis_shark.glb" scale={ 0.3 } isFloating />
    </ThreeStage>
  ),
};

/** 포즈를 굳힌 모델 */
export const PosedStill = {
  render: () => (
    <ThreeStage>
      <SharkModel url="/shark_hirst_pose.glb" scale={ 0.3 } isFloating={ false } />
    </ThreeStage>
  ),
};
