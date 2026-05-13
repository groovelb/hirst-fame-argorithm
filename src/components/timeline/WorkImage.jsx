import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

/**
 * WorkImage — 작품 이미지 + color_blocks 기반 fallback placeholder
 *
 * 이미지 파일이 없거나 로드 실패 시 work.color_blocks를 비율대로 쌓은
 * 수직 스트라이프 placeholder를 표시한다. 작품의 색 분포를
 * 시각적으로 유지하므로 broken image보다 의미가 있다.
 *
 * Props:
 * @param {Object} work - 작품 데이터 {image, title, color_blocks} [Required]
 * @param {Object} sx - 외부 컨테이너 sx (width/height/objectFit 등) [Optional]
 * @param {string} alt - 대체 텍스트 (없으면 work.title) [Optional]
 * @param {boolean} showTitleInPlaceholder - placeholder에 제목 표시 [Optional, 기본값: false]
 * @param {string} loading - img loading 속성 [Optional, 기본값: 'lazy']
 *
 * Example usage:
 * <WorkImage work={ work } sx={ { width: 60, height: 80 } } />
 */
function WorkImage({
  work,
  sx = {},
  alt,
  showTitleInPlaceholder = false,
  loading = 'lazy',
}) {
  /** 실패 상태를 src에 매핑 — work.image가 바뀌면 자동으로 재시도됨 */
  const [failedSrc, setFailedSrc] = useState(null);
  const currentSrc = work?.image;
  const failed = failedSrc !== null && failedSrc === currentSrc;

  if (!failed && currentSrc) {
    return (
      <Box
        component="img"
        src={ currentSrc }
        alt={ alt ?? work.title }
        loading={ loading }
        onError={ () => setFailedSrc(currentSrc) }
        sx={ sx }
      />
    );
  }

  /** Fallback: color_blocks를 ratio 비율대로 수직 스트라이프로 쌓음 */
  const blocks = work?.color_blocks || [];
  const totalRatio = blocks.reduce((s, b) => s + (b.ratio || 0), 0) || 1;

  return (
    <Box
      sx={ {
        ...sx,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        position: 'relative',
        boxSizing: 'border-box',
      } }
    >
      { blocks.length > 0 ? (
        blocks.map((block, i) => (
          <Box
            key={ i }
            sx={ {
              flex: (block.ratio || 0) / totalRatio,
              backgroundColor: block.color,
              minHeight: 0,
            } }
          />
        ))
      ) : (
        <Box sx={ { flex: 1, backgroundColor: 'action.disabledBackground' } } />
      ) }

      { showTitleInPlaceholder && work?.title && (
        <Box
          sx={ {
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            p: 1.5,
            background: 'linear-gradient(180deg, rgba(0,0,0,0) 40%, rgba(0,0,0,0.55) 100%)',
            pointerEvents: 'none',
          } }
        >
          <Typography
            variant="caption"
            sx={ {
              color: '#fff',
              textAlign: 'center',
              fontWeight: 500,
              lineHeight: 1.3,
              alignSelf: 'flex-end',
              width: '100%',
              textShadow: '0 1px 2px rgba(0,0,0,0.4)',
            } }
          >
            { work.title }
          </Typography>
        </Box>
      ) }
    </Box>
  );
}

export { WorkImage };
