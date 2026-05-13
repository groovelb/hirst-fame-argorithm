import { RENDER_ORDER } from '../vitrineDesign';

/**
 * VitrineGlass - 얇은 유리 5면 + 가장자리 silicone sealing 라인
 *
 * bottom 면은 plinth로 가려져 생략.
 * 각 패널은 얇은 box로 구성 → transmission ray-march 거리가 짧아 ghost 없음.
 * 12개 엣지에 얇은 검은 sealing strip을 둘러 실제 코킹 마감을 재현.
 *
 * Props:
 * @param {object} design - computeVitrineGeometry() 결과 [Required]
 *
 * Example usage:
 * <VitrineGlass design={design} />
 */
function VitrineGlass({ design }) {
  const { box, frame, glass } = design;
  const { w, h, d } = box;
  const ft = frame.thickness;
  const gt = glass.thickness;
  const st = glass.sealThickness;

  /** 유리 인너 박스 크기 (프레임 안쪽으로 들어간) */
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

  /** 12 sealing 엣지 — 유리 박스의 외곽 라인 */
  const sealEdges = [
    /** 상단 가로 엣지 4개 (top + 측면 만나는 부분) - x축 길이 */
    { pos: [0, ih / 2, id / 2], geo: [iw, st, st] },
    { pos: [0, ih / 2, -id / 2], geo: [iw, st, st] },
    /** 하단 가로 엣지 4개 */
    { pos: [0, -ih / 2, id / 2], geo: [iw, st, st] },
    { pos: [0, -ih / 2, -id / 2], geo: [iw, st, st] },
    /** 세로 엣지 4개 - y축 길이 */
    { pos: [iw / 2, 0, id / 2], geo: [st, ih, st] },
    { pos: [-iw / 2, 0, id / 2], geo: [st, ih, st] },
    { pos: [iw / 2, 0, -id / 2], geo: [st, ih, st] },
    { pos: [-iw / 2, 0, -id / 2], geo: [st, ih, st] },
    /** 깊이 방향 엣지 4개 - z축 길이 */
    { pos: [iw / 2, ih / 2, 0], geo: [st, st, id] },
    { pos: [-iw / 2, ih / 2, 0], geo: [st, st, id] },
    { pos: [iw / 2, -ih / 2, 0], geo: [st, st, id] },
    { pos: [-iw / 2, -ih / 2, 0], geo: [st, st, id] },
  ];

  return (
    <group>
      {/** 유리 5면 */}
      {panels.map((p, i) => (
        <mesh key={`g-${i}`} position={p.pos} renderOrder={RENDER_ORDER.glass}>
          <boxGeometry args={p.geo} />
          <meshPhysicalMaterial
            transmission={glass.transmission}
            thickness={glass.transmissionThickness}
            roughness={glass.roughness}
            ior={glass.ior}
            attenuationColor={glass.attenuationColor}
            attenuationDistance={glass.attenuationDistance}
            color={glass.color}
            clearcoat={glass.clearcoat}
            clearcoatRoughness={glass.clearcoatRoughness}
            transparent
            opacity={glass.opacity}
          />
        </mesh>
      ))}

      {/** sealing 라인 12개 — 검은 silicone 코킹 */}
      {sealEdges.map((e, i) => (
        <mesh key={`seal-${i}`} position={e.pos} renderOrder={RENDER_ORDER.glass + 1}>
          <boxGeometry args={e.geo} />
          <meshStandardMaterial
            color={glass.sealColor}
            metalness={0.0}
            roughness={0.9}
          />
        </mesh>
      ))}
    </group>
  );
}

export default VitrineGlass;
