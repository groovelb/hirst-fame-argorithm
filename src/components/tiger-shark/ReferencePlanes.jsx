import { useMemo } from 'react';
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';

import { REFERENCE_VIEWS } from './geometry/galeocerdoCuvierRatios';

const PLANE_CONFIG = {
  side: {
    position: [0, 0, -1.55],
    rotation: [0, 0, 0],
    scale: [10.6, 3.25, 1],
  },
  dorsal: {
    position: [0, -1.35, 0],
    rotation: [-Math.PI / 2, 0, 0],
    scale: [10.6, 3.2, 1],
  },
  ventral: {
    position: [0, 1.35, 0],
    rotation: [Math.PI / 2, 0, 0],
    scale: [10.6, 3.2, 1],
  },
  front: {
    position: [-5.35, 0, 0],
    rotation: [0, Math.PI / 2, 0],
    scale: [3.3, 3.3, 1],
  },
  rear: {
    position: [5.35, 0, 0],
    rotation: [0, Math.PI / 2, 0],
    scale: [3.3, 3.3, 1],
  },
  internal: {
    position: [0, 0, -1.55],
    rotation: [0, 0, 0],
    scale: [10.6, 3.25, 1],
  },
};

export function ReferencePlanes({ activeView, visible }) {
  const textures = useTexture(REFERENCE_VIEWS.map((view) => view.src));
  const textureById = useMemo(() => {
    return Object.fromEntries(REFERENCE_VIEWS.map((view, index) => [view.id, textures[index]]));
  }, [textures]);

  if (!visible) {
    return null;
  }

  const referenceId = activeView === 'inspect' ? 'side' : activeView;
  const config = PLANE_CONFIG[referenceId];
  const texture = textureById[referenceId];

  if (!config || !texture) {
    return null;
  }

  return (
    <mesh position={ config.position } rotation={ config.rotation } scale={ config.scale } renderOrder={ -10 }>
      <planeGeometry args={ [1, 1] } />
      <meshBasicMaterial
        map={ texture }
        transparent
        opacity={ 0.23 }
        side={ THREE.DoubleSide }
        depthWrite={ false }
        toneMapped={ false }
      />
    </mesh>
  );
}
