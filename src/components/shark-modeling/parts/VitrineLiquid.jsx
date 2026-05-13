import { RENDER_ORDER } from '../vitrineDesign';

/**
 * VitrineLiquid - 포름알데히드 액체 매질
 *
 * MeshPhysicalMaterial transmission으로 굴절·IOR·attenuation 표현.
 * thickness는 0.4로 낮춰 ghost 최소화 (이전 1.8 → 이중 굴절 원인).
 * 유리 안쪽보다 살짝 inset되어 strut 등 내부 구조물과 겹치지 않음.
 *
 * Props:
 * @param {object} design - computeVitrineGeometry() 결과 [Required]
 *
 * Example usage:
 * <VitrineLiquid design={design} />
 */
function VitrineLiquid({ design }) {
  const { box, frame, liquid } = design;
  const { w, h, d } = box;
  const ft = frame.thickness;

  const iw = w - ft - liquid.inset;
  const ih = h - ft - liquid.inset;
  const id = d - ft - liquid.inset;

  return (
    <mesh position={[0, 0, 0]} renderOrder={RENDER_ORDER.liquid}>
      <boxGeometry args={[iw, ih, id]} />
      <meshPhysicalMaterial
        transmission={liquid.transmission}
        thickness={liquid.thickness}
        ior={liquid.ior}
        roughness={liquid.roughness}
        attenuationColor={liquid.attenuationColor}
        attenuationDistance={liquid.attenuationDistance}
        color={liquid.color}
        transparent
        opacity={liquid.opacity}
      />
    </mesh>
  );
}

export default VitrineLiquid;
