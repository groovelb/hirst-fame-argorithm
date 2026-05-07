import { Box, Container, Stack, Typography } from '@mui/material';

/**
 * EraSegment 컴포넌트
 *
 * 1개 Era(연대기)를 세로 1뷰포트 기준으로 호스팅하는 세그먼트 컨테이너.
 * 명제(thesis) · 시기 라벨 · 좌우 분할 슬롯(left/right)을 배치.
 * 도넛 · 사건 스트립 · 대표작 카드는 자식이 결정.
 *
 * Props:
 * @param {object} era - Era 데이터 1건 (id, slug, name, yearStart, yearEnd, thesis, summary) [Required]
 * @param {string} locale - 'ko' | 'en' [Optional, 기본값: 'ko']
 * @param {React.ReactNode} left - 좌측 슬롯(권장: 도넛 · 대표작) [Optional]
 * @param {React.ReactNode} right - 우측 슬롯(권장: 명제 · 사건 스트립 · 요약) [Optional]
 *
 * Example usage:
 * <EraSegment era={ era } locale="ko" left={ <KeywordAxisDonut … /> } right={ <EraEventStrip … /> } />
 */
export function EraSegment({ era, locale = 'ko', left, right }) {
  const name = era?.name?.[locale] ?? era?.name?.ko ?? era?.id ?? '';
  const period = `${era?.yearStart ?? ''}–${era?.yearEnd ?? ''}`;
  const labelId = (era?.id ?? '').replace('WV_', '');

  return (
    <Box
      component="section"
      id={ era?.slug ? `era-${era.slug}` : undefined }
      sx={{
        minHeight: { xs: 'auto', md: '100vh' },
        py: { xs: 6, md: 10 },
        borderTop: 1,
        borderColor: 'divider',
        scrollMarginTop: '64px',
      }}
    >
      <Container maxWidth="lg">
        <Stack spacing={ 4 }>
          <Typography variant="overline" color="text.secondary">
            { `WV · ${labelId} · ${period}` }
          </Typography>
          <Typography variant="h1" component="h2" sx={{ maxWidth: 880 }}>
            { name }
          </Typography>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: '5fr 7fr' },
              gap: { xs: 4, md: 6 },
              alignItems: 'start',
            }}
          >
            <Box>{ left }</Box>
            <Box>{ right }</Box>
          </Box>
        </Stack>
      </Container>
    </Box>
  );
}
