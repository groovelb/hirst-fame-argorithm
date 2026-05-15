import React, { useEffect } from 'react';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { AnimatePresence, motion } from 'framer-motion';
import { X as XIcon } from 'lucide-react';
import { useLocale } from '../../i18n';
import { WorkImage } from './WorkImage.jsx';
import { BRAND_DISPLAY, PRODUCT } from './typography.js';
import { TOKENS } from '../../styles/themes/tokens.js';

/** USD/GBP price → "$200.7M" / "£50M" */
function formatPrice(amount, currency) {
  if (typeof amount !== 'number' || !Number.isFinite(amount)) return null;
  const sym = currency === 'GBP' ? '£' : '$';
  if (amount >= 1_000_000) {
    const m = amount / 1_000_000;
    return `${sym}${m >= 100 ? m.toFixed(0) : m.toFixed(1)}M`;
  }
  if (amount >= 1_000) return `${sym}${(amount / 1_000).toFixed(0)}K`;
  return `${sym}${amount}`;
}

/** stance → 흰색 opacity 단계 (색 단일화) */
const STANCE_OPACITY = {
  negative: 1,
  positive: 1,
  mixed: 0.7,
  ambivalent: 0.7,
  analytical: 0.55,
  polarised: 0.7,
};

function SectionLabel({ children }) {
  return (
    <Typography
      component="div"
      sx={ {
        fontFamily: PRODUCT,
        fontSize: '0.66rem',
        fontWeight: 700,
        letterSpacing: '0.38em',
        textTransform: 'uppercase',
        color: 'rgba(246, 246, 236, 0.42)',
        mb: 3.5,
      } }
    >
      { children }
    </Typography>
  );
}

/** Chip — 색 단일화(accent 무시), 사이즈 ~2배 */
function Chip({ children }) {
  return (
    <Box
      component="span"
      sx={ {
        display: 'inline-block',
        px: 1.75,
        py: 0.85,
        fontFamily: PRODUCT,
        fontSize: '0.88rem',
        fontWeight: 600,
        letterSpacing: '0.18em',
        textTransform: 'uppercase',
        color: 'rgba(246, 246, 236, 0.85)',
        border: '1px solid rgba(246, 246, 236, 0.28)',
        whiteSpace: 'nowrap',
      } }
    >
      { children }
    </Box>
  );
}

/**
 * PeakHoverOverlay — trend peak에 hover 시 화면 정중앙에 뜨는 fixed overlay.
 *
 * Editorial 톤:
 *  - 좌측 큰 이미지 + 우측 정보. 정보 컬럼은 generous 수직 간격(섹션간 mb 4~5).
 *  - 모든 chip/label/메타는 PRODUCT(sans). 헤드라인(title·price)만 BRAND_DISPLAY(serif).
 *  - 좌측 accent border 사용 안 함 — stance는 색상 dot으로 표현.
 *
 * Props:
 * @param {Object|null} activeEvent [Optional]
 * @param {function} getEventLabel - (eventId) => string [Optional]
 */
