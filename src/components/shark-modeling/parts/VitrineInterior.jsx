import { RENDER_ORDER } from '../vitrineDesign';

/**
 * VitrineInterior - 탱크 내부 구조물
 *
 * 현재 구현:
 *  - Phase A: 좌우 수직 strut + 세로 볼트 그리드
 *  - Phase B: 천장 평행 ribs + 바닥 가로 ridges
 *
 * 보류:
 *  - Phase D: 서스펜션 와이어 — 정중앙 수직 cylinder가 frame처럼 보여서 제거.
 *    추후 등지느러미 정확 위치 + 얇은 두께(<1mm)로 재시도.
 *
 * Props:
 * @param {object} design - computeVitrineGeometry() 결과 [Required]
 *
 * Example usage:
 * <VitrineInterior design={design} />
 */
function VitrineInterior({ design }) {
  const { box, frame, strut, ceiling, floor, rebar } = design;
  const { w, h, d } = box;
  const ft = frame.thickness;

  /** 유리 안쪽 차원 */
  const iw = w - ft;
  const ih = h - ft;
  const id = d - ft;

  /** 4 코너 포스트 위치: 안쪽 면에서 strut.depth/2 + 미세 여백만큼 안쪽 */
  const postX = iw / 2 - strut.depth / 2 - 0.005;
  const postZ = id / 2 - strut.depth / 2 - 0.005;

  /** 볼트 세로 균등 배치 */
  const boltMargin = ih * 0.05;
  const boltUsableH = ih - boltMargin * 2;
  const boltSpacing =
    strut.bolt.count > 1 ? boltUsableH / (strut.bolt.count - 1) : 0;

  /** 4 코너: [x sign, z sign] */
  const corners = [
    [+1, +1],
    [+1, -1],
    [-1, +1],
    [-1, -1],
  ];

  /** 천장 ribs: z축 균등 분포, 천장 글래스 바로 아래에 매달림 */
  const ribY = ih / 2 - ceiling.ribDrop / 2 - 0.005;
  const ribZSpacing = id / (ceiling.ribCount + 1);
  const ribWidth = iw - 0.04;

  /** 바닥 ridges: z축 균등 분포, 바닥 글래스 바로 위 */
  const ridgeY = -ih / 2 + floor.ridgeHeight / 2 + 0.005;
  const ridgeZSpacing = id / (floor.ridgeCount + 1);
  const ridgeWidth = iw - 0.04;

  return (
    <group renderOrder={RENDER_ORDER.innerStructure}>
      {/** 천장 스틸 ribs - z축 균등 분포 (rebar 재질로 strut과 통일) */}
      {Array.from({ length: ceiling.ribCount }).map((_, i) => {
        const zPos = -id / 2 + ribZSpacing * (i + 1);
        return (
          <mesh
            key={`rib-${i}`}
            position={[0, ribY, zPos]}
            castShadow
            receiveShadow
          >
            <boxGeometry args={[ribWidth, ceiling.ribDrop, ceiling.ribDepth]} />
            <meshStandardMaterial color={rebar.color} {...rebar.material} />
          </mesh>
        );
      })}

      {/** 바닥 스틸 ridges - z축 균등 분포 (rebar 재질) */}
      {Array.from({ length: floor.ridgeCount }).map((_, i) => {
        const zPos = -id / 2 + ridgeZSpacing * (i + 1);
        return (
          <mesh
            key={`ridge-${i}`}
            position={[0, ridgeY, zPos]}
            castShadow
            receiveShadow
          >
            <boxGeometry args={[ridgeWidth, floor.ridgeHeight, floor.ridgeDepth]} />
            <meshStandardMaterial color={rebar.color} {...rebar.material} />
          </mesh>
        );
      })}

      {/** 4 코너 수직 포스트 + 볼트 그리드
       *  정사각 단면(strut.depth × strut.depth) × 풀 높이(ih).
       *  각 포스트는 안쪽으로 향한 x면에만 볼트 1열.
       */}
      {corners.map(([sx, sz]) => {
        const pcX = sx * postX;
        const pcZ = sz * postZ;
        /** 볼트는 포스트의 -sx 방향 면(센터 향한 면)에서 안쪽으로 돌출 */
        const boltX = pcX - sx * (strut.depth / 2 + strut.bolt.depth / 2);

        return (
          <group key={`post-${sx}-${sz}`}>
            <mesh position={[pcX, 0, pcZ]} castShadow receiveShadow>
              <boxGeometry args={[strut.depth, ih, strut.depth]} />
              <meshStandardMaterial color={rebar.color} {...rebar.material} />
            </mesh>

            {Array.from({ length: strut.bolt.count }).map((_, i) => {
              const yPos = -ih / 2 + boltMargin + i * boltSpacing;
              return (
                <mesh
                  key={`bolt-${sx}-${sz}-${i}`}
                  position={[boltX, yPos, pcZ]}
                  rotation={[0, 0, Math.PI / 2]}
                  castShadow
                >
                  <cylinderGeometry
                    args={[
                      strut.bolt.radius,
                      strut.bolt.radius,
                      strut.bolt.depth,
                      16,
                    ]}
                  />
                  <meshStandardMaterial
                    color={strut.bolt.color}
                    {...strut.bolt.material}
                  />
                </mesh>
              );
            })}
          </group>
        );
      })}
    </group>
  );
}

export default VitrineInterior;
