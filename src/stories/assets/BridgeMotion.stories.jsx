import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import assetManifest from '../../data/assetManifest.json';
import { AssetGrid } from '../../common/ui/asset';

const category = assetManifest.categories.find((c) => c.id === 'bridge-motion');

export default {
  title: 'Assets/Bridge Motion',
  parameters: { layout: 'padded' },
};

/** 섹션 전환용 Kling MP4 4종 */
export const Gallery = () => (
  <Box>
    <Typography variant="h5" sx={ { fontWeight: 700, mb: 1 } }>
      { category.label }
    </Typography>
    <Typography variant="body2" color="text.secondary" sx={ { mb: 1 } }>
      { category.items.length }개 · 섹션 간 브릿지 모션 MP4. Kling video / o1로 생성.
    </Typography>
    <Typography variant="body2" color="text.secondary" sx={ { mb: 3 } }>
      각 카드 하단에 promptRef 칩으로 사용된 프롬프트 파일 경로 노출.
    </Typography>
    <AssetGrid
      items={ category.items }
      columns={ { xs: 12, sm: 6, md: 6, lg: 3 } }
      cardProps={ { isAutoPlay: false, onHoverPlay: true } }
    />
  </Box>
);
