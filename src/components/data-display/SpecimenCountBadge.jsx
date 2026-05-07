import { Box, Typography } from '@mui/material';

const CONDITION_LABEL = {
  deceased: { ko: '사체', en: 'deceased' },
  live: { ko: '생체', en: 'live' },
  mixed: { ko: '혼합', en: 'mixed' },
  remains: { ko: '잔해', en: 'remains' },
};

/**
 * SpecimenCountBadge 컴포넌트
 *
 * "1점 · 9,000마리" 형태의 정량 배지. 종 카드·작품 모달에서 강조 수치 노출.
 *
 * Props:
 * @param {number|null} count - 개체 수 (null이면 '미공개') [Optional]
 * @param {string} condition - 'deceased' | 'live' | 'mixed' | 'remains' [Optional]
 * @param {string} locale - 'ko' | 'en' [Optional, 기본값: 'ko']
 *
 * Example usage:
 * <SpecimenCountBadge count={ 9000 } condition="live" />
 */
export function SpecimenCountBadge({ count, condition, locale = 'ko' }) {
  const verified = count != null;
  const display = verified ? count.toLocaleString() : (locale === 'ko' ? '미공개' : 'undisclosed');
  const conditionText = condition && CONDITION_LABEL[condition]
    ? CONDITION_LABEL[condition][locale]
    : '';

  return (
    <Box
      sx={{
        display: 'inline-flex',
        alignItems: 'baseline',
        gap: 1,
        px: 1.5,
        py: 0.75,
        backgroundColor: verified ? 'primary.main' : 'action.disabledBackground',
        color: verified ? 'primary.contrastText' : 'text.secondary',
      }}
    >
      <Typography variant="h6" component="span" sx={{ fontFamily: 'inherit', fontWeight: 800 }}>
        { display }
      </Typography>
      { conditionText && (
        <Typography variant="overline" component="span">
          { conditionText }
        </Typography>
      ) }
    </Box>
  );
}
