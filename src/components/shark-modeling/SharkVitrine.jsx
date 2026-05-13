import { Suspense, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import {
  Environment,
  OrbitControls,
  useGLTF,
  ContactShadows,
  Html,
} from '@react-three/drei';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import { computeVitrineGeometry, DEFAULT_TANK_SIZE } from './vitrineDesign';
import SharkModel from './parts/SharkModel';
import VitrineShell from './parts/VitrineShell';
import VitrineGlass from './parts/VitrineGlass';
import VitrineLiquid from './parts/VitrineLiquid';
import VitrineInterior from './parts/VitrineInterior';

const DEFAULT_SHARK_URL = '/shark_hirst_pose.glb';

/**
 * SceneLoader - Suspense fallback (Canvas 내부에서만 사용)
 */
function SceneLoader() {
  return (
    <Html center>
      <CircularProgress size={32} sx={{ color: 'grey.400' }} />
    </Html>
  );
}

/**
 * SharkVitrine
 *
 * Damien Hirst의 'The Physical Impossibility of Death in the Mind of Someone Living'(1991)를
 * three.js / react-three-fiber로 재현한 인터랙티브 3D 컴포넌트.
 *
 * 구조 분리:
 *  - SharkModel: glTF 상어 + 부유 애니메이션
 *  - VitrineShell: 외부 흰색 프레임 + plinth
 *  - VitrineGlass: 얇은 유리 5면
 *  - VitrineLiquid: 포름알데히드 transmission 매질
 *  - VitrineInterior: 내부 strut/ribs/ridges/와이어 (Phase A~D에서 채워짐)
 *
 * 비례/재료는 vitrineDesign.js의 computeVitrineGeometry()가 단일 출처로 관리.
 *
 * Props:
 * @param {string} modelUrl - glTF/GLB 파일 경로 [Optional, 기본값: '/crysis_shark.glb']
 * @param {number} sharkScale - 상어 모델 스케일 [Optional, 기본값: 0.3]
 * @param {[number, number, number]} tankSize - 탱크 크기 [w, h, d] [Optional, 기본값: [6, 3, 2.4]]
 * @param {boolean} isAutoRotate - 카메라 자동 회전 여부 [Optional, 기본값: true]
 * @param {boolean} hasControls - OrbitControls 활성화 여부 [Optional, 기본값: true]
 * @param {string} background - 배경 색상 [Optional, 기본값: '#e8e8e3']
 * @param {string|number} height - 컨테이너 높이 [Optional, 기본값: 600]
 *
 * Example usage:
 * <SharkVitrine modelUrl="/crysis_shark.glb" />
 */
function SharkVitrine({
  modelUrl = DEFAULT_SHARK_URL,
  sharkScale = 0.3,
  tankSize = DEFAULT_TANK_SIZE,
  isAutoRotate = true,
  hasControls = true,
  background = '#e8e8e3',
  height = 600,
}) {
  /** 박스 크기로부터 모든 sub-dimension/재료 토큰 계산 (메모이즈) */
  const design = useMemo(() => computeVitrineGeometry(tankSize), [tankSize]);
  const [, h] = tankSize;

  return (
    <Box
      sx={{
        width: '100%',
        height,
        background,
        borderRadius: 1,
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      <Canvas
        camera={{ position: [7, 2.5, 7], fov: 35 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: false }}
        shadows
      >
        <color attach="background" args={[background]} />
        <fog attach="fog" args={[background, 12, 30]} />

        {/** 조명: 갤러리 천장광 + 상어 가시성 보강 */}
        <ambientLight intensity={0.7} />
        <directionalLight
          position={[4, 9, 6]}
          intensity={1.0}
          castShadow
          shadow-mapSize={[2048, 2048]}
        />
        <directionalLight position={[-6, 6, -2]} intensity={0.4} />
        {/** 상어 정면을 비추는 fill light (액체 청록색에 묻히지 않도록) */}
        <pointLight position={[0, 0.5, 4]} intensity={0.5} color={'#ffffff'} distance={10} />
        {/** 탱크 내부 하단 청록 림 */}
        <pointLight position={[0, -0.5, 0]} intensity={0.2} color={'#7fd4c6'} distance={5} />

        <Suspense fallback={<SceneLoader />}>
          <VitrineShell design={design} />
          <VitrineInterior design={design} />
          <SharkModel url={modelUrl} scale={sharkScale} />
          <VitrineLiquid design={design} />
          <VitrineGlass design={design} />
          <Environment preset="studio" />
        </Suspense>

        <ContactShadows
          position={[0, -h / 2 - design.plinth.height - 0.05, 0]}
          opacity={0.22}
          scale={14}
          blur={3.5}
          far={5}
        />

        {hasControls && (
          <OrbitControls
            enablePan={false}
            enableZoom
            minDistance={5}
            maxDistance={16}
            minPolarAngle={Math.PI / 4}
            maxPolarAngle={Math.PI / 2.1}
            autoRotate={isAutoRotate}
            autoRotateSpeed={0.4}
          />
        )}
      </Canvas>
    </Box>
  );
}

/** glTF 프리로드 - 첫 렌더 지연 감소 */
useGLTF.preload(DEFAULT_SHARK_URL);

export default SharkVitrine;
