import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import assetManifest from '../../data/assetManifest.json';
import { AssetGrid } from '../../common/ui/asset';

const category = assetManifest.categories.find((c) => c.id === 'specimen-infographic');

export default {
  title: 'Assets/Specimen Infographic',
  parameters: { layout: 'padded' },
};

/** 듀오톤 재처리된 인포그래픽 9개 */
export const Gallery = () => (
  <Box>
    <Typography variant="h5" sx={ { fontWeight: 700, mb: 1 } }>
      { category.label }
    </Typography>
    <Typography variant="body2" color="text.secondary" sx={ { mb: 1 } }>
      { category.items.length }개 · 표본 인포그래픽 PNG. 본래 warm-tone 원본을 듀오톤으로 재합성.
    </Typography>
    <Typography variant="body2" color="text.secondary" sx={ { mb: 3 } }>
      파이프라인: scripts/retint-hirst-specimen-infographic.mjs - 참조 이미지의 dark/bright 5% 평균 RGB로 luma 매핑. 원본은 _warm-original/에 백업.
    </Typography>
    <AssetGrid
      items={ category.items }
      columns={ { xs: 12, sm: 6, md: 4 } }
    />
  </Box>
);
