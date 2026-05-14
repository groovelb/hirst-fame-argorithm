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

export const DEFAULT_SHARK_URL = '/crysis_shark.glb';

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
    /** Phase A (0 ~ 0.4): 회전 진행 0 → -π/2. 그 이후 정지. */
    const p = Math.max(0, Math.min(1, pVal / 0.4));
    groupRef.current.rotation.y = -p * (Math.PI / 2);
  });
  return <group ref={ groupRef }>{ children }</group>;
}

/**
 * VitrineGroup - 수조 전체(frame+plinth+gap+glass+liquid+interior+shadow)를 통째로 묶어
 *   0.5~0.9 구간에서 bottom-pivot scaleY 0→1로 등장.
 *   pivot은 plinth bottom y. scale=0이면 점으로 압축 → invisible. (회전 phase 동안 어떤 부분도 안 보임)
 *
 *   position.y = PIVOT_Y * (1 - s)  → s=0일 때 모든 자식이 (any.y → PIVOT_Y)로 압축, s=1일 때 원위치
 */
function VitrineGroup({ progress, tankSize, plinthHeight, children }) {
  const groupRef = useRef();
  const [, h] = tankSize;
  const PIVOT_Y = -h / 2 - plinthHeight;
  useFrame(() => {
    if (!groupRef.current) return;
    const pVal = progress?.get?.() ?? 1;
    /** Phase C (0.65~0.9)에만 수조+물 등장. 그 전엔 group invisible (회전·zoom phase). */
    if (pVal < 0.65) {
      groupRef.current.visible = false;
      return;
    }
    groupRef.current.visible = true;
    const s = Math.max(0, Math.min(1, (pVal - 0.65) / 0.25));
    groupRef.current.scale.y = s;
    groupRef.current.position.y = PIVOT_Y * (1 - s);
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
 * @param {string} modelUrl [Optional, 기본값: '/crysis_shark.glb']
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

  /** Phase B (0.4~0.65): camera zoom-in. z 11 → 6. 회전과 분리, 수조 등장 전. */
  useFrame(() => {
    if (!camera || !progress || !cameraPosition) return;
    const pVal = progress.get?.() ?? 0;
    const p = Math.max(0, Math.min(1, (pVal - 0.4) / 0.25));
    const zStart = cameraPosition[2];
    const zEnd = 6;
    const z = zStart + (zEnd - zStart) * p;
    camera.position.set(cameraPosition[0], cameraPosition[1], z);
    camera.lookAt(0, 0, 0);
    camera.updateProjectionMatrix();
  });

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

      {/* Visual center 보정 — 박스+plinth+ContactShadows 묶음의 mid-Y가 origin에 맞도록.
          box top = +h/2 = +1.5
          ContactShadows position y = -h/2 - plinth.height - 0.05 = -1.97 (그림자 fade로 더 아래)
          midpoint ≈ (1.5 + -1.97) / 2 = -0.235 → +0.235 offset 적용. */}
      <group position={ [0, (design.plinth.height + 0.05) / 2 + 0.025, 0] }>
        <Suspense fallback={ <SceneLoader /> }>
          <RotatingRig progress={ progress }>
            {/* 회전 phase에는 SharkModel만 보이고 나머지(수조+물+plinth+그림자) 전부 invisible */}
            <SharkModel url={ modelUrl } scale={ sharkScale } isFloating={ isFloating } />

            <VitrineGroup progress={ progress } tankSize={ tankSize } plinthHeight={ design.plinth.height }>
              <VitrineShell design={ design } />
              <VitrineInterior design={ design } />
              <VitrineLiquid design={ design } />
              <VitrineGlass design={ design } />
              <ContactShadows
                position={ [0, -h / 2 - design.plinth.height - 0.05, 0] }
                opacity={ 0.22 }
                scale={ 14 }
                blur={ 3.5 }
                far={ 5 }
              />
            </VitrineGroup>
          </RotatingRig>
          <Environment preset="studio" />
        </Suspense>
      </group>
    </>
  );
}

/** glTF 프리로드 */
useGLTF.preload(DEFAULT_SHARK_URL);

export default SharkVitrineScene;
