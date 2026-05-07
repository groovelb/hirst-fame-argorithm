import { Box, Stack, Typography } from '@mui/material';
import { AlertTriangle } from 'lucide-react';

/**
 * CaveatNote 컴포넌트
 *
 * 통계 해석의 단서를 강조하는 주석 블록. 푸터·모달·도감 하단에 사용.
 *
 * Props:
 * @param {string} title - 주석 제목 [Optional]
 * @param {React.ReactNode} children - 본문 [Required]
 * @param {string} severity - 'info' | 'warning' [Optional, 기본값: 'info']
 *
 * Example usage:
 * <CaveatNote title="2012 Tate 한정">9,000마리는 단일 전시 23주 누적 수치이며…</CaveatNote>
 */
export function CaveatNote({ title, children, severity = 'info' }) {
  const accent = severity === 'warning' ? 'warning.main' : 'primary.main';
  return (
    <Box
      sx={{
        p: 2,
        borderLeft: 3,
        borderColor: accent,
        backgroundColor: 'background.paper',
      }}
    >
      <Stack direction="row" spacing={ 1.5 } alignItems="flex-start">
        <Box sx={{ color: accent, lineHeight: 0, mt: 0.5 }}>
          <AlertTriangle size={ 16 } />
        </Box>
        <Stack spacing={ 0.5 }>
          { title && (
            <Typography variant="overline" color="text.primary">
              { title }
            </Typography>
          ) }
          <Typography variant="body2" color="text.secondary">
            { children }
          </Typography>
        </Stack>
      </Stack>
    </Box>
  );
}
