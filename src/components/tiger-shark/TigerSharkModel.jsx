import { useMemo } from 'react';
import { Line } from '@react-three/drei';
import * as THREE from 'three';

import { createBodyGeometry } from './geometry/createBodyGeometry';
import { createMedianFinGeometry, createWingFinGeometry } from './geometry/createFinGeometry';
import { createToothGeometry } from './geometry/createToothGeometry';
import {
  BODY_STATIONS,
  FIN_LAYOUT,
  MODEL_LENGTH,
  bodyBottomY,
  bodyHalfWidth,
  bodyTopY,
  sampleBodyProfile,
  toModelX,
} from './geometry/galeocerdoCuvierRatios';

const LINE_COLOR = '#101515';
const FIN_COLOR = '#879390';
const FIN_EDGE_COLOR = '#404a47';
const TOOTH_COLOR = '#e7e0ce';

function point(ratio, y, z = 0) {
  return new THREE.Vector3(toModelX(ratio), y, z);
}

function surfacePoint(ratio, vertical, side) {
  const profile = sampleBodyProfile(ratio);
  const halfHeight = profile.height * MODEL_LENGTH * 0.5;
  const halfWidth = profile.width * MODEL_LENGTH * 0.5;
  const y = profile.yOffset * MODEL_LENGTH + vertical * halfHeight;
  const zScale = (1 - Math.abs(vertical) ** profile.power) ** (1 / profile.power);
  const z = side * (halfWidth * zScale + 0.016);

  return [toModelX(ratio), y, z];
}

function topPoint(ratio, lift = 0) {
  return point(ratio, bodyTopY(ratio) + lift);
}

function bottomPoint(ratio, drop = 0) {
  return point(ratio, bodyBottomY(ratio) - drop);
}

export function TigerSharkModel({
  showLandmarks = true,
  showWireframe = false,
  showTeeth = true,
  showPattern = false,
}) {
  const bodyGeometry = useMemo(() => createBodyGeometry(), []);
  const finGeometries = useMemo(() => createFinGeometries(), []);
  const toothGeometry = useMemo(() => createToothGeometry(1.05), []);

  return (
    <group>
      <mesh geometry={ bodyGeometry }>
        <meshStandardMaterial
          vertexColors
          roughness={ 0.74 }
          metalness={ 0.02 }
          wireframe={ showWireframe }
        />
      </mesh>

      <FinMeshes geometries={ finGeometries } wireframe={ showWireframe } />
      <HeadLandmarks />
      <TailKeels />
      { showTeeth ? <Teeth geometry={ toothGeometry } /> : null }
      { showPattern ? <PatternGuides /> : null }
      { showLandmarks ? <StationOverlay /> : null }
    </group>
  );
}

function FinMeshes({ geometries, wireframe }) {
  return (
    <group>
      { geometries.map(({ id, geometry, edgePoints }) => (
        <group key={ id }>
          <mesh geometry={ geometry }>
            <meshStandardMaterial
              color={ FIN_COLOR }
              roughness={ 0.82 }
              side={ THREE.DoubleSide }
              wireframe={ wireframe }
            />
          </mesh>
          { edgePoints ? (
            <Line
              points={ edgePoints }
              color={ FIN_EDGE_COLOR }
              lineWidth={ 1.2 }
              transparent
              opacity={ 0.62 }
            />
          ) : null }
        </group>
      )) }
    </group>
  );
}

