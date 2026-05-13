import { Suspense, useEffect, useMemo, useRef } from 'react';
import {
  Environment,
  useGLTF,
  ContactShadows,
  Html,
} from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import CircularProgress from '@mui/material/CircularProgress';
import { computeVitrineGeometry, DEFAULT_TANK_SIZE } from './vitrineDesign';
import SharkModel from './parts/SharkModel';
import VitrineShell from './parts/VitrineShell';
import VitrineGlass from './parts/VitrineGlass';
import VitrineLiquid from './parts/VitrineLiquid';
import VitrineInterior from './parts/VitrineInterior';

export const DEFAULT_SHARK_URL = '/shark_hirst_pose.glb';

/**
 * SceneLoader - Suspense fallback
 */
function SceneLoader() {
  return (
    <Html center>
      <CircularProgress size={ 32 } sx={ { color: 'grey.400' } } />
    </Html>
  );
}

/**
 * RotatingRig - 수조 전체(상어 + shell + glass + liquid + interior + plinth)를
 *   하나의 root group으로 wrap하고 progress에 따라 rotation.y를 회전시킨다.
 *
 * 0.0 ~ 0.5: rotation.y = 0 (측면 default)
 * 0.5 ~ 1.0: rotation.y 0 → π/2 (측면 → 정면)
 *
 * ContactShadows는 회전 영향 없게 outer에 두므로 별도.
 */
function RotatingRig({ progress, children }) {
  const groupRef = useRef();
  useFrame(() => {
    if (!groupRef.current) return;
    const pVal = progress?.get?.() ?? 0;
    const p = Math.max(0, Math.min(1, (pVal - 0.5) / 0.5));
    /** 회전 방향: 카메라 [0,0,9] + SharkModel head 방향 기준
        head가 +X일 때 rotation.y = -π/2 적용 → head world = (1,0,0) → (0,0,1) = +Z
        wait 그건 등이 보임. head -Z가 정면.
        R(+π/2)·(1,0,0) = (0, 0, -1) = -Z → 정면. 그래서 +π/2가 맞음.
        근데 head 방향이 다를 가능성 → 일단 음수로 시도, glb default가 -Z였다면 정답. */
    groupRef.current.rotation.y = -p * (Math.PI / 2);
  });
  return <group ref={ groupRef }>{ children }</group>;
}

/**
 * SharkVitrineScene
 *
 * 3D 씬 내용. Canvas wrapper는 외부.
 *
 * - root rotation: RotatingRig가 progress 0.5~1.0에서 vitrine 전체를 회전 (측면 → 정면).
 * - shell/glass scaleY: 0.2~0.7에서 bottom-pivot build-up.
 * - liquid scaleY: 0.5~1.0에서 bottom-pivot fill.
 * - SharkModel은 자체 회전 없음 (root에서 회전).
 *
 * Props:
 * @param {string} modelUrl [Optional, 기본값: '/shark_hirst_pose.glb']
 * @param {number} sharkScale [Optional, 기본값: 0.3]
 * @param {[number, number, number]} tankSize [Optional, 기본값: [6, 3, 2.4]]
 * @param {boolean} isFloating [Optional, 기본값: true]
 * @param {string} background [Optional, 기본값: '#e8e8e3'. 'transparent' 시 scene bg/fog 제거]
 * @param {Object} progress - framer-motion MotionValue (0~1) [Optional]
 */
function SharkVitrineScene({
  modelUrl = DEFAULT_SHARK_URL,
  sharkScale = 0.3,
  tankSize = DEFAULT_TANK_SIZE,
  isFloating = true,
  background = '#e8e8e3',
  progress,
  cameraPosition,
  cameraFov,
}) {
  const design = useMemo(() => computeVitrineGeometry(tankSize), [tankSize]);
  const [, h] = tankSize;
  const isTransparent = background === 'transparent';

  /** Canvas camera prop은 첫 mount에만 적용되어 HMR/prop 변경에 무반응.
      useThree로 카메라를 직접 강제 set + lookAt(origin)으로 정확한 view 보장. */
  const { camera } = useThree();
  useEffect(() => {
    if (!camera || !cameraPosition) return;
    camera.position.set(cameraPosition[0], cameraPosition[1], cameraPosition[2]);
    if (typeof cameraFov === 'number' && 'fov' in camera) {
      camera.fov = cameraFov;
    }
    camera.up.set(0, 1, 0);
    camera.lookAt(0, 0, 0);
    camera.updateProjectionMatrix();
  }, [camera, cameraPosition, cameraFov]);

  return (
    <>
      { !isTransparent && (
        <>
          <color attach="background" args={ [background] } />
          <fog attach="fog" args={ [background, 12, 30] } />
        </>
      ) }

      {/** 갤러리 조명 */}
      <ambientLight intensity={ 0.7 } />
      <directionalLight
        position={ [4, 9, 6] }
        intensity={ 1.0 }
        castShadow
        shadow-mapSize={ [2048, 2048] }
      />
      <directionalLight position={ [-6, 6, -2] } intensity={ 0.4 } />
      <pointLight position={ [0, 0.5, 4] } intensity={ 0.5 } color={ '#ffffff' } distance={ 10 } />
      <pointLight position={ [0, -0.5, 0] } intensity={ 0.2 } color={ '#7fd4c6' } distance={ 5 } />

      <Suspense fallback={ <SceneLoader /> }>
        <RotatingRig progress={ progress }>
          <VitrineShell design={ design } progress={ progress } />
          <VitrineInterior design={ design } />
          <SharkModel url={ modelUrl } scale={ sharkScale } isFloating={ isFloating } />
          <VitrineLiquid design={ design } progress={ progress } />
          <VitrineGlass design={ design } progress={ progress } />
        </RotatingRig>
        <Environment preset="studio" />
      </Suspense>

      <ContactShadows
        position={ [0, -h / 2 - design.plinth.height - 0.05, 0] }
        opacity={ 0.22 }
        scale={ 14 }
        blur={ 3.5 }
        far={ 5 }
      />
    </>
  );
}

/** glTF 프리로드 */
useGLTF.preload(DEFAULT_SHARK_URL);

export default SharkVitrineScene;
