import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { RENDER_ORDER } from '../vitrineDesign';

/**
 * VitrineLiquid - 포름알데히드 액체 매질 + scroll-driven 수위 채워짐.
 *
 * progress 0.5~1.0 구간에서 bottom-pivot scaleY 0→1로 액체가 차오름.
 *
 * Props:
 * @param {object} design - computeVitrineGeometry() 결과 [Required]
 * @param {Object} progress - framer-motion MotionValue (0~1) [Optional]
 *
 * Example usage:
 * <VitrineLiquid design={ design } progress={ scrollYProgress } />
 */
function VitrineLiquid({ design, progress }) {
  const { box, frame, liquid } = design;
  const { w, h, d } = box;
  const ft = frame.thickness;
  const groupRef = useRef();

  const iw = w - ft - liquid.inset;
  const ih = h - ft - liquid.inset;
  const id = d - ft - liquid.inset;

  /** bottom-pivot scaleY 0.5~1.0 구간 */
  useFrame(() => {
    if (!groupRef.current) return;
    const pVal = progress?.get?.() ?? 1;
    const s = Math.max(0, Math.min(1, (pVal - 0.5) / 0.5));
    groupRef.current.scale.y = s;
    groupRef.current.position.y = -h / 2 + (h * s) / 2;
  });

  return (
    <group ref={ groupRef }>
      <mesh position={ [0, 0, 0] } renderOrder={ RENDER_ORDER.liquid }>
        <boxGeometry args={ [iw, ih, id] } />
        <meshPhysicalMaterial
          transmission={ liquid.transmission }
          thickness={ liquid.thickness }
          ior={ liquid.ior }
          roughness={ liquid.roughness }
          attenuationColor={ liquid.attenuationColor }
          attenuationDistance={ liquid.attenuationDistance }
          color={ liquid.color }
          transparent
          opacity={ liquid.opacity }
        />
      </mesh>
    </group>
  );
}

export default VitrineLiquid;
