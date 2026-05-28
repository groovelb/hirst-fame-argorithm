import { useCallback, useRef } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { formatFileSize } from './formatFileSize';

/**
 * VideoAssetCard 컴포넌트
 *
 * Storybook Asset 카탈로그용 비디오 자산 카드.
 * 비디오 프리뷰와 메타 정보(label, usage, sourcePipeline, promptRef, fileSize)를 함께 표시한다.
 *
 * 동작 방식:
 * 1. 16:9 비율 컨테이너에 <video muted playsInline preload="metadata"> 렌더
 * 2. isAutoPlay=true 면 자동 재생(muted+loop+autoplay)
 * 3. onHoverPlay=true (기본) 면 hover/focus 시 재생, leave/blur 시 일시정지
 * 4. promptRef가 있으면 메타 영역에 모노스페이스 뱃지로 표시
 *
 * Props:
 * @param {string} src - 비디오 경로 [Required]
 * @param {string} label - 자산 라벨 [Required]
 * @param {string} usage - 사용처 설명 [Optional]
 * @param {string} sourcePipeline - 생성 파이프라인 라벨 [Optional]
 * @param {string} promptRef - 프롬프트 .md 경로 [Optional]
 * @param {number} fileSizeBytes - 파일 사이즈 (bytes) [Optional]
 * @param {boolean} isAutoPlay - 자동 재생 여부 [Optional, 기본값: false]
 * @param {boolean} onHoverPlay - hover 재생 여부 [Optional, 기본값: true]
 *
 * Example usage:
 * <VideoAssetCard
 *   src="/videos/hirst/hero.mp4"
 *   label="Hirst Hero Motion"
 *   usage="Landing hero"
 *   sourcePipeline="Kling AI"
 *   promptRef="scripts/prompts/hero-motion.md"
 *   fileSizeBytes={ 5242880 }
 * />
 */
function VideoAssetCard({
  src,
  label,
  usage,
  sourcePipeline,
  promptRef,
  fileSizeBytes,
  isAutoPlay = false,
  onHoverPlay = true,
}) {
  const videoRef = useRef(null);

  const handleEnter = useCallback(() => {
    if (!onHoverPlay || isAutoPlay) return;
    const node = videoRef.current;
    if (node && node.paused) {
      const playPromise = node.play();
      if (playPromise && typeof playPromise.catch === 'function') {
        playPromise.catch(() => { /* autoplay block 시 무시 */ });
      }
    }
  }, [onHoverPlay, isAutoPlay]);

  const handleLeave = useCallback(() => {
    if (!onHoverPlay || isAutoPlay) return;
    const node = videoRef.current;
    if (node && !node.paused) {
      node.pause();
    }
  }, [onHoverPlay, isAutoPlay]);

  const sizeLabel = formatFileSize(fileSizeBytes);

  return (
    <Card
      variant="outlined"
      sx={ {
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        borderRadius: 1,
      } }
      onMouseEnter={ handleEnter }
      onMouseLeave={ handleLeave }
      onFocus={ handleEnter }
      onBlur={ handleLeave }
      tabIndex={ 0 }
    >
      <Box
        sx={ {
          width: '100%',
          backgroundColor: 'grey.900',
          display: 'block',
        } }
      >
        <Box
          ref={ videoRef }
          component="video"
          src={ src }
          muted
          playsInline
          loop
          preload="metadata"
          autoPlay={ isAutoPlay }
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
          <Chip
            label="MP4"
            size="small"
            sx={ {
              height: 20,
              fontSize: '0.65rem',
              fontFamily: 'monospace',
            } }
          />
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

        { promptRef && (
          <Box>
            <Chip
              label={ promptRef }
              size="small"
              variant="outlined"
              sx={ {
                height: 20,
                fontSize: '0.65rem',
                fontFamily: 'monospace',
                maxWidth: '100%',
                '& .MuiChip-label': {
                  px: 1,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                },
              } }
            />
          </Box>
        ) }

        { sizeLabel && (
          <Typography
            variant="caption"
            sx={ {
              color: 'text.disabled',
              fontFamily: 'monospace',
            } }
          >
            { sizeLabel }
          </Typography>
        ) }
      </Stack>
    </Card>
  );
}

export { VideoAssetCard };
export default VideoAssetCard;
