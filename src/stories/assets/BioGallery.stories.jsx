import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import assetManifest from '../../data/assetManifest.json';
import { AssetGrid } from '../../common/ui/asset';

const category = assetManifest.categories.find((c) => c.id === 'bio');

export default {
  title: 'Assets/Bio Gallery',
  parameters: { layout: 'padded' },
};

/** Bio 섹션 갤러리 9개 */
export const Gallery = () => (
  <Box>
    <Typography variant="h5" sx={ { fontWeight: 700, mb: 1 } }>
      { category.label }
    </Typography>
    <Typography variant="body2" color="text.secondary" sx={ { mb: 1 } }>
      { category.items.length }개 · 작가 약력/연대기 섹션에 사용되는 보조 이미지.
    </Typography>
    <Typography variant="body2" color="text.secondary" sx={ { mb: 3 } }>
      파이프라인: scripts/fetch-bio-specimen-images.mjs - 하드코딩 TARGETS 배열을 외부 이미지 검색으로 수집.
    </Typography>
    <AssetGrid
      items={ category.items }
      columns={ { xs: 12, sm: 6, md: 4 } }
    />
  </Box>
);
