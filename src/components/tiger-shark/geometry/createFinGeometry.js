import * as THREE from 'three';

export function createMedianFinGeometry(points, halfThickness = 0.035) {
  const vertices = [];
  const indices = [];

  points.forEach((point) => {
    vertices.push(point.x, point.y, halfThickness);
  });

  points.forEach((point) => {
    vertices.push(point.x, point.y, -halfThickness);
  });

  for (let index = 1; index < points.length - 1; index += 1) {
    indices.push(0, index, index + 1);
    indices.push(points.length, points.length + index + 1, points.length + index);
  }

  for (let index = 0; index < points.length; index += 1) {
    const nextIndex = (index + 1) % points.length;
    const a = index;
    const b = nextIndex;
    const c = points.length + index;
    const d = points.length + nextIndex;

    indices.push(a, b, c, b, d, c);
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  geometry.computeBoundingBox();
  geometry.computeBoundingSphere();

  return geometry;
}

export function createWingFinGeometry(points) {
  const vertices = points.flatMap((point) => [point.x, point.y, point.z]);
  const indices = [];

  for (let index = 1; index < points.length - 1; index += 1) {
    indices.push(0, index, index + 1);
    indices.push(0, index + 1, index);
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  geometry.computeBoundingBox();
  geometry.computeBoundingSphere();

  return geometry;
}
