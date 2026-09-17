import Box from '@mui/material/Box';

/**
 * DocSurface
 *
 * 제품 테마는 `mode: 'dark'` 라 `text.primary` 가 흰색인데
 * `background.default` 는 영상과 맞추려고 흰색으로 두었다.
 * CssBaseline 이 그 둘을 함께 칠하면 오버뷰 문서가 흰 바탕에 흰 글자가 된다.
 * 이 래퍼가 어두운 종이 토큰을 깔아 대비를 만든다. 색을 하드코딩하지 않는다.
 *
 * Props:
 * @param {React.ReactNode} children - 문서 본문 [Required]
 *
 * Example usage:
 * <DocSurface><DocumentTitle … /><PageContainer>…</PageContainer></DocSurface>
 */
function DocSurface({ children }) {
  return (
    <Box
      sx={ {
        backgroundColor: 'background.paper',
        color: 'text.primary',
        minHeight: '100vh',
        mt: '-40px',
        pt: '40px',
      } }
    >
      { children }
    </Box>
  );
}

export { DocSurface };
