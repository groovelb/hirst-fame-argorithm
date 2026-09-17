import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import assetManifest from '../../data/assetManifest.json';
import { AssetGrid } from '../../common/ui/asset';

/**
 * src/assets/video/*.mp4 는 Vite 모듈 그래프에 있어 dev 서버에서 직접 경로 접근이 불가합니다.
 * import.meta.glob 으로 url 매핑 dict 를 만든 뒤 manifest item.path 를 변환해 전달합니다.
 */
const heroVideoUrlMap = import.meta.glob(
  '../../assets/video/*.mp4',
  { eager: true, query: '?url', import: 'default' }
);

const category = assetManifest.categories.find((c) => c.id === 'hero');

const resolvedItems = category.items.map((item) => {
  const filename = item.path.split('/').pop();
  const matchedKey = Object.keys(heroVideoUrlMap).find((k) => k.endsWith(`/${ filename }`));
  return matchedKey ? { ...item, path: heroVideoUrlMap[matchedKey] } : item;
});

export default {
  title: 'Common/Assets/Hero Video',
  parameters: { layout: 'padded' },
};

/** Hero scrub video - desktop / mobile 변형 비교 */
export const Gallery = () => (
  <Box>
    <Typography variant="h5" sx={ { fontWeight: 700, mb: 1 } }>
      { category.label }
    </Typography>
    <Typography variant="body2" color="text.secondary" sx={ { mb: 1 } }>
      { resolvedItems.length }개 · HeroSection.jsx scrub 영상. 데스크탑/모바일 두 가지 소스를 viewport 분기로 로딩.
    </Typography>
    <Typography variant="body2" color="text.secondary" sx={ { mb: 3 } }>
      소스는 src/assets/video/ 모듈 자산이며 Vite import url 로 해석합니다.
    </Typography>
    <AssetGrid
      items={ resolvedItems }
      columns={ { xs: 12, md: 6 } }
      cardProps={ { isAutoPlay: false, onHoverPlay: true } }
    />
  </Box>
);
