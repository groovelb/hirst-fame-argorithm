import * as THREE from 'three';

export function createToothGeometry(scale = 1) {
  const outline = [
    [-0.052, 0],
    [-0.03, 0.018],
    [-0.045, 0.032],
    [-0.022, 0.05],
    [-0.033, 0.066],
    [-0.012, 0.083],
    [-0.018, 0.101],
    [0.008, 0.15],
    [0.042, 0.075],
    [0.028, 0.058],
    [0.058, 0.024],
    [0.048, 0],
  ];

  const shape = new THREE.Shape();
  outline.forEach(([x, y], index) => {
    const sx = x * scale;
    const sy = y * scale;

    if (index === 0) {
      shape.moveTo(sx, sy);
    } else {
      shape.lineTo(sx, sy);
    }
  });

  shape.closePath();

  const geometry = new THREE.ExtrudeGeometry(shape, {
    depth: 0.015 * scale,
    bevelEnabled: false,
  });

  geometry.center();
  geometry.computeVertexNormals();

  return geometry;
}
