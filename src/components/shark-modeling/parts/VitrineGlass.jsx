import { RENDER_ORDER } from '../vitrineDesign';

/**
 * VitrineGlass - 얇은 유리 5면 (정적).
 *
 * NOTE: scroll-driven 등장은 SharkVitrineScene의 VitrineGroup이 통째로 처리.
 *
 * Props:
 * @param {object} design - computeVitrineGeometry() 결과 [Required]
 *
 * Example usage:
 * <VitrineGlass design={ design } />
 */
function VitrineGlass({ design }) {
  const { box, frame, glass } = design;
  const { w, h, d } = box;
  const ft = frame.thickness;
  const gt = glass.thickness;

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

  return (
    <group>
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
