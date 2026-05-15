import { useEffect } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Lenis from 'lenis';

import { defaultTheme as theme } from './styles/themes';
import { LocaleProvider } from './i18n';
import { LandingPage } from './components/templates/LandingPage.jsx';
import worksData from './data/hirst/hirst_works.json';
import eventsData from './data/hirst/hirst_events.json';
import bioData from './data/hirst/hirst-bio-specimen-data.js';
import trendData from '../data/hirst-trend-data.json';

/**
 * Lenis smooth scroll 초기화.
 * - native window.scrollY를 lenis가 갱신하므로 framer-motion useScroll, useTransform과 자동 동기화
 * - raf 루프는 requestAnimationFrame로 매 프레임 lenis.raf(t) 호출
 * - cleanup 시 destroy
 */
function useLenisScroll() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      smoothTouch: false,
    });

    let rafId = 0;
    function raf(time) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);
}

function App() {
  useLenisScroll();

  return (
    <LocaleProvider>
      <ThemeProvider theme={ theme }>
        <CssBaseline />
        <LandingPage
          worksData={ worksData }
          eventsData={ eventsData }
          bioData={ bioData }
          trendData={ trendData }
        />
      </ThemeProvider>
    </LocaleProvider>
  );
}

export default App;
