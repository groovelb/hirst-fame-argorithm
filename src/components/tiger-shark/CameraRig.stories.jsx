import { useRef } from 'react';
import { OrbitControls } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import Box from '@mui/material/Box';
import { CameraRig } from './CameraRig.jsx';
import { TigerSharkModel } from './TigerSharkModel.jsx';

/**
 * CameraRig 스토리
 *
 * 뷰 이름을 받아 카메라를 그 자리로 옮긴다. 궤도 제어 ref 를 함께 받아
 * 시점 전환 후 타깃까지 맞춘다. 캔버스 안에서만 동작한다.
 */
export default {
  title: 'Custom Component/8. Shark 3D (미연결)/CameraRig',
  component: CameraRig,
  parameters: { layout: 'fullscreen' },
};

/** 뷰 하나를 고정한 장면 */
function RigDemo({ view }) {
  const controlsRef = useRef(null);
  return (
    <Box sx={ { backgroundColor: 'background.paper', height: 520 } }>
      <Canvas camera={ { position: [0, 1.5, 9], fov: 35 } } dpr={ [1, 2] }>
        <ambientLight intensity={ 0.9 } />
        <directionalLight position={ [6, 8, 6] } intensity={ 1.2 } />
        <TigerSharkModel showLandmarks={ false } showTeeth />
        <CameraRig view={ view } controlsRef={ controlsRef } />
        <OrbitControls ref={ controlsRef } enablePan={ false } />
      </Canvas>
    </Box>
  );
}

export const Default = {
  render: () => <RigDemo view="side" />,
};

export const TopView = {
  render: () => <RigDemo view="top" />,
};
