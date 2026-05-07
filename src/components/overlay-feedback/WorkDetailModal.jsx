import { Dialog, DialogContent, DialogTitle, IconButton, Stack, Typography } from '@mui/material';
import { X } from 'lucide-react';

import { SourceChip } from '../data-display/SourceChip.jsx';
import { SpecimenCountBadge } from '../data-display/SpecimenCountBadge.jsx';

/**
 * WorkDetailModal 컴포넌트
 *
 * 작품 상세 모달. 매체 · 사용 종 · 소속 Era · 출처 칩 · Era 사상 1~2줄.
 * 기존 ColorDetailModal 자리에 들어가는 신규 모달.
 *
 * Props:
 * @param {boolean} isOpen - 열림 여부 [Required]
 * @param {function} onClose - 닫기 콜백 [Required]
 * @param {object} work - Work 1건 (id, year, title, medium, ...) [Required]
 * @param {object} bioRecord - 해당 작품의 BioSpecimenRecord (artworks[]의 1개) [Optional]
 * @param {object} era - 소속 Era [Optional]
 * @param {array} sources - 연결된 Source 배열 [Optional]
 * @param {string} locale - 'ko' | 'en' [Optional, 기본값: 'ko']
 *
 * Example usage:
 * <WorkDetailModal isOpen={ open } onClose={ close } work={ w } bioRecord={ b } era={ e } sources={ ss } />
 */
export function WorkDetailModal({
  isOpen,
  onClose,
  work,
  bioRecord,
  era,
  sources = [],
  locale = 'ko',
}) {
  if (!work) return null;
  const title = typeof work.title === 'object' ? (work.title[locale] ?? work.title.en) : work.title;
  const eraName = era?.name?.[locale] ?? era?.name?.ko ?? '';

  return (
    <Dialog open={ isOpen } onClose={ onClose } maxWidth="md" fullWidth>
      <DialogTitle sx={{ pr: 6 }}>
        <Stack spacing={ 0.5 }>
          <Typography variant="overline" color="text.secondary">
            { `${work.year ?? ''} · ${eraName}` }
          </Typography>
          <Typography variant="h4" component="span" sx={{ fontWeight: 800 }}>
            { title }
          </Typography>
        </Stack>
        <IconButton
          onClick={ onClose }
          sx={{ position: 'absolute', top: 8, right: 8 }}
          aria-label="close"
        >
          <X size={ 20 } />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        <Stack spacing={ 3 }>
          { work.medium && (
            <Stack spacing={ 0.5 }>
              <Typography variant="overline" color="text.secondary">
                { locale === 'ko' ? '매체' : 'medium' }
              </Typography>
              <Typography variant="body2">{ work.medium }</Typography>
            </Stack>
          ) }

          { bioRecord && bioRecord.species && (
            <Stack spacing={ 1 }>
              <Typography variant="overline" color="text.secondary">
                { locale === 'ko' ? '사용 종' : 'species used' }
              </Typography>
              <Stack direction="row" spacing={ 1 } flexWrap="wrap" useFlexGap>
                { bioRecord.species.map((s, i) => (
                  <Stack key={ i } direction="row" spacing={ 1 } alignItems="center">
                    <SpecimenCountBadge count={ s.count } condition={ s.condition } locale={ locale } />
                    <Typography variant="body2">
                      { s.commonName ?? '—' }
                      { s.scientific && (
                        <Typography component="span" variant="caption" color="text.secondary" sx={{ ml: 0.5, fontStyle: 'italic' }}>
                          { s.scientific }
                        </Typography>
                      ) }
                    </Typography>
                  </Stack>
                )) }
              </Stack>
              { bioRecord.note && (
                <Typography variant="caption" color="text.secondary">
                  { bioRecord.note }
                </Typography>
              ) }
            </Stack>
          ) }

          { sources.length > 0 && (
            <Stack spacing={ 1 }>
              <Typography variant="overline" color="text.secondary">
                { locale === 'ko' ? '출처' : 'sources' }
              </Typography>
              <Stack direction="row" spacing={ 1 } flexWrap="wrap" useFlexGap>
                { sources.map((s) => (
                  <SourceChip key={ s.id } source={ s } />
                )) }
              </Stack>
            </Stack>
          ) }
        </Stack>
      </DialogContent>
    </Dialog>
  );
}
