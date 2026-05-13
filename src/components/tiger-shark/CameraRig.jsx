/* eslint-disable react-hooks/immutability -- Three.js camera and controls are imperative runtime objects. */
import { useEffect } from 'react';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';

const VIEW_CONFIG = {
  inspect: {
    position: [6.8, 3.2, 6.2],
    up: [0, 1, 0],
    target: [0, 0, 0],
    fit: 'model',
  },
  side: {
    position: [0, 0, 12],
    up: [0, 1, 0],
    target: [0, 0, 0],
    fit: 'long',
  },
  dorsal: {
    position: [0, 12, 0],
    up: [0, 0, -1],
    target: [0, 0, 0],
    fit: 'long',
  },
  ventral: {
    position: [0, -12, 0],
    up: [0, 0, 1],
    target: [0, 0, 0],
    fit: 'long',
  },
  front: {
    position: [-12, 0, 0],
    up: [0, 1, 0],
    target: [-4.9, 0, 0],
    fit: 'cross',
  },
  rear: {
    position: [12, 0, 0],
    up: [0, 1, 0],
    target: [4.1, 0, 0],
    fit: 'cross',
  },
};

export function CameraRig({ view, controlsRef }) {
  const { camera, size } = useThree();

  useEffect(() => {
    const config = VIEW_CONFIG[view] || VIEW_CONFIG.inspect;
    const zoom = getFitZoom(config.fit, size);

    camera.position.set(...config.position);
    camera.up.set(...config.up);
    camera.zoom = zoom;
    camera.near = 0.1;
    camera.far = 100;
    camera.lookAt(new THREE.Vector3(...config.target));
    camera.updateProjectionMatrix();

    if (controlsRef.current) {
      controlsRef.current.target.set(...config.target);
      controlsRef.current.enableRotate = view === 'inspect';
      controlsRef.current.update();
    }
  }, [camera, controlsRef, size, view]);

  return null;
}

function getFitZoom(fit, size) {
  if (fit === 'cross') {
    return Math.min(size.width / 3.9, size.height / 3.6);
  }

  if (fit === 'long') {
    return Math.min(size.width / 11.6, size.height / 3.95);
  }

  return Math.min(size.width / 10.8, size.height / 5.2);
}
