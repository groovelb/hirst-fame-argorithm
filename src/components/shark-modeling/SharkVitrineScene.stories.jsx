import SharkVitrineScene from './SharkVitrineScene.jsx';
import { ThreeStage } from '../../stories/fixtures/ThreeStage.jsx';

/**
 * SharkVitrineScene 스토리
 *
 * 캔버스 없이 3D 씬만 담은 부분. 외부 캔버스에 임베드할 때 쓴다.
 * SharkVitrine 은 이 씬을 Canvas 와 OrbitControls 로 감싼 것이다.
 */
export default {
  title: 'Custom Component/8. Shark 3D (미연결)/SharkVitrineScene',
  component: SharkVitrineScene,
  parameters: { layout: 'fullscreen' },
};

/** 기본 탱크 크기 */
export const Default = {
  render: () => (
    <ThreeStage height={ 560 }>
      <SharkVitrineScene background="transparent" sharkScale={ 0.3 } />
    </ThreeStage>
  ),
};
