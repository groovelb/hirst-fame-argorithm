import React, { useEffect } from 'react';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { AnimatePresence, motion } from 'framer-motion';
import { X as XIcon } from 'lucide-react';
import { WorkImage } from './WorkImage.jsx';
import { BRAND_DISPLAY, PRODUCT } from './typography.js';
import { useLocale } from '../../i18n';
import { TOKENS } from '../../styles/themes/tokens.js';

/** auction_record.price_usd → "$8.0M" / "$120K" 표기 */
function formatPrice(usd) {
  if (typeof usd !== 'number' || !Number.isFinite(usd)) return null;
  if (usd >= 1_000_000) {
    const m = usd / 1_000_000;
    return `$${m >= 100 ? m.toFixed(0) : m.toFixed(1)}M`;
  }
  if (usd >= 1_000) return `$${(usd / 1_000).toFixed(0)}K`;
  return `$${usd}`;
}

/**
 * WorkFocusOverlay — hover된 작품을 화면 정중앙에 확대해 보여주는 fixed overlay.
 *
 * 구조 (우측 정보 컬럼, 위→아래):
 *  1) 카테고리 eyebrow (band 이미지 + hairline + label)
 *  2) 연도 (BRAND DISPLAY, huge)
 *  3) 제목 (BRAND DISPLAY, mid)
 *  4) Period chip (시리즈명)
 *  5) Medium
 *  6) Collection
 *  7) hairline divider
 *  8) Significance — 본문 강조 (localized)
 *  9) Exhibition note — 보조 italic (localized)
 * 10) Auction record — 있을 때 박스 (가격 BRAND + venue/year/note)
 * 11) Keyword tag chips
 *
 * Props:
 * @param {Object|null} activeWork - 활성 작품 데이터 [Optional]
 *
 * Example usage:
 * <WorkFocusOverlay activeWork={ work } />
 */
