import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import Box from '@mui/material/Box';
import { DEFAULT_TANK_SIZE } from './vitrineDesign';
import SharkVitrineScene, { DEFAULT_SHARK_URL } from './SharkVitrineScene';

/**
 * SharkVitrine
 *
 * Damien Hirst의 'The Physical Impossibility of Death in the Mind of Someone Living'(1991)을
 * three.js / react-three-fiber로 재현한 **독립 사용 가능한** 인터랙티브 3D 컴포넌트.
 *
 * background='transparent' 시 Canvas alpha 활성 + scene background/fog 제거 →
 * 외부 페이지 배경이 그대로 비침 (LandingPage Hero에서 사용).
 *
 * scroll-driven build-up: `progress` MotionValue(0~1)를 받아 내부 part에 전달.
 *   - 0.2~0.7: shell+glass scaleY 0→1 (bottom-pivot)
 *   - 0.5~1.0: liquid scaleY 0→1
 *   - 0.5~1.0: shark rotation.y π/2 → 0 (측면 → 정면)
 *
 * Props:
 * @param {string} modelUrl - glTF/GLB 파일 경로 [Optional, 기본값: '/crysis_shark.glb']
 * @param {number} sharkScale - 상어 모델 스케일 [Optional, 기본값: 0.3]
 * @param {[number, number, number]} tankSize - 탱크 크기 [w, h, d] [Optional, 기본값: [6, 3, 2.4]]
 * @param {boolean} isFloating - 상어 부유 애니메이션 [Optional, 기본값: true]
 * @param {boolean} isAutoRotate - 카메라 자동 회전 [Optional, 기본값: false]
 * @param {boolean} hasControls - OrbitControls 활성화 [Optional, 기본값: true]
 * @param {string} background - 배경 색상 ('transparent' 가능) [Optional, 기본값: '#e8e8e3']
 * @param {string|number} height - 컨테이너 높이 [Optional, 기본값: 600]
 * @param {[number, number, number]} cameraPosition - 초기 카메라 위치 [Optional, 기본값: [7, 2.5, 7]]
 * @param {number} cameraFov - 카메라 FOV [Optional, 기본값: 35]
 * @param {Object} progress - framer-motion MotionValue (0~1). scroll-driven build-up용 [Optional]
 * @param {'always'|'demand'|'never'} frameloop - R3F 렌더 루프 모드. Hero 종료 후 'never'로 줘서 GPU 점유 차단 가능 [Optional, 기본값: 'always']
 *
 * Example usage:
 * <SharkVitrine />
 *
 * <SharkVitrine
 *   background="transparent"
 *   cameraPosition={[10, 0, 0]}
 *   progress={ scrollYProgress }
 *   hasControls={ false }
 * />
 */
function SharkVitrine({
  modelUrl = DEFAULT_SHARK_URL,
  sharkScale = 0.3,
  tankSize = DEFAULT_TANK_SIZE,
  isFloating = true,
  isAutoRotate = false,
  hasControls = true,
  background = '#e8e8e3',
  height = 600,
  cameraPosition = [7, 2.5, 7],
  cameraFov = 35,
  progress,
  frameloop = 'always',
}) {
  const isTransparent = background === 'transparent';

  return (
    <Box
      sx={ {
        width: '100%',
        height,
        background: isTransparent ? 'transparent' : background,
        borderRadius: 1,
        overflow: 'hidden',
        position: 'relative',
      } }
    >
      <Canvas
        camera={ { position: cameraPosition, fov: cameraFov } }
        dpr={ [1, 2] }
        gl={ { antialias: true, alpha: isTransparent } }
        shadows
        frameloop={ frameloop }
      >
        <SharkVitrineScene
          modelUrl={ modelUrl }
          sharkScale={ sharkScale }
          tankSize={ tankSize }
          isFloating={ isFloating }
          background={ background }
          progress={ progress }
          cameraPosition={ cameraPosition }
          cameraFov={ cameraFov }
        />

        { hasControls && (
          <OrbitControls
            enablePan={ false }
            enableZoom
            minDistance={ 5 }
            maxDistance={ 16 }
            minPolarAngle={ Math.PI / 4 }
            maxPolarAngle={ Math.PI / 2.1 }
            autoRotate={ isAutoRotate }
            autoRotateSpeed={ 0.4 }
          />
        ) }
      </Canvas>
    </Box>
  );
}

export default SharkVitrine;
