import Grid from '@mui/material/Grid';
import { ImageAssetCard } from './ImageAssetCard';
import { ModelAssetCard } from './ModelAssetCard';
import { VideoAssetCard } from './VideoAssetCard';

/** kind → 카드 컴포넌트 매핑 */
const CARD_MAP = {
  image: ImageAssetCard,
  video: VideoAssetCard,
  model: ModelAssetCard,
};

/**
 * AssetGrid 컴포넌트
 *
 * 자산 매니페스트 아이템 배열을 MUI v7 Grid에 카드로 렌더링한다.
 * kind='auto'(기본)이면 각 item의 kind 필드로 Image/Video/Model 카드를 자동 분기한다.
 *
 * 동작 방식:
 * 1. <Grid container spacing={ 2 }>로 외곽 컨테이너 구성
 * 2. 각 item을 <Grid size={ columns }>로 감싸 반응형 컬럼 적용
 * 3. kind 분기: 'auto'면 item.kind, 그 외 prop kind로 고정
 * 4. cardProps는 모든 카드에 spread되어 일괄 옵션 전달 (예: { isAutoPlay: true })
 *
 * Props:
 * @param {array} items - manifest item 배열 [Required]
 * @param {object} columns - MUI Grid size prop [Optional, 기본값: { xs: 12, sm: 6, md: 4, lg: 3 }]
 * @param {string} kind - 'image' | 'video' | 'model' | 'auto' [Optional, 기본값: 'auto']
 * @param {object} cardProps - 카드에 spread될 추가 props [Optional]
 *
 * Example usage:
 * <AssetGrid items={ items } columns={ { xs: 12, md: 6 } } cardProps={ { isAutoPlay: true } } />
 */
function AssetGrid({
  items,
  columns = { xs: 12, sm: 6, md: 4, lg: 3 },
  kind = 'auto',
  cardProps = {},
}) {
  return (
    <Grid container spacing={ 2 }>
      { items.map((item, index) => {
        const resolvedKind = kind === 'auto' ? item.kind : kind;
        const CardComponent = CARD_MAP[resolvedKind] || ImageAssetCard;
        const src = item.src || item.path;
        const key = item.id || src || `${resolvedKind}-${index}`;

        return (
          <Grid key={ key } size={ columns }>
            <CardComponent { ...item } src={ src } { ...cardProps } />
          </Grid>
        );
      }) }
    </Grid>
  );
}

export { AssetGrid };
export default AssetGrid;