function WorkFocusOverlay({ activeWork, onClose }) {
  const { localized } = useLocale();
  const isOpen = !!activeWork;

  /** ESC 키로 close */
  useEffect(() => {
    if (!isOpen || !onClose) return undefined;
    const handle = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handle);
    return () => window.removeEventListener('keydown', handle);
  }, [isOpen, onClose]);

  /** body scroll lock — modal 열려있는 동안 페이지 스크롤 차단 */
  useEffect(() => {
    if (!isOpen) return undefined;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, [isOpen]);

  if (!activeWork) {
    return (
      <AnimatePresence>
        { null }
      </AnimatePresence>
    );
  }

  const significanceText = activeWork.significance
    ? localized(activeWork.significance)
    : null;
  const exhibitionText = activeWork.exhibition_note
    ? localized(activeWork.exhibition_note) ?? null
    : null;
  const auction = activeWork.auction_record;
  const tags = activeWork.keyword_tags ?? [];

  return (
    <AnimatePresence>
      <motion.div
        key={ activeWork.id }
        initial={ { opacity: 0 } }
        animate={ { opacity: 1 } }
        exit={ { opacity: 0 } }
        transition={ { duration: 0.22, ease: 'easeOut' } }
        style={ {
          position: 'fixed',
          inset: 0,
          zIndex: 60,
          pointerEvents: 'auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        } }
      >
        {/* 배경 — 클릭 시 close */}
        <Box
          onClick={ onClose }
          sx={ {
            position: 'absolute',
            inset: 0,
            backgroundColor: TOKENS.bg.dark,
            cursor: onClose ? 'pointer' : 'default',
          } }
        />

        {/* X 닫기 버튼 — 우상단 fixed */}
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

        {/* 중앙 카드 — editorial 톤. 카드 클릭은 close 차단 (배경만 close). */}
        <Box
          onClick={ (e) => e.stopPropagation() }
          sx={ {
            position: 'relative',
            zIndex: 1,
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            alignItems: { xs: 'stretch', md: 'center' },
            gap: { xs: 4, md: 10 },
            maxWidth: { xs: '94vw', md: '92vw' },
            maxHeight: { xs: '92dvh', md: '86vh' },
            px: { xs: 3, md: 8 },
            py: { xs: 9, md: 0 },
            overflowY: { xs: 'auto', md: 'visible' },
            WebkitOverflowScrolling: 'touch',
          } }
        >
          {/* 작품 이미지 — editorial 비율 */}
          <Box
            sx={ {
              flexShrink: 0,
              width: { xs: '100%', md: 'min(46vw, 58vh)' },
              height: { xs: 'auto', md: 'min(66vh, 70vw)' },
              maxHeight: { xs: '50dvh', md: 'none' },
              display: 'flex',
              alignItems: 'center',
              justifyContent: { xs: 'flex-start', md: 'center' },
            } }
          >
            <WorkImage
              work={ activeWork }
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

          {/* 설명 컬럼 — editorial 폭 */}
          <Box
            sx={ {
              flex: 1,
              maxWidth: { xs: '100%', md: 500 },
              maxHeight: { xs: 'none', md: '82vh' },
              overflowY: { xs: 'visible', md: 'auto' },
              color: 'text.primary',
              pr: { md: 2 },
              '&::-webkit-scrollbar': { width: 3 },
              '&::-webkit-scrollbar-thumb': {
                backgroundColor: 'rgba(255,255,255,0.18)',
                borderRadius: 2,
              },
            } }
          >
            {/* 카테고리 overline 제거 — 매거진 톤. 분류는 하단 BandLegend에서 담당. */}

            {/* 연도 — 헤드라인 */}
            <Typography
              sx={ {
                fontFamily: BRAND_DISPLAY,
                fontWeight: 900,
                fontSize: { xs: '2rem', md: '3rem' },
                lineHeight: 1,
                letterSpacing: '0.04em',
                mb: 1.75,
              } }
            >
              { activeWork.year }
            </Typography>

            {/* 제목 — 헤드라인 */}
            <Typography
              sx={ {
                fontFamily: BRAND_DISPLAY,
                fontWeight: 500,
                fontSize: { xs: '1.35rem', md: '1.65rem' },
                lineHeight: 1.25,
                letterSpacing: '0.01em',
                mb: { xs: 4, md: 5 },
              } }
            >
              { activeWork.title }
            </Typography>

            {/* Period tag — 시리즈명 (있을 때). chip 사이즈 확대. */}
            { activeWork.period && (
              <Box
                component="span"
                sx={ {
                  display: 'inline-block',
                  px: 1.75,
                  py: 0.9,
                  mb: { xs: 4, md: 5 },
                  border: '1px solid rgba(246,246,236,0.28)',
                  fontFamily: PRODUCT,
                  fontSize: '0.88rem',
                  fontWeight: 700,
                  letterSpacing: '0.22em',
                  textTransform: 'uppercase',
                  color: 'rgba(246, 246, 236, 0.85)',
                } }
              >
                { activeWork.period }
              </Box>
            ) }

            {/* Medium */}
            { activeWork.medium && (
              <Typography
                sx={ {
                  fontFamily: PRODUCT,
                  fontSize: '0.92rem',
                  lineHeight: 1.65,
                  color: 'rgba(246, 246, 236, 0.78)',
                  mb: activeWork.collection ? 1.5 : 0,
                } }
              >
                { activeWork.medium }
              </Typography>
            ) }

            {/* Collection */}
            { activeWork.collection && (
              <Typography
                sx={ {
                  fontFamily: PRODUCT,
                  fontSize: '0.78rem',
                  fontWeight: 500,
                  letterSpacing: '0.04em',
                  textTransform: 'uppercase',
                  color: 'rgba(246, 246, 236, 0.5)',
                } }
              >
                { activeWork.collection }
              </Typography>
            ) }

            {/* hairline divider — 호흡 확장 */}
            { (significanceText || exhibitionText || auction || tags.length > 0) && (
              <Box
                aria-hidden="true"
                sx={ {
                  height: '1px',
                  backgroundColor: 'rgba(246, 246, 236, 0.14)',
                  my: { xs: 5, md: 6 },
                } }
              />
            ) }

            {/* Significance — 본문 */}
            { significanceText && (
              <Typography
                sx={ {
                  fontFamily: PRODUCT,
                  fontSize: '1rem',
                  lineHeight: 1.8,
                  color: 'rgba(246, 246, 236, 1)',
                  mb: exhibitionText ? 3 : 0,
                } }
              >
                { significanceText }
              </Typography>
            ) }

            {/* Exhibition note */}
            { exhibitionText && (
              <Typography
                sx={ {
                  fontFamily: PRODUCT,
                  fontSize: '0.85rem',
                  lineHeight: 1.75,
                  color: 'rgba(246, 246, 236, 0.5)',
                } }
              >
                { exhibitionText }
              </Typography>
            ) }

            {/* Auction record — 흰색 통일 */}
            { auction && (
              <Box sx={ { mt: { xs: 5, md: 6 } } }>
                <Box
                  sx={ {
                    display: 'flex',
                    alignItems: 'baseline',
                    gap: 2,
                    flexWrap: 'wrap',
                  } }
                >
                  <Typography
                    component="span"
                    sx={ {
                      fontFamily: BRAND_DISPLAY,
                      fontWeight: 900,
                      fontSize: '1.7rem',
                      lineHeight: 1,
                      letterSpacing: '0.02em',
                      color: 'rgba(246, 246, 236, 1)',
                    } }
                  >
                    { formatPrice(auction.price_usd) ?? '—' }
                  </Typography>
                  { auction.year && (
                    <Typography
                      component="span"
                      sx={ {
                        fontFamily: PRODUCT,
                        fontSize: '0.78rem',
                        fontWeight: 700,
                        letterSpacing: '0.22em',
                        textTransform: 'uppercase',
                        color: 'rgba(246, 246, 236, 0.5)',
                      } }
                    >
                      { auction.year }
                    </Typography>
                  ) }
                </Box>
                { auction.venue && (
                  <Typography
                    sx={ {
                      mt: 1.5,
                      fontFamily: PRODUCT,
                      fontSize: '0.85rem',
                      lineHeight: 1.7,
                      color: 'rgba(246, 246, 236, 0.78)',
                    } }
                  >
                    { auction.venue }
                  </Typography>
                ) }
                { auction.note && (
                  <Typography
                    sx={ {
                      mt: 1,
                      fontFamily: PRODUCT,
                      fontSize: '0.8rem',
                      lineHeight: 1.7,
                      color: 'rgba(246, 246, 236, 0.5)',
                    } }
                  >
                    { auction.note }
                  </Typography>
                ) }
              </Box>
            ) }

            {/* Keyword tags — chip 사이즈 약 2배. */}
            { tags.length > 0 && (
              <Box
                sx={ {
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: 1.25,
                  mt: { xs: 5, md: 6 },
                } }
              >
                { tags.map((tag) => (
                  <Box
                    key={ tag }
                    component="span"
                    sx={ {
                      px: 1.75,
                      py: 0.85,
                      fontFamily: PRODUCT,
                      fontSize: '0.88rem',
                      color: 'rgba(246, 246, 236, 0.78)',
                      backgroundColor: 'rgba(246, 246, 236, 0.08)',
                      borderRadius: '2px',
                    } }
                  >
                    { tag }
                  </Box>
                )) }
              </Box>
            ) }
          </Box>
        </Box>
      </motion.div>
    </AnimatePresence>
  );
}

export { WorkFocusOverlay };
