import { ReferencePlanes } from './ReferencePlanes.jsx';
import { ThreeStage } from '../../stories/fixtures/ThreeStage.jsx';

/**
 * ReferencePlanes 스토리
 *
 * 모델링 참고 사진을 3D 공간의 평면에 붙인다. 측면, 상면, 정면 뷰마다 다른 판이 뜬다.
 */
export default {
  title: 'Custom Component/8. Shark 3D (미연결)/ReferencePlanes',
  component: ReferencePlanes,
  parameters: { layout: 'fullscreen' },
};

/** 측면 참고판 */
export const Default = {
  render: () => (
    <ThreeStage cameraPosition={ [0, 1.5, 10] }>
      <ReferencePlanes activeView="side" visible />
    </ThreeStage>
  ),
};

/** 상면 참고판 */
export const TopView = {
  render: () => (
    <ThreeStage cameraPosition={ [0, 10, 0.01] }>
      <ReferencePlanes activeView="top" visible />
    </ThreeStage>
  ),
};
