import VitrineInterior from './VitrineInterior.jsx';
import { computeVitrineGeometry, DEFAULT_TANK_SIZE } from '../vitrineDesign.js';
import { ThreeStage } from '../../../stories/fixtures/ThreeStage.jsx';

/**
 * VitrineInterior 스토리
 *
 * 내부 철골 케이지. 네 모서리 기둥과 천장 리브, 바닥 능선, 볼트 격자.
 * `computeVitrineGeometry([w, h, d])` 가 만든 설계 객체 하나를 받는다.
 */
export default {
  title: 'Custom Component/8. Shark 3D (미연결)/VitrineInterior',
  component: VitrineInterior,
  parameters: { layout: 'fullscreen' },
};

/** 기본 박스 6 x 3 x 2.4 */
export const Default = {
  render: () => (
    <ThreeStage>
      <VitrineInterior design={ computeVitrineGeometry(DEFAULT_TANK_SIZE) } />
    </ThreeStage>
  ),
};

/** 더 작고 깊은 박스. 두께와 간격이 비례로 따라온다 */
export const CompactTank = {
  render: () => (
    <ThreeStage cameraPosition={ [5, 2, 5] }>
      <VitrineInterior design={ computeVitrineGeometry([4, 2.4, 2]) } />
    </ThreeStage>
  ),
};
