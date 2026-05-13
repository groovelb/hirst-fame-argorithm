/**
 * Shark Modeling Components
 *
 * Damien Hirst의 'The Physical Impossibility of Death in the Mind of Someone Living'(1991)
 * 작품을 three.js / react-three-fiber로 재현하는 3D 컴포넌트 모음.
 *
 * Public API:
 *   - SharkVitrine        : 자체 Canvas 포함, 독립 사용
 *   - SharkVitrineScene   : 3D 씬 내용만 (외부 Canvas에 임베드용)
 *   - SharkModel          : 상어 glTF 로더 + 부유 애니메이션
 *   - VitrineShell/Glass/Liquid/Interior : 개별 파트
 *   - computeVitrineGeometry : 비례·재료 토큰 계산 함수
 *   - DEFAULT_TANK_SIZE   : 기본 탱크 크기 [6, 3, 2.4]
 *   - DEFAULT_SHARK_URL   : 기본 glb 경로
 *   - RENDER_ORDER        : transparent 정렬 순서 상수
 *
 * Basic usage:
 *   import { SharkVitrine } from '@/components/shark-modeling';
 *   <SharkVitrine />
 *
 * Embed in custom canvas:
 *   import { SharkVitrineScene } from '@/components/shark-modeling';
 *   <Canvas><SharkVitrineScene /></Canvas>
 */

/** Main 컴포넌트 */
export { default as SharkVitrine } from './SharkVitrine.jsx';
export { default as SharkVitrineScene, DEFAULT_SHARK_URL } from './SharkVitrineScene.jsx';

/** 개별 파트 (고급 사용자용 — 직접 조합 가능) */
export { default as SharkModel } from './parts/SharkModel.jsx';
export { default as VitrineShell } from './parts/VitrineShell.jsx';
export { default as VitrineGlass } from './parts/VitrineGlass.jsx';
export { default as VitrineLiquid } from './parts/VitrineLiquid.jsx';
export { default as VitrineInterior } from './parts/VitrineInterior.jsx';

/** 디자인 토큰 시스템 */
export {
  computeVitrineGeometry,
  DEFAULT_TANK_SIZE,
  RENDER_ORDER,
} from './vitrineDesign.js';
