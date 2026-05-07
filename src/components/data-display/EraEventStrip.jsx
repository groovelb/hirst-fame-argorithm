import { Box, Stack, Typography } from '@mui/material';

/**
 * EraEventStrip 컴포넌트
 *
 * Era 안의 사건들을 좌→우로 가로 스크롤로 노출. 각 사건은 연도·제목·1줄 설명을 표시.
 *
 * Props:
 * @param {array} events - Event 배열 (id, year, title, description, ...) [Required]
 * @param {string} locale - 'ko' | 'en' [Optional, 기본값: 'ko']
 *
 * Example usage:
 * <EraEventStrip events={ filteredEvents } locale="ko" />
 */
export function EraEventStrip({ events = [], locale = 'ko' }) {
  if (events.length === 0) return null;

  return (
    <Box
      sx={{
        display: 'flex',
        gap: 2,
        overflowX: 'auto',
        pb: 1,
        scrollSnapType: 'x mandatory',
      }}
    >
      { events.map((ev) => {
        const title = typeof ev.title === 'object' ? (ev.title[locale] ?? ev.title.ko) : ev.title;
        const desc = typeof ev.description === 'object'
          ? (ev.description[locale] ?? ev.description.ko)
          : ev.description;
        return (
          <Box
            key={ ev.id }
            sx={{
              flex: '0 0 280px',
              p: 2,
              border: 1,
              borderColor: 'divider',
              backgroundColor: 'background.paper',
              scrollSnapAlign: 'start',
            }}
          >
            <Stack spacing={ 1 }>
              <Typography variant="overline" color="primary.main">
                { ev.year }
              </Typography>
              <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                { title }
              </Typography>
              { desc && (
                <Typography variant="body2" color="text.secondary">
                  { desc }
                </Typography>
              ) }
            </Stack>
          </Box>
        );
      }) }
    </Box>
  );
}
