import Box from '@mui/material/Box';

/**
 * StoryStage
 *
 * 제품 테마가 `mode: 'dark'` 라 글자가 흰색인데 `background.default` 는 흰색이다.
 * 스토리 캔버스에 그대로 두면 흰 바탕에 흰 글자가 된다.
 * 이 래퍼가 어두운 종이 토큰 위에 글자 토큰을 얹어 대비를 만든다. 색을 하드코딩하지 않는다.
 *
 * Props:
 * @param {React.ReactNode} children - 감쌀 내용 [Required]
 * @param {number|string} minHeight - 최소 높이 [Optional, 기본값: 'auto']
 * @param {number} padding - theme.spacing 배수 [Optional, 기본값: 3]
 * @param {boolean} isFlush - true면 패딩 없이 꽉 채운다 [Optional, 기본값: false]
 *
 * Example usage:
 * <StoryStage minHeight={ 480 }><Component /></StoryStage>
 */
function StoryStage({ children, minHeight = 'auto', padding = 3, isFlush = false }) {
  return (
    <Box
      sx={ {
        backgroundColor: 'background.paper',
        color: 'text.primary',
        minHeight,
        p: isFlush ? 0 : padding,
        position: 'relative',
        overflow: 'hidden',
      } }
    >
      { children }
    </Box>
  );
}

export { StoryStage };
