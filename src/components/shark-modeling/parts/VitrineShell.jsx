import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';

/**
 * VitrineShell - 외부 흰색 panel matte 프레임 + plinth
 *
 * - plinth(받침)는 항상 보임 (scroll progress 영향 X)
 * - panel matte frame은 progress 0.2~0.7 구간에서 bottom-pivot scaleY 0→1
 *
 * Props:
 * @param {object} design - computeVitrineGeometry() 결과 [Required]
 * @param {Object} progress - framer-motion MotionValue (0~1), build-up용 [Optional]
 *
 * Example usage:
 * <VitrineShell design={ design } progress={ scrollYProgress } />
 */
function VitrineShell({ design, progress }) {
  const { box, frame, plinth } = design;
  const { w, h, d } = box;
  const ft = frame.thickness;
  const frameGroupRef = useRef();

  /** panel matte frame을 progress 0.2~0.7 구간에서 bottom-pivot scaleY 0→1.
      mesh center가 (0,0,0)이므로 scale=s 시 bottom 고정을 위해 position.y = -h/2 + h*s/2 */
  useFrame(() => {
    if (!frameGroupRef.current) return;
    const pVal = progress?.get?.() ?? 1;
    const s = Math.max(0, Math.min(1, (pVal - 0.2) / 0.5));
    frameGroupRef.current.scale.y = s;
    frameGroupRef.current.position.y = -h / 2 + (h * s) / 2;
  });

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
      {/** panel matte frame — scroll-driven bottom-pivot scale */}
      <group ref={ frameGroupRef }>
        {facePanels.map((p, i) => (
          <mesh key={`panel-${i}`} position={p.pos} castShadow receiveShadow>
            <boxGeometry args={p.geo} />
            <meshStandardMaterial color={frame.color} {...frame.material} />
          </mesh>
        ))}
      </group>

      {/** 흰색 plinth — 항상 보임 */}
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
