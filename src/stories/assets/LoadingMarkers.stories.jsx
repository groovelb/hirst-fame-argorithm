import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import assetManifest from '../../data/assetManifest.json';
import { AssetGrid } from '../../common/ui/asset';

const category = assetManifest.categories.find((c) => c.id === 'loading-markers');

export default {
  title: 'Common/Assets/Loading & Markers',
  parameters: { layout: 'padded' },
};

/** Grotesque bitmap PNG 4종 - LoadingScreen / TimelineAxis 재사용 */
export const Gallery = () => (
  <Box>
    <Typography variant="h5" sx={ { fontWeight: 700, mb: 1 } }>
      { category.label }
    </Typography>
    <Typography variant="body2" color="text.secondary" sx={ { mb: 1 } }>
      { category.items.length }개 · grotesque-bitmap PNG. LoadingScreen과 TimelineAxis 마커에 재사용.
    </Typography>
    <Typography variant="body2" color="text.secondary" sx={ { mb: 3 } }>
      검은 실루엣으로 반전되어 컴포넌트별 톤에 맞춰 합성됨.
    </Typography>
    <AssetGrid
      items={ category.items }
      columns={ { xs: 12, sm: 6, md: 3 } }
    />
  </Box>
);
