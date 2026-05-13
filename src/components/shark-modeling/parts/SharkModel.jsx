import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import { RENDER_ORDER } from '../vitrineDesign';

/**
 * SharkModel - glTF 상어 모델 + 부유 wobble.
 *
 * NOTE: scroll-driven 회전은 SharkVitrineScene의 root group이 담당.
 *   여기서는 model 자체 회전 없음 (base rotation.y = 0, glb default 방향).
 *   isFloating=true면 미세 sin 흔들림(position.y, rotation.z, rotation.y wobble)만 적용.
 *
 * Props:
 * @param {string} url - glTF/GLB 파일 경로 [Required]
 * @param {number} scale - 모델 스케일 [Optional, 기본값: 0.3]
 * @param {boolean} isFloating - 부유 wobble 활성화 [Optional, 기본값: true]
 *
 * Example usage:
 * <SharkModel url="/shark.glb" scale={ 0.3 } />
 */
function SharkModel({ url, scale = 0.3, isFloating = true }) {
  const groupRef = useRef();
  const { scene } = useGLTF(url);

  useFrame((state) => {
    if (!isFloating || !groupRef.current) return;
    const t = state.clock.getElapsedTime();
    /** 천천히 떠 있는 미세 부유 + 좌우 wobble.
        base rotation.y = π/2 → 상어 head가 +X 방향.
        카메라 [0, 0, 9]에서 보면 측면(옆모습)이 정확히 보임.
        Root 회전은 SharkVitrineScene의 RotatingRig가 담당. */
    groupRef.current.position.y = Math.sin(t * 0.5) * 0.05;
    groupRef.current.rotation.z = Math.sin(t * 0.3) * 0.02;
    groupRef.current.rotation.y = Math.PI / 2 + Math.sin(t * 0.2) * 0.05;
  });

  return (
    <group
      ref={ groupRef }
      scale={ scale }
      rotation={ [0, Math.PI / 2, 0] }
      renderOrder={ RENDER_ORDER.shark }
    >
      <primitive object={ scene } />
    </group>
  );
}

export default SharkModel;