function HeadLandmarks() {
  const gillSlits = [-1, 1].flatMap((side) => (
    Array.from({ length: 5 }, (_, index) => {
      const ratio = 0.162 + index * 0.012;
      return {
        id: `${side}-${index}`,
        points: [
          surfacePoint(ratio - 0.003, 0.25, side),
          surfacePoint(ratio + 0.002, -0.32, side),
        ],
      };
    })
  ));

  const mouthLines = [-1, 1].map((side) => ({
    id: `mouth-${side}`,
    points: [
      surfacePoint(0.035, -0.5, side),
      surfacePoint(0.078, -0.73, side),
      surfacePoint(0.142, -0.62, side),
      surfacePoint(0.18, -0.48, side),
    ],
  }));

  const labialFurrows = [-1, 1].map((side) => ({
    id: `furrow-${side}`,
    points: [
      surfacePoint(0.125, -0.48, side),
      surfacePoint(0.168, -0.34, side),
      surfacePoint(0.205, -0.16, side),
    ],
  }));

  const spiracles = [-1, 1].map((side) => ({
    id: `spiracle-${side}`,
    points: [
      surfacePoint(0.128, 0.28, side),
      surfacePoint(0.139, 0.24, side),
    ],
  }));

  return (
    <group>
      { [...mouthLines, ...labialFurrows, ...gillSlits, ...spiracles].map(({ id, points }) => (
        <Line
          key={ id }
          points={ points }
          color={ LINE_COLOR }
          lineWidth={ id.startsWith('mouth') ? 2.2 : 1.4 }
          transparent
          opacity={ id.startsWith('furrow') ? 0.62 : 0.82 }
        />
      )) }

      { [-1, 1].map((side) => (
        <mesh key={ `eye-${side}` } position={ surfacePoint(0.095, 0.34, side) }>
          <sphereGeometry args={ [0.055, 18, 10] } />
          <meshStandardMaterial color="#0a0c0c" roughness={ 0.35 } />
        </mesh>
      )) }

      { [-1, 1].map((side) => (
        <mesh key={ `nostril-${side}` } position={ [toModelX(0.052), bodyBottomY(0.052) + 0.026, side * 0.19] }>
          <sphereGeometry args={ [0.028, 14, 8] } />
          <meshStandardMaterial color="#0d1110" roughness={ 0.65 } />
        </mesh>
      )) }

      <Line
        points={ [
          [toModelX(0.48), bodyTopY(0.48) + 0.012, 0],
          [toModelX(0.58), bodyTopY(0.58) + 0.013, 0],
          [toModelX(0.69), bodyTopY(0.69) + 0.011, 0],
          [toModelX(0.715), bodyTopY(0.715) + 0.006, 0],
        ] }
        color="#2c3633"
        lineWidth={ 1.35 }
        transparent
        opacity={ 0.58 }
      />
    </group>
  );
}

function TailKeels() {
  return (
    <group>
      { [-1, 1].map((side) => (
        <Line
          key={ side }
          points={ [
            [toModelX(0.78), 0, side * (bodyHalfWidth(0.78) + 0.018)],
            [toModelX(0.835), -0.002, side * (bodyHalfWidth(0.835) + 0.018)],
            [toModelX(0.88), -0.003, side * (bodyHalfWidth(0.88) + 0.015)],
          ] }
          color="#2c3633"
          lineWidth={ 1.35 }
          transparent
          opacity={ 0.78 }
        />
      )) }
    </group>
  );
}

function Teeth({ geometry }) {
  const positions = Array.from({ length: 11 }, (_, index) => {
    const t = index / 10;
    const z = THREE.MathUtils.lerp(-0.34, 0.34, t);
    const curve = Math.abs(t - 0.5) * 2;
    return {
      x: toModelX(0.072 + curve * 0.026),
      y: bodyBottomY(0.08) + 0.034,
      z,
      scale: 0.76 + (1 - curve) * 0.15,
    };
  });

  return (
    <group>
      { positions.map(({ x, y, z, scale }, index) => (
        <mesh
          key={ index }
          geometry={ geometry }
          position={ [x, y, z] }
          rotation={ [0, 0, Math.PI] }
          scale={ [scale, scale, scale] }
        >
          <meshStandardMaterial color={ TOOTH_COLOR } roughness={ 0.46 } side={ THREE.DoubleSide } />
        </mesh>
      )) }
    </group>
  );
}

