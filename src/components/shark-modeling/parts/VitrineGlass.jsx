import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { RENDER_ORDER } from '../vitrineDesign';

/**
 * VitrineGlass - 얇은 유리 5면 + scroll-driven build-up.
 *
 * progress 0.2~0.7 구간에서 bottom-pivot scaleY 0→1로 vitrine이 차오름.
 *
 * Props:
 * @param {object} design - computeVitrineGeometry() 결과 [Required]
 * @param {Object} progress - framer-motion MotionValue (0~1) [Optional]
 *
 * Example usage:
 * <VitrineGlass design={ design } progress={ scrollYProgress } />
 */
function VitrineGlass({ design, progress }) {
  const { box, frame, glass } = design;
  const { w, h, d } = box;
  const ft = frame.thickness;
  const gt = glass.thickness;
  const groupRef = useRef();

  /** 유리 인너 박스 크기 */
  const iw = w - ft;
  const ih = h - ft;
  const id = d - ft;

  /** 유리 5면 */
  const panels = [
    /** top */
    { pos: [0, ih / 2, 0], geo: [iw, gt, id] },
    /** front +z */
    { pos: [0, 0, id / 2], geo: [iw, ih, gt] },
    /** back -z */
    { pos: [0, 0, -id / 2], geo: [iw, ih, gt] },
    /** left -x */
    { pos: [-iw / 2, 0, 0], geo: [gt, ih, id] },
    /** right +x */
    { pos: [iw / 2, 0, 0], geo: [gt, ih, id] },
  ];

  /** bottom-pivot scale (panel matte frame과 동일 식 + 동일 구간) */
  useFrame(() => {
    if (!groupRef.current) return;
    const pVal = progress?.get?.() ?? 1;
    const s = Math.max(0, Math.min(1, (pVal - 0.2) / 0.5));
    groupRef.current.scale.y = s;
    groupRef.current.position.y = -h / 2 + (h * s) / 2;
  });

  return (
    <group ref={ groupRef }>
      { panels.map((p, i) => (
        <mesh key={ `g-${i}` } position={ p.pos } renderOrder={ RENDER_ORDER.glass }>
          <boxGeometry args={ p.geo } />
          <meshPhysicalMaterial
            transmission={ glass.transmission }
            thickness={ glass.transmissionThickness }
            roughness={ glass.roughness }
            ior={ glass.ior }
            attenuationColor={ glass.attenuationColor }
            attenuationDistance={ glass.attenuationDistance }
            color={ glass.color }
            clearcoat={ glass.clearcoat }
            clearcoatRoughness={ glass.clearcoatRoughness }
            transparent
            opacity={ glass.opacity }
          />
        </mesh>
      )) }
    </group>
  );
}

export default VitrineGlass;
