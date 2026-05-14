/**
 * VitrineShell - 외부 흰색 panel matte 프레임 + plinth (정적).
 *
 * NOTE: scroll-driven 등장은 SharkVitrineScene의 VitrineGroup이 통째로 처리.
 *   여기서는 mesh만 정의.
 *
 * Props:
 * @param {object} design - computeVitrineGeometry() 결과 [Required]
 *
 * Example usage:
 * <VitrineShell design={ design } />
 */
function VitrineShell({ design }) {
  const { box, frame, plinth } = design;
  const { w, h, d } = box;
  const ft = frame.thickness;

  /**
   * 한 면의 외곽 4 strip 정의 (top/bottom/left/right)
   * axis: 'x' | 'y' | 'z' - 면의 법선 축
   * sign: -1 | 1 - 면의 방향
   */
  function buildFaceStrips(axis, sign) {
    /** 면의 u, v 차원 + 면의 normal 위치 */
    let uLen;
    let vLen;
    let normalPos;
    if (axis === 'z') {
      uLen = w;
      vLen = h;
      normalPos = sign * (d / 2 - ft / 2);
    } else if (axis === 'x') {
      uLen = d;
      vLen = h;
      normalPos = sign * (w / 2 - ft / 2);
    } else {
      uLen = w;
      vLen = d;
      normalPos = sign * (h / 2 - ft / 2);
    }

    const vInner = vLen - 2 * ft;

    /** (u, v, n) 로컬 좌표를 world (x, y, z) 좌표로 매핑 */
    const toWorld = (u, v) => {
      if (axis === 'z') return [u, v, normalPos];
      if (axis === 'x') return [normalPos, v, u];
      return [u, normalPos, v];
    };

    /** strip의 box geometry args(x, y, z 길이)로 매핑 */
    const toGeo = (uSize, vSize) => {
      if (axis === 'z') return [uSize, vSize, ft];
      if (axis === 'x') return [ft, vSize, uSize];
      return [uSize, ft, vSize];
    };

    return [
      /** top strip */
      { pos: toWorld(0, vLen / 2 - ft / 2), geo: toGeo(uLen, ft) },
      /** bottom strip */
      { pos: toWorld(0, -vLen / 2 + ft / 2), geo: toGeo(uLen, ft) },
      /** left strip (inner height) */
      { pos: toWorld(-uLen / 2 + ft / 2, 0), geo: toGeo(ft, vInner) },
      /** right strip */
      { pos: toWorld(uLen / 2 - ft / 2, 0), geo: toGeo(ft, vInner) },
    ];
  }

  /** 5개 면의 panel matte 수집 (bottom은 plinth로 가려져 생략)
   *  좌/우 옆면과 동일하게 앞/뒤도 panel matte로 둘러싸 대칭성 유지.
   */
  const facePanels = [
    ...buildFaceStrips('z', 1),
    ...buildFaceStrips('z', -1),
    ...buildFaceStrips('x', 1),
    ...buildFaceStrips('x', -1),
    ...buildFaceStrips('y', 1),
  ];

  return (
    <group>
      {/** panel matte frame */}
      { facePanels.map((p, i) => (
        <mesh key={ `panel-${i}` } position={ p.pos } castShadow receiveShadow>
          <boxGeometry args={ p.geo } />
          <meshStandardMaterial color={ frame.color } { ...frame.material } />
        </mesh>
      )) }

      {/** 흰색 plinth */}
      <mesh
        position={[0, -h / 2 - plinth.height / 2 - plinth.gapHeight, 0]}
        castShadow
        receiveShadow
      >
        <boxGeometry
          args={[w + plinth.extend * 2, plinth.height, d + plinth.extend * 2]}
        />
        <meshStandardMaterial color={plinth.color} {...plinth.material} />
      </mesh>

      {/** plinth 상단 어두운 갭 라인 */}
      <mesh position={[0, -h / 2 - plinth.gapHeight / 2, 0]}>
        <boxGeometry args={[w + 0.02, plinth.gapHeight, d + 0.02]} />
        <meshStandardMaterial
          color={plinth.gapColor}
          metalness={0.0}
          roughness={0.9}
        />
      </mesh>
    </group>
  );
}

export default VitrineShell;
