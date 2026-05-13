import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import { RENDER_ORDER } from '../vitrineDesign';

/**
 * SharkModel - glTF 상어 모델 로더 + 부유 애니메이션
 *
 * Props:
 * @param {string} url - glTF/GLB 파일 경로 [Required]
 * @param {number} scale - 모델 스케일 [Optional, 기본값: 0.3]
 * @param {boolean} isFloating - 부유 애니메이션 활성화 여부 [Optional, 기본값: true]
 *
 * Example usage:
 * <SharkModel url="/crysis_shark.glb" scale={0.3} />
 */
function SharkModel({ url, scale = 0.3, isFloating = true }) {
  const groupRef = useRef();
  const { scene } = useGLTF(url);

  useFrame((state) => {
    if (!isFloating || !groupRef.current) return;
    const t = state.clock.getElapsedTime();
    /** 천천히 떠 있는 듯한 미세 부유 + 좌우 흔들림 */
    groupRef.current.position.y = Math.sin(t * 0.5) * 0.05;
    groupRef.current.rotation.z = Math.sin(t * 0.3) * 0.02;
    groupRef.current.rotation.y = Math.PI / 2 + Math.sin(t * 0.2) * 0.05;
  });

  return (
    <group ref={groupRef} scale={scale} renderOrder={RENDER_ORDER.shark}>
      <primitive object={scene} />
    </group>
  );
}

export default SharkModel;
