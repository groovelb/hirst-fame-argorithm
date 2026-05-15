import React, { useMemo } from 'react';
import Box from '@mui/material/Box';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { X } from 'lucide-react';

import { useLocale } from '../../i18n';
import { TOKENS } from '../../styles/themes/tokens.js';

/** species key → bioData.artworks 매칭 규칙 */
const SPECIES_MATCHERS = {
  butterfly_live_2012: (a) => a.id === 'in-and-out-of-love-1991' || /in and out of love/i.test(a.titleEn ?? ''),
  shark: (a) => a.species?.some((s) => /shark/i.test(s.commonName ?? '')),
  sheep: (a) => a.species?.some((s) => /sheep|lamb/i.test(s.commonName ?? '')),
  bovine: (a) => a.species?.some((s) => /bull|cow|calf|bovine/i.test(s.commonName ?? '')),
  pig: (a) => a.species?.some((s) => /pig|piglet/i.test(s.commonName ?? '')),
  zebra: (a) => a.species?.some((s) => /zebra/i.test(s.commonName ?? '')),
  dove: (a) => a.species?.some((s) => /dove|pigeon/i.test(s.commonName ?? '')),
  cockerel: (a) => a.species?.some((s) => /cockerel|chicken|rooster/i.test(s.commonName ?? '')),
};

function formatCount(value, locale) {
  if (!Number.isFinite(value)) return locale === 'ko' ? '미공개' : '—';
  return value.toLocaleString(locale === 'ko' ? 'ko-KR' : 'en-US');
}

/**
 * SpecimenDetailModal — 종(species) 상세 모달
 *
 * ColorDetailModal과 동일한 레이아웃 패턴(헤더 + 본문 그리드).
 *
 * Props:
 * @param {boolean} open - 모달 열림 여부 [Required]
 * @param {function} onClose - 닫기 콜백 [Required]
 * @param {Object|null} species - 선택된 종 { key, labelKo, labelEn, image, count, scientific } [Optional]
 * @param {Array} artworks - bioData.artworks 전체 [Optional]
 *
 * Example usage:
 * <SpecimenDetailModal open={!!sel} onClose={close} species={sel} artworks={bio.artworks} />
 */
function SpecimenDetailModal({ open, onClose, species, artworks = [] }) {
  const { locale } = useLocale();

  const relatedWorks = useMemo(() => {
    if (!species) return [];
    const matcher = SPECIES_MATCHERS[species.key];
    if (!matcher) return [];
    return artworks.filter(matcher);
  }, [species, artworks]);

  if (!species) return null;

  const speciesLabel = locale === 'ko' ? species.labelKo : species.labelEn;

  return (
    <Dialog
      open={ open }
      onClose={ onClose }
      maxWidth="md"
      fullWidth
      scroll="paper"
      slotProps={ {
        paper: {
          sx: {
            borderRadius: 0,
            maxHeight: '85vh',
            width: { xs: '95vw', md: '720px', lg: '840px' },
          },
        },
        backdrop: {
          sx: { backgroundColor: TOKENS.alpha.onLight(0.6) },
        },
      } }
    >
      <DialogContent sx={ { p: 0 } }>
        <Box
          sx={ {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            px: { xs: 3, md: 4 },
            py: { xs: 2.5, md: 3 },
            borderBottom: '1px solid',
            borderColor: 'divider',
          } }
        >
          <Box sx={ { display: 'flex', alignItems: 'center', gap: 2, minWidth: 0 } }>
            <Box
              component="img"
              src={ species.image }
              alt=""
              aria-hidden="true"
              onError={ (event) => { event.currentTarget.style.opacity = 0; } }
              sx={ {
                width: { xs: 56, md: 72 },
                height: { xs: 56, md: 72 },
                objectFit: 'cover',
                flexShrink: 0,
                filter: 'contrast(1.04)',
              } }
            />
            <Box sx={ { minWidth: 0 } }>
              <Typography variant="h4" sx={ { lineHeight: 1.1 } }>
                { species.labelEn }
              </Typography>
              <Typography variant="caption" sx={ { color: 'text.secondary' } }>
                { speciesLabel }
                { species.scientific ? ` · ${ species.scientific }` : '' }
              </Typography>
            </Box>
          </Box>
          <IconButton onClick={ onClose } size="small">
            <X size={ 18 } />
          </IconButton>
        </Box>

        <Box
          sx={ {
            display: 'flex',
            gap: { xs: 3, md: 5 },
            px: { xs: 3, md: 4 },
            py: { xs: 2.5, md: 3 },
            borderBottom: '1px solid',
            borderColor: 'divider',
          } }
        >
          <Box>
            <Typography
              sx={ {
                fontWeight: 500,
                fontSize: { xs: '1.6rem', md: '2.2rem' },
                color: 'text.primary',
                fontVariantNumeric: 'tabular-nums',
                lineHeight: 1,
              } }
            >
              { formatCount(species.count, locale) }
            </Typography>
            <Typography variant="overline" sx={ { display: 'block', mt: 0.6, color: 'text.secondary' } }>
              { locale === 'ko' ? '개체 수' : 'Individuals' }
            </Typography>
          </Box>
          <Box>
            <Typography
              sx={ {
                fontWeight: 500,
                fontSize: { xs: '1.6rem', md: '2.2rem' },
                color: 'text.primary',
                fontVariantNumeric: 'tabular-nums',
                lineHeight: 1,
              } }
            >
              { relatedWorks.length }
            </Typography>
            <Typography variant="overline" sx={ { display: 'block', mt: 0.6, color: 'text.secondary' } }>
              { locale === 'ko' ? '연관 작품' : 'Artworks' }
            </Typography>
          </Box>
        </Box>

        <Box sx={ { px: { xs: 3, md: 4 }, py: { xs: 2.5, md: 3 } } }>
          <Typography
            variant="body2"
            sx={ { fontWeight: 600, mb: 2, color: 'text.secondary' } }
          >
            { locale === 'ko' ? '연관 작품' : 'Related works' } ({ relatedWorks.length })
          </Typography>

          { relatedWorks.length === 0 ? (
            <Typography variant="body2" sx={ { color: 'text.disabled' } }>
              { locale === 'ko' ? '매칭된 작품이 없습니다.' : 'No matching works.' }
            </Typography>
          ) : (
            <Grid container spacing={ { xs: 1.5, md: 2 } }>
              { relatedWorks.map((work) => (
                <Grid key={ work.id } size={ { xs: 12, sm: 6, md: 4 } }>
                  <Box
                    sx={ {
                      py: { xs: 1.2, md: 1.6 },
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 0.6,
                    } }
                  >
                    <Typography variant="h6" sx={ { lineHeight: 1.25 } }>
                      { work.titleEn }
                    </Typography>
                    <Typography variant="caption" sx={ { color: 'text.secondary' } }>
                      { work.year }
                      { Number.isFinite(work.vitrines) && work.vitrines > 0
                        ? ` · ${ work.vitrines } ${ locale === 'ko' ? '진열장' : 'vitrines' }`
                        : '' }
                    </Typography>
                    { work.species?.length > 0 && (
                      <Typography variant="caption" sx={ { color: 'text.disabled' } }>
                        { work.species
                          .map((s) => `${ s.commonName }${ Number.isFinite(s.count) ? ` ×${ s.count }` : '' }`)
                          .join(', ') }
                      </Typography>
                    ) }
                  </Box>
                </Grid>
              )) }
            </Grid>
          ) }
        </Box>
      </DialogContent>
    </Dialog>
  );
}

export { SpecimenDetailModal };