function PeakHoverOverlay({ activeEvent, getEventLabel, onClose }) {
  const { localized } = useLocale();
  const isOpen = !!activeEvent;

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

  return (
    <AnimatePresence>
      { activeEvent && (
        <motion.div
          key={ activeEvent.id }
          initial={ { opacity: 0 } }
          animate={ { opacity: 1 } }
          exit={ { opacity: 0 } }
          transition={ { duration: 0.24, ease: 'easeOut' } }
          style={ {
            position: 'fixed',
            inset: 0,
            zIndex: 70,
            pointerEvents: 'auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          } }
        >
          <Box
            onClick={ onClose }
            sx={ {
              position: 'absolute',
              inset: 0,
              backgroundColor: TOKENS.bg.page,
              cursor: onClose ? 'pointer' : 'default',
            } }
          />

          {/* X 닫기 버튼 */}
          { onClose && (
            <IconButton
              onClick={ onClose }
              aria-label="Close"
              sx={ {
                position: 'absolute',
                top: { xs: 16, md: 28 },
                right: { xs: 16, md: 28 },
                zIndex: 2,
                color: 'rgba(246, 246, 236, 0.78)',
                border: '1px solid rgba(246, 246, 236, 0.22)',
                borderRadius: '50%',
                width: 44,
                height: 44,
                transition: 'color 0.18s ease, border-color 0.18s ease, background-color 0.18s ease',
                '&:hover': {
                  color: '#fff',
                  borderColor: 'rgba(246, 246, 236, 0.55)',
                  backgroundColor: 'rgba(246, 246, 236, 0.06)',
                },
              } }
            >
              <XIcon size={ 18 } strokeWidth={ 1.6 } />
            </IconButton>
          ) }

          <Box
            onClick={ (e) => e.stopPropagation() }
            sx={ {
              position: 'relative',
              zIndex: 1,
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              alignItems: 'center',
              gap: { xs: 4, md: 10 },
              maxWidth: { xs: '94vw', md: '92vw' },
              maxHeight: { xs: '90vh', md: '86vh' },
              px: { xs: 3, md: 8 },
            } }
          >
            { activeEvent.imageRef && (
              <Box
                sx={ {
                  flexShrink: 0,
                  width: { xs: '64vw', md: 'min(40vw, 54vh)' },
                  height: { xs: '40vh', md: 'min(60vh, 52vw)' },
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                } }
              >
                <WorkImage
                  work={ { id: activeEvent.id, image: activeEvent.imageRef, title: activeEvent.title } }
                  sx={ {
                    display: 'block',
                    maxWidth: '100%',
                    maxHeight: '100%',
                    width: 'auto',
                    height: 'auto',
                    objectFit: 'contain',
                    boxShadow: '0 30px 80px rgba(0,0,0,0.55)',
                  } }
                />
              </Box>
            ) }

            <Box
              sx={ {
                flex: 1,
                maxWidth: { xs: '94vw', md: 580 },
                maxHeight: { md: '82vh' },
                overflowY: { md: 'auto' },
                color: 'text.primary',
                pr: { md: 2 },
                '&::-webkit-scrollbar': { width: 3 },
                '&::-webkit-scrollbar-thumb': {
                  backgroundColor: 'rgba(255,255,255,0.18)',
                  borderRadius: 2,
                },
              } }
            >
              {/* overline 제거 — 매거진 톤. 단순한 date 한 줄만 헤드라인 위에. */}

              {/* date — 단순 라벨 (overline 아님, headline의 일부 메타) */}
              <Typography
                component="div"
                sx={ {
                  fontFamily: PRODUCT,
                  fontSize: '0.92rem',
                  fontWeight: 500,
                  color: 'rgba(246, 246, 236, 0.62)',
                  mb: { xs: 1.5, md: 2 },
                } }
              >
                { activeEvent.date }
              </Typography>

              {/* title — 헤드라인 */}
              <Typography
                sx={ {
                  fontFamily: BRAND_DISPLAY,
                  fontWeight: 900,
                  fontSize: { xs: '2rem', md: '2.85rem' },
                  lineHeight: 1.05,
                  letterSpacing: '0.02em',
                  mb: 2,
                } }
              >
                { activeEvent.title }
              </Typography>

              { activeEvent.subtitle && (
                <Typography
                  sx={ {
                    fontFamily: PRODUCT,
                    fontSize: '1rem',
                    lineHeight: 1.65,
                    color: 'rgba(246, 246, 236, 0.72)',
                    mb: { xs: 5, md: 6 },
                  } }
                >
                  { activeEvent.subtitle }
                </Typography>
              ) }

              {/* CAUSES */}
              { activeEvent.causes && (
                <Box sx={ { mb: { xs: 5, md: 6 } } }>
                  <SectionLabel>Causes · 영향 요소</SectionLabel>

                  { activeEvent.causes.context && (
                    <Typography
                      sx={ {
                        fontFamily: PRODUCT,
                        fontSize: '1rem',
                        lineHeight: 1.8,
                        color: 'rgba(246, 246, 236, 1)',
                        mb: 3,
                      } }
                    >
                      { localized(activeEvent.causes.context) }
                    </Typography>
                  ) }

                  { activeEvent.causes.production && (
                    <Typography
                      sx={ {
                        fontFamily: PRODUCT,
                        fontSize: '0.88rem',
                        lineHeight: 1.75,
                        color: 'rgba(246, 246, 236, 0.5)',
                        mb: 3,
                      } }
                    >
                      { localized(activeEvent.causes.production) }
                    </Typography>
                  ) }

                  { ((activeEvent.causes.antecedents?.length ?? 0) > 0
                     || (activeEvent.causes.key_actors?.length ?? 0) > 0) && (
                    <Box sx={ { display: 'flex', flexWrap: 'wrap', gap: 1.25, mt: 2 } }>
                      { activeEvent.causes.antecedents?.map((id) => (
                        <Chip key={ `ant-${id}` }>
                          { `← ${getEventLabel?.(id) ?? id}` }
                        </Chip>
                      )) }
                      { activeEvent.causes.key_actors?.map((a, i) => (
                        <Chip key={ `actor-${i}` }>
                          { localized(a.label) || a.name }
                        </Chip>
                      )) }
                    </Box>
                  ) }
                </Box>
              ) }

              {/* COMMERCIAL */}
              { activeEvent.commercial && (
                <Box sx={ { mb: { xs: 5, md: 6 } } }>
                  <SectionLabel>Commercial · 상업적 성과</SectionLabel>

                  { activeEvent.commercial.price && (
                    <Box sx={ { mb: 3 } }>
                      <Box
                        sx={ {
                          display: 'flex',
                          alignItems: 'baseline',
                          gap: 2,
                          flexWrap: 'wrap',
                          mb: 2,
                        } }
                      >
                        <Typography
                          component="span"
                          sx={ {
                            fontFamily: BRAND_DISPLAY,
                            fontWeight: 900,
                            fontSize: { xs: '1.85rem', md: '2.4rem' },
                            lineHeight: 1,
                            letterSpacing: '0.02em',
                            color: 'rgba(246, 246, 236, 1)',
                          } }
                        >
                          { formatPrice(
                            activeEvent.commercial.price.amount,
                            activeEvent.commercial.price.currency,
                          ) ?? '—' }
                        </Typography>
                        { activeEvent.commercial.delta_pct != null && (
                          <Chip>{ `+${activeEvent.commercial.delta_pct}%` }</Chip>
                        ) }
                        { activeEvent.commercial.price.disputed && (
                          <Chip>Disputed</Chip>
                        ) }
                      </Box>
                      { activeEvent.commercial.price.note && (
                        <Typography
                          sx={ {
                            fontFamily: PRODUCT,
                            fontSize: '0.88rem',
                            lineHeight: 1.75,
                            color: 'rgba(246, 246, 236, 0.78)',
                          } }
                        >
                          { localized(activeEvent.commercial.price.note) }
                        </Typography>
                      ) }
                    </Box>
                  ) }

                  { activeEvent.commercial.subsequent?.map((s, i) => (
                    <Typography
                      key={ `sub-${i}` }
                      sx={ {
                        fontFamily: PRODUCT,
                        fontSize: '0.85rem',
                        lineHeight: 1.7,
                        color: 'rgba(246, 246, 236, 0.5)',
                        mt: 2,
                      } }
                    >
                      { '— ' }{ localized(s.note) }
                    </Typography>
                  )) }
                </Box>
              ) }

              {/* STATUS */}
              { activeEvent.status && (
                <Box sx={ { mb: { xs: 5, md: 6 } } }>
                  <SectionLabel>Status · 지위 성과</SectionLabel>

                  { activeEvent.status.position_shift && (
                    <Typography
                      sx={ {
                        fontFamily: PRODUCT,
                        fontSize: '1rem',
                        lineHeight: 1.8,
                        color: 'rgba(246, 246, 236, 1)',
                        mb: 3,
                      } }
                    >
                      { localized(activeEvent.status.position_shift) }
                    </Typography>
                  ) }

                  { activeEvent.status.reception_extras?.length > 0 && (
                    <Box sx={ { mt: 3 } }>
                      { activeEvent.status.reception_extras.map((r, i) => (
                        <Box
                          key={ `r-${i}` }
                          sx={ { mb: 3, '&:last-of-type': { mb: 0 } } }
                        >
                          <Box sx={ { display: 'flex', alignItems: 'center', gap: 1.25, mb: 1 } }>
                            <Box
                              aria-hidden="true"
                              sx={ {
                                width: 7,
                                height: 7,
                                borderRadius: '50%',
                                backgroundColor: `rgba(246, 246, 236, ${STANCE_OPACITY[r.stance] ?? 0.55})`,
                                flexShrink: 0,
                              } }
                            />
                            <Typography
                              component="div"
                              sx={ {
                                fontFamily: PRODUCT,
                                fontSize: '0.7rem',
                                fontWeight: 700,
                                letterSpacing: '0.22em',
                                textTransform: 'uppercase',
                                color: 'rgba(246, 246, 236, 0.62)',
                              } }
                            >
                              { r.critic }{ r.media && r.media !== '—' ? ` · ${r.media}` : '' }
                            </Typography>
                          </Box>
                          { r.quote_short && (
                            <Typography
                              sx={ {
                                fontFamily: PRODUCT,
                                fontSize: '0.92rem',
                                lineHeight: 1.7,
                                color: 'rgba(246, 246, 236, 0.78)',
                                pl: 2.5,
                              } }
                            >
                              { localized(r.quote_short) }
                            </Typography>
                          ) }
                        </Box>
                      )) }
                    </Box>
                  ) }

                  { activeEvent.status.institutional?.length > 0 && (
                    <Box sx={ { mt: 2.5 } }>
                      { activeEvent.status.institutional.map((inst, i) => (
                        <Typography
                          key={ `inst-${i}` }
                          sx={ {
                            fontFamily: PRODUCT,
                            fontSize: '0.82rem',
                            lineHeight: 1.65,
                            color: 'rgba(246, 246, 236, 0.5)',
                            mt: 1.25,
                          } }
                        >
                          <Box component="span" sx={ { fontWeight: 600, color: 'rgba(246, 246, 236, 0.78)' } }>
                            { inst.venue }
                          </Box>
                          { inst.date ? ` · ${inst.date}` : '' }
                          { inst.note ? ' — ' : '' }
                          { inst.note ? localized(inst.note) : '' }
                        </Typography>
                      )) }
                    </Box>
                  ) }
                </Box>
              ) }

              {/* RIPPLE */}
              { activeEvent.long_term_ripple?.length > 0 && (
                <Box sx={ { mb: { xs: 5, md: 6 } } }>
                  <SectionLabel>Ripple · 장기 파급</SectionLabel>
                  <Box sx={ { display: 'flex', flexWrap: 'wrap', gap: 1.25, mb: 2 } }>
                    { activeEvent.long_term_ripple.map((r, i) => (
                      r.to ? (
                        <Chip key={ `rip-${i}` }>
                          { `→ ${getEventLabel?.(r.to) ?? r.to}` }
                        </Chip>
                      ) : null
                    )) }
                  </Box>
                  { activeEvent.long_term_ripple.map((r, i) => (
                    <Typography
                      key={ `rip-note-${i}` }
                      sx={ {
                        fontFamily: PRODUCT,
                        fontSize: '0.88rem',
                        lineHeight: 1.75,
                        color: 'rgba(246, 246, 236, 0.78)',
                        mt: 1.5,
                      } }
                    >
                      { localized(r.note) }
                    </Typography>
                  )) }
                </Box>
              ) }

              {/* sources */}
              { activeEvent.sources?.length > 0 && (
                <Box sx={ { mt: { xs: 5, md: 6 }, pt: 4, borderTop: '1px solid rgba(246,246,236,0.10)' } }>
                  <Typography
                    component="div"
                    sx={ {
                      fontFamily: PRODUCT,
                      fontSize: '0.62rem',
                      fontWeight: 700,
                      letterSpacing: '0.32em',
                      textTransform: 'uppercase',
                      color: 'rgba(246, 246, 236, 0.34)',
                      mb: 2,
                    } }
                  >
                    Sources
                  </Typography>
                  { activeEvent.sources.map((s, i) => (
                    <Typography
                      key={ `src-${i}` }
                      sx={ {
                        fontFamily: PRODUCT,
                        fontSize: '0.8rem',
                        lineHeight: 1.6,
                        color: 'rgba(246, 246, 236, 0.5)',
                        mb: 0.5,
                      } }
                    >
                      { s.title }
                    </Typography>
                  )) }
                </Box>
              ) }
            </Box>
          </Box>
        </motion.div>
      ) }
    </AnimatePresence>
  );
}

export { PeakHoverOverlay };
