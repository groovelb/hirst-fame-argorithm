import VitrineGlass from './VitrineGlass.jsx';
import { computeVitrineGeometry, DEFAULT_TANK_SIZE } from '../vitrineDesign.js';
import { ThreeStage } from '../../../stories/fixtures/ThreeStage.jsx';

/**
 * VitrineGlass 스토리
 *
 * 유리 다섯 면. 얇은 투과 시트로 굴절률 1.52를 쓴다.
 * `computeVitrineGeometry([w, h, d])` 가 만든 설계 객체 하나를 받는다.
 */
export default {
  title: 'Custom Component/8. Shark 3D (미연결)/VitrineGlass',
  component: VitrineGlass,
  parameters: { layout: 'fullscreen' },
};

/** 기본 박스 6 x 3 x 2.4 */
export const Default = {
  render: () => (
    <ThreeStage>
      <VitrineGlass design={ computeVitrineGeometry(DEFAULT_TANK_SIZE) } />
    </ThreeStage>
  ),
};

/** 더 작고 깊은 박스. 두께와 간격이 비례로 따라온다 */
export const CompactTank = {
  render: () => (
    <ThreeStage cameraPosition={ [5, 2, 5] }>
      <VitrineGlass design={ computeVitrineGeometry([4, 2.4, 2]) } />
    </ThreeStage>
  ),
};