function PatternGuides() {
  const ratios = [0.16, 0.205, 0.25, 0.3, 0.355, 0.415, 0.475, 0.54, 0.605];

  return (
    <group>
      { ratios.map((ratio) => (
        <Line
          key={ ratio }
          points={ createPartialRingPoints(ratio, -0.72, 0.72, 28) }
          color="#283230"
          lineWidth={ 1.1 }
          transparent
          opacity={ 0.22 }
        />
      )) }
    </group>
  );
}

function StationOverlay() {
  const ratios = [0, 0.18, 0.26, 0.36, 0.55, 0.78, 0.88, 1];

  return (
    <group>
      { BODY_STATIONS.map((station) => (
        <Line
          key={ station.x }
          points={ createRingPoints(station.x, 52) }
          color="#ecf0e8"
          lineWidth={ 0.75 }
          transparent
          opacity={ 0.18 }
        />
      )) }

      <Line
        points={ ratios.map((ratio) => [toModelX(ratio), 0, 0]) }
        color="#f5efe0"
        lineWidth={ 0.95 }
        transparent
        opacity={ 0.26 }
      />
    </group>
  );
}

function createFinGeometries() {
  const firstDorsalPoints = [
    topPoint(FIN_LAYOUT.firstDorsal.start, 0.012),
    point(FIN_LAYOUT.firstDorsal.tip, bodyTopY(FIN_LAYOUT.firstDorsal.tip) + FIN_LAYOUT.firstDorsal.height * MODEL_LENGTH),
    point(FIN_LAYOUT.firstDorsal.end, bodyTopY(FIN_LAYOUT.firstDorsal.end) + 0.012),
    point(0.445, bodyTopY(0.445) + 0.18),
  ];

  const secondDorsalPoints = [
    topPoint(FIN_LAYOUT.secondDorsal.start, 0.007),
    point(FIN_LAYOUT.secondDorsal.tip, bodyTopY(FIN_LAYOUT.secondDorsal.tip) + FIN_LAYOUT.secondDorsal.height * MODEL_LENGTH),
    topPoint(FIN_LAYOUT.secondDorsal.end, 0.006),
    point(0.756, bodyTopY(0.756) + 0.055),
  ];

  const analPoints = [
    bottomPoint(FIN_LAYOUT.anal.start, 0.006),
    bottomPoint(FIN_LAYOUT.anal.end, 0.006),
    point(FIN_LAYOUT.anal.tip, bodyBottomY(FIN_LAYOUT.anal.tip) - FIN_LAYOUT.anal.height * MODEL_LENGTH),
  ];

  const caudalPoints = [
    point(FIN_LAYOUT.caudal.base, bodyTopY(FIN_LAYOUT.caudal.base) + 0.01),
    point(0.944, 0.84),
    point(FIN_LAYOUT.caudal.upperTip, FIN_LAYOUT.caudal.upperHeight * MODEL_LENGTH),
    point(0.962, 0.28),
    point(0.906, 0.045),
    point(FIN_LAYOUT.caudal.lowerTip, -FIN_LAYOUT.caudal.lowerHeight * MODEL_LENGTH),
    point(FIN_LAYOUT.caudal.base, bodyBottomY(FIN_LAYOUT.caudal.base) - 0.01),
  ];

  return [
    {
      id: 'pectoral-left',
      geometry: createPectoralFin(1),
    },
    {
      id: 'pectoral-right',
      geometry: createPectoralFin(-1),
    },
    {
      id: 'pelvic-left',
      geometry: createPelvicFin(1),
    },
    {
      id: 'pelvic-right',
      geometry: createPelvicFin(-1),
    },
    {
      id: 'first-dorsal',
      geometry: createMedianFinGeometry(firstDorsalPoints, 0.045),
      edgePoints: firstDorsalPoints,
    },
    {
      id: 'second-dorsal',
      geometry: createMedianFinGeometry(secondDorsalPoints, 0.03),
      edgePoints: secondDorsalPoints,
    },
    {
      id: 'anal',
      geometry: createMedianFinGeometry(analPoints, 0.028),
      edgePoints: analPoints,
    },
    {
      id: 'caudal',
      geometry: createMedianFinGeometry(caudalPoints, 0.05),
      edgePoints: caudalPoints,
    },
  ];
}

