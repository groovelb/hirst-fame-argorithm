import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { motion, AnimatePresence } from 'framer-motion';
import { TOKENS } from '../../styles/themes/tokens.js';
import { BRAND_DISPLAY } from '../timeline/typography.js';

const IMAGES = [
  '/images/hirst/grotesque-bitmap/mortality-skull.png',
  '/images/hirst/grotesque-bitmap/ritual-vanitas-burning-money.png',
  '/images/hirst/grotesque-bitmap/system-medicine-cabinet.png',
  '/images/hirst/grotesque-bitmap/transcendence-sacred-heart.png',
];

/** 이미지 사전 로드 — 사이트 처음 마운트 시 4장 즉시 fetch */
function preloadImages() {
  if (typeof window === 'undefined') return;
  IMAGES.forEach((src) => {
    const img = new Image();
    img.src = src;
  });
}

/**
 * LoadingScreen — 영상 buffer 완료 전까지 viewport 전체를 덮는 풀스크린 로딩 오버레이.
 *
 * - grotesque-bitmap 4장(skull / vanitas / medicine / sacred-heart)을 1200ms 간격 fade cycle
 * - 사이트 배경(TOKENS.bg.page) 위에 placed → 영상 흰 배경과 매끄러운 transition
 * - visible=false 전환 시 600ms opacity fade-out, 그 후 unmount
 *
 * Props:
 * @param {boolean} visible - true면 표시, false면 fade-out 후 unmount [Required]
 */
function LoadingScreen({ visible }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    preloadImages();
  }, []);

  useEffect(() => {
    if (!visible) return undefined;
    const id = setInterval(
      () => setIndex((i) => (i + 1) % IMAGES.length),
      1200
    );
    return () => clearInterval(id);
  }, [visible]);

  return (
    <AnimatePresence>
      { visible && (
        <motion.div
          key="loading-screen"
          initial={ { opacity: 1 } }
          exit={ { opacity: 0 } }
          transition={ { duration: 0.6, ease: 'easeInOut' } }
          style={ {
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            backgroundColor: TOKENS.bg.page,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '4vh',
            pointerEvents: 'auto',
          } }
        >
          <Box
            sx={ {
              position: 'relative',
              width: { xs: 200, md: 320, lg: 380 },
              aspectRatio: '1 / 1',
            } }
          >
            <AnimatePresence mode="wait">
              <motion.img
                key={ index }
                src={ IMAGES[index] }
                alt=""
                aria-hidden="true"
                initial={ { opacity: 0, scale: 0.94 } }
                animate={ { opacity: 1, scale: 1 } }
                exit={ { opacity: 0, scale: 1.06 } }
                transition={ { duration: 0.55, ease: 'easeInOut' } }
                style={ {
                  position: 'absolute',
                  inset: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                  filter: 'contrast(1.05)',
                } }
              />
            </AnimatePresence>
          </Box>

          <Typography
            component="span"
            sx={ {
              fontFamily: BRAND_DISPLAY,
              fontWeight: 700,
              fontSize: { xs: '0.7rem', md: '0.78rem' },
              letterSpacing: '0.42em',
              color: TOKENS.alpha.onLight(0.6),
              textTransform: 'uppercase',
            } }
          >
            Loading
          </Typography>
        </motion.div>
      ) }
    </AnimatePresence>
  );
}

export { LoadingScreen };
