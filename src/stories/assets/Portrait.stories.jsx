import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import assetManifest from '../../data/assetManifest.json';
import { AssetGrid } from '../../common/ui/asset';

const category = assetManifest.categories.find((c) => c.id === 'portrait');

export default {
  title: 'Common/Assets/Artist Portrait',
  parameters: { layout: 'padded' },
};

/** Damien Hirst 작가 초상 1개 */
export const Gallery = () => (
  <Box>
    <Typography variant="h5" sx={ { fontWeight: 700, mb: 1 } }>
      { category.label }
    </Typography>
    <Typography variant="body2" color="text.secondary" sx={ { mb: 1 } }>
      { category.items.length }개 · Damien Hirst 작가 초상. 인트로 / Bio 헤더에 사용.
    </Typography>
    <Typography variant="body2" color="text.secondary" sx={ { mb: 3 } }>
      파이프라인: Wikimedia에서 수동 추가 후 hirst 작품 fetch 스크립트와 동일 위치에 보관.
    </Typography>
    <AssetGrid
      items={ category.items }
      columns={ { xs: 12, sm: 6, md: 4 } }
    />
  </Box>
);
