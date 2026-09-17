import { TigerSharkModel } from './TigerSharkModel.jsx';
import { ThreeStage } from '../../stories/fixtures/ThreeStage.jsx';

/**
 * TigerSharkModel 스토리
 *
 * 외부 모델 없이 코드로 만든 타이거 상어. 체형 비례를 실측 자료에서 가져왔다.
 */
export default {
  title: 'Custom Component/8. Shark 3D (미연결)/TigerSharkModel',
  component: TigerSharkModel,
  parameters: { layout: 'fullscreen' },
};

/** 랜드마크와 이빨 표시 */
export const Default = {
  render: () => (
    <ThreeStage cameraPosition={ [0, 1.5, 9] }>
      <TigerSharkModel showLandmarks showTeeth />
    </ThreeStage>
  ),
};

/** 와이어프레임 */
export const Wireframe = {
  render: () => (
    <ThreeStage cameraPosition={ [0, 1.5, 9] }>
      <TigerSharkModel showWireframe showLandmarks={ false } showTeeth={ false } />
    </ThreeStage>
  ),
};

/** 줄무늬 가이드 */
export const PatternGuides = {
  render: () => (
    <ThreeStage cameraPosition={ [0, 1.5, 9] }>
      <TigerSharkModel showPattern showLandmarks={ false } />
    </ThreeStage>
  ),
};
