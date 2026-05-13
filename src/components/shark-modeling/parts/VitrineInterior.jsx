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
  const { box, frame, strut, ceiling, floor } = design;
  const { w, h, d } = box;
  const ft = frame.thickness;

  /** 유리 안쪽 차원 */
  const iw = w - ft;
  const ih = h - ft;
  const id = d - ft;

  /** strut 가로폭(z방향)은 안쪽 깊이를 넘지 않게 제한 */
  const strutZ = Math.min(strut.width, id - 0.1);

  /** strut 중심 x좌표: 유리 안쪽 면(±iw/2)에서 strut.depth/2 + 미세 여백만큼 안쪽 */
  const strutCenterX = iw / 2 - strut.depth / 2 - 0.005;

  /** 볼트 세로 균등 배치 */
  const boltMargin = ih * 0.05;
  const boltUsableH = ih - boltMargin * 2;
  const boltSpacing =
    strut.bolt.count > 1 ? boltUsableH / (strut.bolt.count - 1) : 0;

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
      {/** 천장 ribs - z축 균등 분포 */}
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
            <meshStandardMaterial color={ceiling.color} {...ceiling.material} />
          </mesh>
        );
      })}

      {/** 바닥 ridges - z축 균등 분포 */}
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
            <meshStandardMaterial color={floor.color} {...floor.material} />
          </mesh>
        );
      })}

      {/** 좌우 strut + 볼트 그리드 */}
      {[-1, 1].map((side) => {
        const sx = side * strutCenterX;
        /** strut의 센터를 향한 면 x좌표 */
        const innerFaceX = side * (strutCenterX - strut.depth / 2);
        /** 볼트 center는 그 면에서 센터 방향으로 bolt.depth/2만큼 돌출 */
        const boltX = innerFaceX - side * (strut.bolt.depth / 2);

        return (
          <group key={`strut-${side}`}>
            {/** strut 본체 */}
            <mesh position={[sx, 0, 0]} castShadow receiveShadow>
              <boxGeometry args={[strut.depth, ih, strutZ]} />
              <meshStandardMaterial color={strut.color} {...strut.material} />
            </mesh>

            {/** 볼트 그리드 (세로 1열, count개) */}
            {Array.from({ length: strut.bolt.count }).map((_, i) => {
              const yPos = -ih / 2 + boltMargin + i * boltSpacing;
              return (
                <mesh
                  key={`bolt-${side}-${i}`}
                  position={[boltX, yPos, 0]}
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