function createPectoralFin(side) {
  const rootStart = FIN_LAYOUT.pectoral.rootStart;
  const rootEnd = FIN_LAYOUT.pectoral.rootEnd;
  const rootZStart = side * (bodyHalfWidth(rootStart) - 0.015);
  const rootZEnd = side * (bodyHalfWidth(rootEnd) - 0.01);
  const tipZ = side * (bodyHalfWidth(rootEnd) + FIN_LAYOUT.pectoral.span * MODEL_LENGTH);

  return createWingFinGeometry([
    new THREE.Vector3(toModelX(rootStart), -0.04, rootZStart),
    new THREE.Vector3(toModelX(rootEnd), -0.095, rootZEnd),
    new THREE.Vector3(toModelX(0.335), -0.26, side * (bodyHalfWidth(0.32) + 1.05)),
    new THREE.Vector3(toModelX(FIN_LAYOUT.pectoral.tip), -0.36, tipZ),
  ]);
}

function createPelvicFin(side) {
  const rootStart = FIN_LAYOUT.pelvic.rootStart;
  const rootEnd = FIN_LAYOUT.pelvic.rootEnd;
  const tipZ = side * (bodyHalfWidth(rootEnd) + FIN_LAYOUT.pelvic.span * MODEL_LENGTH);

  return createWingFinGeometry([
    new THREE.Vector3(toModelX(rootStart), bodyBottomY(rootStart) + 0.02, side * bodyHalfWidth(rootStart)),
    new THREE.Vector3(toModelX(rootEnd), bodyBottomY(rootEnd) + 0.01, side * bodyHalfWidth(rootEnd)),
    new THREE.Vector3(toModelX(0.64), bodyBottomY(0.64) - 0.1, side * (bodyHalfWidth(0.64) + 0.26)),
    new THREE.Vector3(toModelX(FIN_LAYOUT.pelvic.tip), bodyBottomY(FIN_LAYOUT.pelvic.tip) - 0.16, tipZ),
  ]);
}

function createRingPoints(ratio, segments = 48) {
  const profile = sampleBodyProfile(ratio);
  const points = [];
  const x = toModelX(ratio);
  const halfHeight = profile.height * MODEL_LENGTH * 0.5;
  const halfWidth = profile.width * MODEL_LENGTH * 0.5;
  const yOffset = profile.yOffset * MODEL_LENGTH;

  for (let index = 0; index <= segments; index += 1) {
    const theta = (index / segments) * Math.PI * 2;
    const z = signedPower(Math.cos(theta), profile.power) * halfWidth;
    const y = yOffset + signedPower(Math.sin(theta), profile.power) * halfHeight;
    points.push([x, y, z]);
  }

  return points;
}

function createPartialRingPoints(ratio, minVertical, maxVertical, segments = 28) {
  const profile = sampleBodyProfile(ratio);
  const points = [];
  const x = toModelX(ratio);
  const halfHeight = profile.height * MODEL_LENGTH * 0.5;
  const halfWidth = profile.width * MODEL_LENGTH * 0.5;
  const yOffset = profile.yOffset * MODEL_LENGTH;

  for (let index = 0; index <= segments; index += 1) {
    const vertical = THREE.MathUtils.lerp(minVertical, maxVertical, index / segments);
    const y = yOffset + vertical * halfHeight;
    const zMagnitude = halfWidth * (1 - Math.abs(vertical) ** profile.power) ** (1 / profile.power);
    points.push([x, y, zMagnitude + 0.018]);
  }

  return points;
}

function signedPower(value, power) {
  return Math.sign(value) * Math.abs(value) ** (2 / power);
}
