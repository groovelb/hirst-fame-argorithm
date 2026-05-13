import * as THREE from 'three';

import { BODY_STATIONS, MODEL_LENGTH, toModelX } from './galeocerdoCuvierRatios';

const DORSAL_COLOR = new THREE.Color('#697775');
const LATERAL_COLOR = new THREE.Color('#9aa49f');
const VENTRAL_COLOR = new THREE.Color('#d8d6cc');

export function createBodyGeometry({
  length = MODEL_LENGTH,
  radialSegments = 40,
  stations = BODY_STATIONS,
} = {}) {
  const vertices = [];
  const colors = [];
  const indices = [];

  stations.forEach((station) => {
    const x = toModelX(station.x, length);
    const halfHeight = station.height * length * 0.5;
    const halfWidth = station.width * length * 0.5;
    const yOffset = station.yOffset * length;

    for (let segment = 0; segment < radialSegments; segment += 1) {
      const theta = (segment / radialSegments) * Math.PI * 2;
      const z = signedPower(Math.cos(theta), station.power) * halfWidth;
      const y = yOffset + signedPower(Math.sin(theta), station.power) * halfHeight;

      vertices.push(x, y, z);
      pushCountershadeColor(colors, y, yOffset, halfHeight);
    }
  });

  for (let station = 0; station < stations.length - 1; station += 1) {
    for (let segment = 0; segment < radialSegments; segment += 1) {
      const nextSegment = (segment + 1) % radialSegments;
      const a = station * radialSegments + segment;
      const b = station * radialSegments + nextSegment;
      const c = (station + 1) * radialSegments + segment;
      const d = (station + 1) * radialSegments + nextSegment;

      indices.push(a, c, b, b, c, d);
    }
  }

  addCap({
    vertices,
    colors,
    indices,
    radialSegments,
    ringStart: 0,
    reverse: true,
    color: LATERAL_COLOR,
  });

  addCap({
    vertices,
    colors,
    indices,
    radialSegments,
    ringStart: (stations.length - 1) * radialSegments,
    reverse: false,
    color: LATERAL_COLOR,
  });

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
  geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  geometry.computeBoundingBox();
  geometry.computeBoundingSphere();

  return geometry;
}

function signedPower(value, power) {
  return Math.sign(value) * Math.abs(value) ** (2 / power);
}

function pushCountershadeColor(colors, y, yOffset, halfHeight) {
  const normalized = THREE.MathUtils.clamp((y - yOffset) / (halfHeight || 1), -1, 1);
  const color = normalized >= 0
    ? LATERAL_COLOR.clone().lerp(DORSAL_COLOR, normalized)
    : LATERAL_COLOR.clone().lerp(VENTRAL_COLOR, Math.abs(normalized));

  colors.push(color.r, color.g, color.b);
}

function addCap({ vertices, colors, indices, radialSegments, ringStart, reverse, color }) {
  const centerIndex = vertices.length / 3;
  let x = 0;
  let y = 0;
  let z = 0;

  for (let segment = 0; segment < radialSegments; segment += 1) {
    const offset = (ringStart + segment) * 3;
    x += vertices[offset];
    y += vertices[offset + 1];
    z += vertices[offset + 2];
  }

  vertices.push(x / radialSegments, y / radialSegments, z / radialSegments);
  colors.push(color.r, color.g, color.b);

  for (let segment = 0; segment < radialSegments; segment += 1) {
    const nextSegment = (segment + 1) % radialSegments;
    const a = ringStart + segment;
    const b = ringStart + nextSegment;

    if (reverse) {
      indices.push(centerIndex, b, a);
    } else {
      indices.push(centerIndex, a, b);
    }
  }
}
