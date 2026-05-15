import React, { useEffect, useMemo } from 'react';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { AnimatePresence, motion } from 'framer-motion';
import { X as XIcon } from 'lucide-react';

import { useLocale } from '../../i18n';
import { TOKENS } from '../../styles/themes/tokens.js';
import { BRAND_DISPLAY, PRODUCT } from './typography.js';
import { WorkImage } from './WorkImage.jsx';
import workBioMap from '../../data/hirst/hirst_work_bio_map.json';
import bioImageMap from '../../data/hirst/hirst_bio_artwork_images.json';

/** bio artwork id → work id (workBioMap의 역방향) */
const BIO_TO_WORK_ID = Object.entries(workBioMap.workToBio ?? {}).reduce(
  (acc, [workId, bioId]) => {
    if (bioId) acc[bioId] = workId;
    return acc;
  },
  {},
);

/** bio artwork id → 직접 이미지 경로 (workBioMap에 없는 케이스 보조) */
const BIO_DIRECT_IMAGES = bioImageMap?.images ?? {};

/** species key → bioData.artworks 매칭 규칙 */
const SPECIES_MATCHERS = {
  butterfly_live_2012: (a) => a.id?.includes('in-and-out-of-love') || a.id?.includes('in-out-love') || /in and out of love/i.test(a.titleEn ?? ''),
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
 * SpecimenDetailModal — 종 상세 풀스크린 오버레이.
 *
 * WorkFocusOverlay와 동일한 풀스크린 + 배경(TOKENS.bg.dark) + 타이포(BRAND_DISPLAY / PRODUCT).
 * 좌측: 종 대표 이미지. 우측: 메타 + 연관 작품 이미지 그리드.
 *
 * Props:
 * @param {boolean} open - 모달 열림 여부 [Required]
 * @param {function} onClose - 닫기 콜백 [Required]
 * @param {Object|null} species - 선택된 종 [Optional]
 * @param {Array} artworks - bioData.artworks 전체 [Optional]
 * @param {Array} worksData - hirst_works.json works 배열 [Optional]
 */
function SpecimenDetailModal({ open, onClose, species, artworks = [], worksData = [] }) {
  const { locale } = useLocale();
  const isOpen = open && !!species;

  /** ESC 키로 close */
  useEffect(() => {
    if (!isOpen || !onClose) return undefined;
    const handle = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handle);
    return () => window.removeEventListener('keydown', handle);
  }, [isOpen, onClose]);

  /** body scroll lock */
  useEffect(() => {
    if (!isOpen) return undefined;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, [isOpen]);

  const workById = useMemo(() => {
    const map = new Map();
    (worksData ?? []).forEach((w) => map.set(w.id, w));
    return map;
  }, [worksData]);

  const relatedWorks = useMemo(() => {
    if (!species) return [];
    const matcher = SPECIES_MATCHERS[species.key];
    if (!matcher) return [];
    return artworks.filter(matcher).map((bio) => {
      const workId = BIO_TO_WORK_ID[bio.id];
      const work = workId ? workById.get(workId) : null;
      const directImage = BIO_DIRECT_IMAGES[bio.id] ?? null;
      return {
        id: bio.id,
        titleEn: bio.titleEn,
        year: bio.year,
        vitrines: bio.vitrines,
        species: bio.species,
        work,
        directImage,
      };
    });
  }, [species, artworks, workById]);

  if (!isOpen) {
    return <AnimatePresence>{ null }</AnimatePresence>;
  }

  return (
    <AnimatePresence>
      <motion.div
        key={ species.key }
        initial={ { opacity: 0 } }
        animate={ { opacity: 1 } }
        exit={ { opacity: 0 } }
        transition={ { duration: 0.22, ease: 'easeOut' } }
        style={ {
          position: 'fixed',
          inset: 0,
          zIndex: 60,
          pointerEvents: 'auto',
          overflowY: 'auto',
          overscrollBehavior: 'contain',
          WebkitOverflowScrolling: 'touch',
          backgroundColor: TOKENS.bg.dark,
        } }
      >
        { onClose && (
          <IconButton
            onClick={ onClose }
            aria-label="Close"
            sx={ {
              position: 'fixed',
              top: { xs: 16, md: 28 },
              right: { xs: 16, md: 28 },
              zIndex: 2,
              color: 'rgba(246, 246, 236, 0.78)',
              border: '1px solid rgba(246, 246, 236, 0.22)',
              borderRadius: '50%',
              width: 44,
              height: 44,
              backgroundColor: 'rgba(8, 9, 15, 0.6)',
              backdropFilter: 'blur(4px)',
              transition: 'color 0.18s ease, border-color 0.18s ease, background-color 0.18s ease',
              '&:hover': {
                color: '#fff',
                borderColor: 'rgba(246, 246, 236, 0.55)',
                backgroundColor: 'rgba(246, 246, 236, 0.12)',
              },
            } }
          >
            <XIcon size={ 18 } strokeWidth={ 1.6 } />
          </IconButton>
        ) }

        <Box
          onClick={ onClose }
          sx={ {
            position: 'relative',
            zIndex: 1,
            minHeight: '100vh',
            cursor: onClose ? 'pointer' : 'default',
          } }
        >
          <Box
            onClick={ (e) => e.stopPropagation() }
            sx={ {
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              alignItems: { xs: 'stretch', md: 'flex-start' },
              gap: { xs: 4, md: 8, lg: 10 },
              px: { xs: 3, md: 8, lg: 12 },
              py: { xs: 4, md: 9 },
              cursor: 'default',
            } }
          >
          <Box
            sx={ {
              flexShrink: 0,
              width: { xs: '100%', md: 'min(40vw, 52vh)' },
              alignSelf: { md: 'center' },
            } }
          >
            <Box
              component="img"
              src={ species.image }
              alt=""
              aria-hidden="true"
              onError={ (event) => { event.currentTarget.style.opacity = 0; } }
              sx={ {
                display: 'block',
                width: '100%',
                aspectRatio: '1 / 1',
                objectFit: 'cover',
                boxShadow: '0 30px 80px rgba(0,0,0,0.55)',
              } }
            />
          </Box>

          <Box
            sx={ {
              flex: 1,
              minWidth: 0,
              maxWidth: { md: 640 },
              color: 'rgba(246, 246, 236, 0.92)',
            } }
          >
            <Typography
              sx={ {
                fontFamily: BRAND_DISPLAY,
                fontWeight: 900,
                fontSize: { xs: '2.4rem', md: '3.6rem' },
                lineHeight: 1,
                letterSpacing: '0.04em',
                mb: 1.5,
                color: 'rgba(246, 246, 236, 1)',
              } }
            >
              { species.labelEn }
            </Typography>
            <Typography
              sx={ {
                fontFamily: PRODUCT,
                fontSize: '0.92rem',
                lineHeight: 1.6,
                color: 'rgba(246, 246, 236, 0.6)',
                mb: { xs: 3, md: 4 },
              } }
            >
              { species.scientific }
              { locale === 'ko' ? ` · ${ species.labelKo }` : '' }
            </Typography>

            <Box sx={ { display: 'flex', gap: { xs: 4, md: 6 }, mb: { xs: 4, md: 5 } } }>
              <Box>
                <Typography
                  sx={ {
                    fontFamily: BRAND_DISPLAY,
                    fontWeight: 900,
                    fontSize: { xs: '2rem', md: '2.6rem' },
                    lineHeight: 1,
                    letterSpacing: '0.02em',
                    color: species.count == null ? 'rgba(246, 246, 236, 0.42)' : 'rgba(246, 246, 236, 1)',
                  } }
                >
                  { formatCount(species.count, locale) }
                </Typography>
                <Typography
                  sx={ {
                    mt: 1,
                    fontFamily: PRODUCT,
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    letterSpacing: '0.22em',
                    textTransform: 'uppercase',
                    color: 'rgba(246, 246, 236, 0.5)',
                  } }
                >
                  { locale === 'ko' ? '개체 수' : 'Individuals' }
                </Typography>
              </Box>
              <Box>
                <Typography
                  sx={ {
                    fontFamily: BRAND_DISPLAY,
                    fontWeight: 900,
                    fontSize: { xs: '2rem', md: '2.6rem' },
                    lineHeight: 1,
                    letterSpacing: '0.02em',
                    color: 'rgba(246, 246, 236, 1)',
                  } }
                >
                  { relatedWorks.length }
                </Typography>
                <Typography
                  sx={ {
                    mt: 1,
                    fontFamily: PRODUCT,
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    letterSpacing: '0.22em',
                    textTransform: 'uppercase',
                    color: 'rgba(246, 246, 236, 0.5)',
                  } }
                >
                  { locale === 'ko' ? '연관 작품' : 'Artworks' }
                </Typography>
              </Box>
            </Box>

            <Box
              aria-hidden="true"
              sx={ {
                height: '1px',
                backgroundColor: 'rgba(246, 246, 236, 0.14)',
                mb: { xs: 4, md: 5 },
              } }
            />

            <Typography
              sx={ {
                fontFamily: PRODUCT,
                fontSize: '0.78rem',
                fontWeight: 700,
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
                color: 'rgba(246, 246, 236, 0.5)',
                mb: { xs: 2.5, md: 3 },
              } }
            >
              { locale === 'ko' ? '연관 작품' : 'Related works' }
            </Typography>

            { relatedWorks.length === 0 ? (
              <Typography
                sx={ {
                  fontFamily: PRODUCT,
                  fontSize: '0.92rem',
                  color: 'rgba(246, 246, 236, 0.4)',
                } }
              >
                { locale === 'ko' ? '매칭된 작품이 없습니다.' : 'No matching works.' }
              </Typography>
            ) : (
              <Box
                sx={ {
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: { xs: 2, md: 2.5 },
                  alignItems: 'flex-start',
                } }
              >
                { relatedWorks.map((rw) => (
                  <Box
                    key={ rw.id }
                    sx={ {
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 1,
                      flexShrink: 0,
                      maxWidth: { xs: 'calc(50% - 8px)', sm: 'calc(33.333% - 10px)' },
                    } }
                  >
                    { rw.work ? (
                      <WorkImage
                        work={ rw.work }
                        sx={ {
                          display: 'block',
                          height: { xs: 160, md: 220 },
                          width: 'auto',
                          maxWidth: '100%',
                          objectFit: 'contain',
                        } }
                      />
                    ) : rw.directImage ? (
                      <Box
                        component="img"
                        src={ rw.directImage }
                        alt={ rw.titleEn }
                        loading="lazy"
                        sx={ {
                          display: 'block',
                          height: { xs: 160, md: 220 },
                          width: 'auto',
                          maxWidth: '100%',
                          objectFit: 'contain',
                        } }
                      />
                    ) : (
                      <Box
                        sx={ {
                          height: { xs: 160, md: 220 },
                          width: { xs: 120, md: 165 },
                          maxWidth: '100%',
                          backgroundColor: 'rgba(246, 246, 236, 0.06)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          p: 1.5,
                        } }
                      >
                        <Typography
                          sx={ {
                            fontFamily: PRODUCT,
                            fontSize: '0.62rem',
                            letterSpacing: '0.14em',
                            textTransform: 'uppercase',
                            color: 'rgba(246, 246, 236, 0.32)',
                            textAlign: 'center',
                          } }
                        >
                          { locale === 'ko' ? '이미지 없음' : 'No image' }
                        </Typography>
                      </Box>
                    ) }
                    <Typography
                      sx={ {
                        mt: 0.25,
                        fontFamily: BRAND_DISPLAY,
                        fontWeight: 500,
                        fontSize: { xs: '0.86rem', md: '0.95rem' },
                        lineHeight: 1.25,
                        color: 'rgba(246, 246, 236, 0.92)',
                      } }
                    >
                      { rw.titleEn }
                    </Typography>
                    <Typography
                      sx={ {
                        fontFamily: PRODUCT,
                        fontSize: '0.72rem',
                        letterSpacing: '0.06em',
                        color: 'rgba(246, 246, 236, 0.5)',
                      } }
                    >
                      { rw.year }
                      { Number.isFinite(rw.vitrines) && rw.vitrines > 0
                        ? ` · ${ rw.vitrines } ${ locale === 'ko' ? '진열장' : 'vitrines' }`
                        : '' }
                    </Typography>
                  </Box>
                )) }
              </Box>
            ) }
          </Box>
          </Box>
        </Box>
      </motion.div>
    </AnimatePresence>
  );
}

export { SpecimenDetailModal };
