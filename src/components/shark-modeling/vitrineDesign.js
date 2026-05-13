/**
 * vitrineDesign.js
 *
 * Hirst 'Natural History' 시리즈 vitrine의 비례 시스템 + 재료 토큰 단일 출처.
 *
 * 입력: 박스 외형 [w, h, d]
 * 출력: 모든 sub-component(frame, plinth, glass, liquid, strut, ceiling, floor,
 *      suspension)가 필요한 치수·재료 한 객체
 *
 * 박스 크기를 바꿔도 모든 두께/간격이 비례 유지되도록
 * shortSide(가장 짧은 변)를 기준으로 파생값 계산.
 */

/** 기본 박스 크기 */
export const DEFAULT_TANK_SIZE = [6, 3, 2.4];

/** 렌더 순서 규약 (transparent 정렬 안정화) */
export const RENDER_ORDER = {
  shark: 0,
  innerStructure: 1,
  liquid: 2,
  glass: 3,
};

/**
 * 박스 크기로부터 vitrine 전체 기하/재료 스펙을 계산
 * @param {[number, number, number]} size - [w, h, d]
 * @returns {object} vitrine geometry + material tokens
 */
export function computeVitrineGeometry(size = DEFAULT_TANK_SIZE) {
  const [w, h, d] = size;
  const shortSide = Math.min(w, h, d);

  return {
    box: { w, h, d, shortSide },

    /** 외부 흰색 panel matte 프레임 (박스 6면 외곽 두름, 중앙은 비어 글래스 노출) */
    frame: {
      thickness: shortSide * 0.065,
      color: '#f8f6f1',
      material: { metalness: 0.0, roughness: 0.7 },
    },

    /** 받침대 (plinth) */
    plinth: {
      height: h * 0.14,
      extend: shortSide * 0.03,
      gapHeight: 0.012,
      color: '#f8f6f1',
      gapColor: '#cfcdc8',
      material: { metalness: 0.0, roughness: 0.65 },
    },

    /** 유리 시트 */
    glass: {
      thickness: shortSide * 0.018,
      ior: 1.52,
      transmission: 1,
      transmissionThickness: 0.05,
      attenuationColor: '#f5fbfa',
      attenuationDistance: 5,
      color: '#ffffff',
      opacity: 0.2,
      clearcoat: 1,
      clearcoatRoughness: 0.02,
      roughness: 0.02,
      sealColor: '#1a1a1a',
      sealThickness: shortSide * 0.004,
    },

    /** 포름알데히드 액체 매질
     *  내부 구조물(strut, ribs, ridges)이 잠겨있으므로 attenuationDistance를
     *  살짝 완화해 시인성 확보. 색은 그대로 유지.
     */
    liquid: {
      thickness: 0.35,
      ior: 1.33,
      color: '#7ec9c0',
      attenuationColor: '#3da89e',
      attenuationDistance: 2.2,
      roughness: 0.05,
      opacity: 0.92,
      transmission: 1,
      /** 액체 박스가 유리 안쪽에서 inset되는 거리 (strut 회피용) */
      inset: 0.06,
    },

    /** 내부 좌우 수직 strut + 볼트 그리드 */
    strut: {
      width: shortSide * 0.11,
      depth: shortSide * 0.06,
      color: '#6b9b94',
      material: { metalness: 0.5, roughness: 0.5 },
      bolt: {
        count: 11,
        radius: shortSide * 0.012,
        depth: shortSide * 0.008,
        color: '#3a5d58',
        material: { metalness: 0.7, roughness: 0.4 },
      },
    },

    /** 천장 안쪽 평행 ribs (z축 균등 분포, 카메라 사각에서 사다리꼴로 보임) */
    ceiling: {
      ribCount: 4,
      /** 천장에서 아래로 돌출되는 양 (y두께) */
      ribDrop: shortSide * 0.04,
      /** 각 rib의 z방향 길이 (얇은 슬랫) */
      ribDepth: d * 0.05,
      color: '#f8f6f1',
      material: { metalness: 0.0, roughness: 0.6 },
    },

    /** 바닥 안쪽 가로 ridges (x축으로 긴 슬랫, z방향 균등 분포) */
    floor: {
      ridgeCount: 3,
      ridgeHeight: shortSide * 0.025,
      ridgeDepth: d * 0.06,
      color: '#f8f6f1',
      material: { metalness: 0.0, roughness: 0.6 },
    },

    /** 상어 서스펜션 와이어 */
    suspension: {
      wireRadius: shortSide * 0.0025,
      color: '#888888',
      material: { metalness: 0.8, roughness: 0.3 },
    },
  };
}
