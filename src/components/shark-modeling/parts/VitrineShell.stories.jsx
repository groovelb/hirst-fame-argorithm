import VitrineShell from './VitrineShell.jsx';
import { computeVitrineGeometry, DEFAULT_TANK_SIZE } from '../vitrineDesign.js';
import { ThreeStage } from '../../../stories/fixtures/ThreeStage.jsx';

/**
 * VitrineShell 스토리
 *
 * 외부 흰색 프레임과 받침대. 박스 크기 하나로 두께와 간격이 파생된다.
 * `computeVitrineGeometry([w, h, d])` 가 만든 설계 객체 하나를 받는다.
 */
export default {
  title: 'Custom Component/8. Shark 3D (미연결)/VitrineShell',
  component: VitrineShell,
  parameters: { layout: 'fullscreen' },
};

/** 기본 박스 6 x 3 x 2.4 */
export const Default = {
  render: () => (
    <ThreeStage>
      <VitrineShell design={ computeVitrineGeometry(DEFAULT_TANK_SIZE) } />
    </ThreeStage>
  ),
};

/** 더 작고 깊은 박스. 두께와 간격이 비례로 따라온다 */
export const CompactTank = {
  render: () => (
    <ThreeStage cameraPosition={ [5, 2, 5] }>
      <VitrineShell design={ computeVitrineGeometry([4, 2.4, 2]) } />
    </ThreeStage>
  ),
};
