import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import assetManifest from '../../data/assetManifest.json';
import { AssetGrid } from '../../common/ui/asset';

const category = assetManifest.categories.find((c) => c.id === 'rothko-reference');

export default {
  title: 'Common/Assets/Rothko Reference',
  parameters: { layout: 'padded' },
};

/** Rothko 비교 컨텍스트용 레퍼런스 60개 (사이트 노출 X) */
export const Gallery = () => (
  <Box>
    <Typography variant="h5" sx={ { fontWeight: 700, mb: 1 } }>
      { category.label }
    </Typography>
    <Typography variant="body2" color="text.secondary" sx={ { mb: 1 } }>
      { category.items.length }개 · 비교/대비 컨텍스트 자료. 본 사이트에는 직접 노출되지 않음.
    </Typography>
    <Typography variant="body2" color="text.secondary" sx={ { mb: 3 } }>
      파이프라인: scripts/extract-rothko-colors.mjs - 수평 밴드 luma 프로파일 + ΔE + k-means로 색상 추출 후 rothko_works.json에 in-place 반영.
    </Typography>
    <AssetGrid
      items={ category.items }
      columns={ { xs: 6, sm: 4, md: 3, lg: 2 } }
    />
  </Box>
);
