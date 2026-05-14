import { RENDER_ORDER } from '../vitrineDesign';

/**
 * VitrineLiquid - 포름알데히드 액체 매질 (정적).
 *
 * NOTE: scroll-driven 등장은 SharkVitrineScene의 VitrineGroup이 통째로 처리.
 *
 * Props:
 * @param {object} design - computeVitrineGeometry() 결과 [Required]
 *
 * Example usage:
 * <VitrineLiquid design={ design } />
 */
function VitrineLiquid({ design }) {
  const { box, frame, liquid } = design;
  const { w, h, d } = box;
  const ft = frame.thickness;

  const iw = w - ft - liquid.inset;
  const ih = h - ft - liquid.inset;
  const id = d - ft - liquid.inset;

  return (
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
  );
}

export default VitrineLiquid;
