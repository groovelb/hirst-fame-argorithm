import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import assetManifest from '../../data/assetManifest.json';
import { AssetGrid } from '../../common/ui/asset';

const category = assetManifest.categories.find((c) => c.id === 'works');

export default {
  title: 'Common/Assets/Works (Hirst 72)',
  parameters: { layout: 'padded' },
};

/** Hirst 작품 썸네일 72개 */
export const Gallery = () => (
  <Box>
    <Typography variant="h5" sx={ { fontWeight: 700, mb: 1 } }>
      { category.label }
    </Typography>
    <Typography variant="body2" color="text.secondary" sx={ { mb: 1 } }>
      { category.items.length }개 · W001~W072. 1986년 데뷔부터 2020년대 후반까지의 대표작.
    </Typography>
    <Typography variant="body2" color="text.secondary" sx={ { mb: 3 } }>
      파이프라인: scripts/fetch-hirst-images.mjs - Wikipedia/Commons/Bing/Google 다중 소스 후보 랭킹 + MD5 dedupe.
    </Typography>
    <AssetGrid
      items={ category.items }
      columns={ { xs: 6, sm: 4, md: 3, lg: 2 } }
    />
  </Box>
);
