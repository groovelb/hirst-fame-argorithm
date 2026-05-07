import { useState } from 'react';
import { Chip, Popover, Stack, Typography } from '@mui/material';

/**
 * SourceChip 컴포넌트
 *
 * 출처 1건을 표시하는 칩. 클릭 시 인용·발췌·검증 여부 팝오버.
 *
 * Props:
 * @param {object} source - Source 1건 (id, type, citation, quote, verified, note) [Required]
 * @param {string} label - 칩 라벨(없으면 source.id 사용) [Optional]
 *
 * Example usage:
 * <SourceChip source={ src } label="NYT 2005" />
 */
export function SourceChip({ source, label }) {
  const [anchor, setAnchor] = useState(null);
  if (!source) return null;

  return (
    <>
      <Chip
        size="small"
        label={ label ?? source.id }
        variant={ source.verified ? 'filled' : 'outlined' }
        onClick={ (e) => setAnchor(e.currentTarget) }
        sx={{ fontFamily: 'monospace', cursor: 'pointer' }}
      />
      <Popover
        open={ Boolean(anchor) }
        anchorEl={ anchor }
        onClose={ () => setAnchor(null) }
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <Stack spacing={ 1 } sx={{ p: 2, maxWidth: 420 }}>
          <Typography variant="overline" color="text.secondary">
            { source.type ?? 'source' }{ source.verified ? ' · verified' : ' · unverified' }
          </Typography>
          <Typography variant="body2">
            { source.citation }
          </Typography>
          { source.quote && (
            <Typography variant="body2" sx={{ fontStyle: 'italic', color: 'text.secondary' }}>
              { `"${source.quote}"` }
            </Typography>
          ) }
          { source.note && (
            <Typography variant="caption" color="text.secondary">
              { source.note }
            </Typography>
          ) }
        </Stack>
      </Popover>
    </>
  );
}
