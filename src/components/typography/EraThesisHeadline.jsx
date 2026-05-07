import { Stack, Typography } from '@mui/material';

/**
 * EraThesisHeadline 컴포넌트
 *
 * Era 진입부의 시기 명제(thesis) 헤드라인 + 보조 요약 1단락.
 * 박물지 표지 비율의 h1 + body1 조합.
 *
 * Props:
 * @param {object} thesis - { ko, en } 명제 객체 [Required]
 * @param {object} summary - { ko, en } 요약 객체 [Optional]
 * @param {string} locale - 'ko' | 'en' [Optional, 기본값: 'ko']
 *
 * Example usage:
 * <EraThesisHeadline thesis={ era.thesis } summary={ era.summary } locale="ko" />
 */
export function EraThesisHeadline({ thesis, summary, locale = 'ko' }) {
  const t = thesis?.[locale] ?? thesis?.ko ?? '';
  const s = summary?.[locale] ?? summary?.ko ?? '';

  return (
    <Stack spacing={ 2 }>
      <Typography
        variant="h3"
        component="p"
        sx={{
          fontStyle: 'italic',
          color: 'text.primary',
          letterSpacing: '-0.01em',
        }}
      >
        { t }
      </Typography>
      { s && (
        <Typography variant="body1" color="text.secondary">
          { s }
        </Typography>
      ) }
    </Stack>
  );
}
