import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import assetManifest from '../../data/assetManifest.json';
import { AssetGrid } from '../../common/ui/asset';

const category = assetManifest.categories.find((c) => c.id === 'shark-3d');

export default {
  title: 'Common/Assets/3D Shark + Reference',
  parameters: { layout: 'padded' },
};

/** GLB 2개 + 레퍼런스 PNG 8개 자동 분기 */
export const Gallery = () => (
  <Box>
    <Typography variant="h5" sx={ { fontWeight: 700, mb: 1 } }>
      { category.label }
    </Typography>
    <Typography variant="body2" color="text.secondary" sx={ { mb: 1 } }>
      { category.items.length }개 · GLB 모델 2개 + 포즈/레퍼런스 PNG 8개. R3F + OrbitControls로 인터랙티브 회전 가능.
    </Typography>
    <Typography variant="body2" color="text.secondary" sx={ { mb: 3 } }>
      파이프라인: crysis_shark.glb → scripts/blender/pose_shark_hirst.py - Blender에서 포즈 + 키프레임 렌더 → Kling 입력.
    </Typography>
    <AssetGrid
      items={ category.items }
      columns={ { xs: 12, sm: 6, md: 4, lg: 3 } }
    />
  </Box>
);
