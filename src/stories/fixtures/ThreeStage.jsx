import Box from '@mui/material/Box';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';

/**
 * ThreeStage
 *
 * 3D 파트 컴포넌트는 `<Canvas>` 안에서만 그려진다. 이 래퍼가 캔버스와
 * 기본 조명, 카메라, 궤도 제어를 붙여 파트 하나만 떼어 볼 수 있게 한다.
 *
 * Props:
 * @param {React.ReactNode} children - 캔버스 안에 둘 3D 노드 [Required]
 * @param {number} height - 캔버스 높이 px [Optional, 기본값: 520]
 * @param {Array} cameraPosition - 카메라 위치 [Optional, 기본값: [7, 2.5, 7]]
 *
 * Example usage:
 * <ThreeStage><VitrineShell design={ design } /></ThreeStage>
 */
function ThreeStage({ children, height = 520, cameraPosition = [7, 2.5, 7] }) {
  return (
    <Box sx={ { backgroundColor: 'background.paper', height } }>
      <Canvas camera={ { position: cameraPosition, fov: 35 } } dpr={ [1, 2] }>
        <ambientLight intensity={ 0.9 } />
        <directionalLight position={ [6, 8, 6] } intensity={ 1.2 } />
        <directionalLight position={ [-6, 4, -4] } intensity={ 0.5 } />
        { children }
        <OrbitControls enablePan={ false } />
      </Canvas>
    </Box>
  );
}

export { ThreeStage };
