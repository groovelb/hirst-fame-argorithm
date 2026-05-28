import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { formatFileSize } from './formatFileSize';

/**
 * ImageAssetCard 컴포넌트
 *
 * Storybook Asset 카탈로그용 이미지 자산 카드.
 * 이미지 프리뷰와 메타 정보(label, usage, sourcePipeline, format, fileSize)를 함께 표시한다.
 *
 * 동작 방식:
 * 1. 16:10 비율 컨테이너에 이미지를 contain으로 표시
 * 2. 배경은 grey.100 (투명 PNG/SVG 대응)
 * 3. 메타 영역에 label / usage / sourcePipeline / format · 사이즈 표시
 *
 * Props:
 * @param {string} src - 이미지 경로 [Required]
 * @param {string} label - 자산 라벨 [Required]
 * @param {string} usage - 사용처 설명 [Optional]
 * @param {string} sourcePipeline - 생성 파이프라인 라벨 [Optional]
 * @param {string} format - 포맷 (예: 'PNG', 'JPG', 'SVG') [Optional]
 * @param {number} fileSizeBytes - 파일 사이즈 (bytes) [Optional]
 *
 * Example usage:
 * <ImageAssetCard
 *   src="/images/hirst/001.jpg"
 *   label="Spot Painting 001"
 *   usage="Timeline thumbnail"
 *   sourcePipeline="Wikimedia → sharp resize"
 *   format="JPG"
 *   fileSizeBytes={ 245760 }
 * />
 */
function ImageAssetCard({
  src,
  label,
  usage,
  sourcePipeline,
  format,
  fileSizeBytes,
}) {
  const sizeLabel = formatFileSize(fileSizeBytes);
  const formatAndSize = [format, sizeLabel].filter(Boolean).join(' · ');

  return (
    <Card
      variant="outlined"
      sx={ {
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        borderRadius: 1,
      } }
    >
      <Box
        sx={ {
          width: '100%',
          backgroundColor: 'grey.900',
          display: 'block',
        } }
      >
        <Box
          component="img"
          src={ src }
          alt={ label }
          loading="lazy"
          sx={ {
            width: '100%',
            height: 'auto',
            display: 'block',
          } }
        />
      </Box>

      <Stack spacing={ 0.75 } sx={ { p: 2 } }>
        <Stack direction="row" spacing={ 1 } alignItems="center" sx={ { minWidth: 0 } }>
          <Typography
            variant="subtitle2"
            sx={ {
              fontWeight: 600,
              flex: 1,
              minWidth: 0,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            } }
          >
            { label }
          </Typography>
          { format && (
            <Chip
              label={ format }
              size="small"
              sx={ {
                height: 20,
                fontSize: '0.65rem',
                fontFamily: 'monospace',
              } }
            />
          ) }
        </Stack>

        { usage && (
          <Typography variant="body2" color="text.secondary">
            { usage }
          </Typography>
        ) }

        { sourcePipeline && (
          <Typography
            variant="caption"
            sx={ {
              color: 'text.disabled',
              fontFamily: 'monospace',
            } }
          >
            { sourcePipeline }
          </Typography>
        ) }

        { formatAndSize && (
          <Typography
            variant="caption"
            sx={ {
              color: 'text.disabled',
              fontFamily: 'monospace',
            } }
          >
            { formatAndSize }
          </Typography>
        ) }
      </Stack>
    </Card>
  );
}

export { ImageAssetCard };
export default ImageAssetCard;
