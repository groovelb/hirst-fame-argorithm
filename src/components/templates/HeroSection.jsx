import React, { useRef } from 'react';
import Box from '@mui/material/Box';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import { motion, useScroll, useTransform } from 'framer-motion';
import { HeroTypeBlock } from '../typography/HeroTypeBlock.jsx';
import VideoScrubbing from '../scroll/VideoScrubbing.jsx';
import heroVideoSrc from '../../assets/video/hirst-scrub-graded.mp4';
import { BRIDGE_SECTIONS } from './bridgeNarrative.js';
import { BridgeSection } from './BridgeSection.jsx';
import { TOKENS } from '../../styles/themes/tokens.js';

/**
 * HeroSection — Hero 타이포(검정) + 영상 스크럽 + 6 Bridge stories.
 *
 * 구조:
 *  ┌─ Sticky video (히어로 콘텐츠가 지나가는 동안 viewport stuck)
 *  │     viewport 크기 그대로 cover. zoom-in 없음.
 *  ├─ Hero 타이포 박스 (자기 자리 100vh, **marginTop: -100vh로 sticky video 자리와 공유**)
 *  │     자연 스크롤 — transform/fade 없음. 사용자가 100vh 스크롤하는 동안 자연스럽게
 *  │     viewport 위로 흘러나가 사라짐. sticky video는 그대로 stuck.
 *  └─ 6 BridgeSection (콘텐츠 높이 + 큰 상하 간격) — 자연 스크롤 overlay
 *
 * HeroSection의 단일 scrollYProgress → 영상 currentTime과 타임라인 진입 상태가
 * 같은 기준으로 움직인다.
 *
 * Props:
 * @param {function} onHeroProgress - wrapper scrollYProgress motion value 노출 콜백 [Optional]
 * @param {function} onVideoReady - 영상 buffer 완료 콜백 (LoadingScreen dismiss) [Optional]
 */
function HeroSection({ onHeroProgress, onVideoReady }) {
  const sectionRef = useRef(null);
  const theme = useTheme();
  /** md 미만 모바일 — 영상 scale zoom-in 비활성화(처음부터 100%) */
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  /**
   * 결정론적 진행도 계산.
   *
   * sectionRef = sticky video(100vh) + Hero 타이포(overlap) + PROLOGUE(100vh) = 200vh
   * 매핑 구간 = sectionRef.top hits viewport.top  →  sectionRef.bottom hits viewport.bottom
   *           = scrollable distance = height - viewport.height = 100vh
   *
   *  - rect.top   = sectionRef의 viewport 기준 top 위치
   *  - height     = sectionRef.offsetHeight (200vh, layout flow 기준)
   *  - viewportH  = window.innerHeight (100vh)
   *  - scrollable = height - viewportH (100vh)
   *  - progress   = -rect.top / scrollable
   *
   * 매핑:
   *  - sectionRef.top = viewport.top         →  rect.top = 0         →  progress 0
   *  - sectionRef.bottom = viewport.bottom   →  rect.top = -100vh    →  progress 1
   *                                              = PROLOGUE가 viewport 정확히 채운 순간
   *                                              = sticky video 해제 직전
   *                                              = video 마지막 프레임
   *
   * 그 이후 100vh 스크롤 동안 sticky 해제되어 video와 PROLOGUE가 같이 위로 빠져나감.
   */
  const { scrollY } = useScroll();
  const scrollYProgress = useTransform(scrollY, () => {
    const el = sectionRef.current;
    if (!el) return 0;
    const rect = el.getBoundingClientRect();
    const height = el.offsetHeight;
    const viewportH = window.innerHeight;
    const scrollable = height - viewportH;
    if (scrollable <= 0) return 0;
    return Math.max(0, Math.min(1, -rect.top / scrollable));
  });

  /**
   * DAMIEN HIRST 박스 자체를 아래 타이틀의 1/4 속도로 viewport에서 사라지게 한다.
   * 자연 스크롤 -100vh 동안 박스에 +75vh translate 부여 → 실효 -25vh = 아래의 1/4.
   * progress 0.5 이후엔 hero typo가 이미 viewport 위로 빠졌으므로 transform 유지만.
   */
  const damienY = useTransform(scrollYProgress, [0, 0.5, 1], ['0vh', '75vh', '75vh']);

  /**
   * 영상 70% → 100% scale zoom-in (히어로 타이틀 진행 구간 0~0.5 동안).
   * 데스크탑 전용. 모바일은 fixed scale=1로 시작부터 풀스크린 cover (zoom 비활성).
   * useTransform은 hook이라 조건부 호출 금지 → 항상 호출 후 분기.
   */
  const desktopVideoScale = useTransform(scrollYProgress, [0, 0.5, 1], [0.7, 1, 1]);
  const videoScale = isMobile ? 1 : desktopVideoScale;

  React.useEffect(() => {
    onHeroProgress?.(scrollYProgress);
  }, [onHeroProgress, scrollYProgress]);

  return (
    <Box
      ref={sectionRef}
      component="section"
      sx={{
        position: 'relative',
      }}
    >
      {/* SVG filter — 텍스트(검정) 위에 흰 dirt를 간헐적으로 합성.
          1) feTurbulence — 그레이스케일 노이즈 생성
          2) feColorMatrix — RGB를 흰(1,1,1)로 고정 + 휘도가 매우 높은 픽셀만 alpha 살림 (threshold)
                              → 간헐적 흰 dot 결과
          3) feComposite (in) — 흰 dot을 텍스트 모양 안에만 클립 (텍스트 밖으로 안 튐)
          4) feMerge — 원본 텍스트 위에 dot overlay → 검정 영역 보존 + 간헐적 흰 dirt */}
      <svg
        aria-hidden="true"
        width="0"
        height="0"
        style={{ position: 'absolute' }}
      >
        <defs>
          <filter
            id="hero-dirt"
            x="-5%"
            y="-5%"
            width="110%"
            height="110%"
            colorInterpolationFilters="sRGB"
          >
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.75"
              numOctaves="2"
              seed="5"
              result="noise"
            />
            <feColorMatrix
              in="noise"
              type="matrix"
              values="0 0 0 0 1
                      0 0 0 0 1
                      0 0 0 0 1
                      0.4 0.4 0.4 0 -1.05"
              result="whiteDots"
            />
            <feComposite
              in="whiteDots"
              in2="SourceGraphic"
              operator="in"
              result="dirtOnText"
            />
            <feMerge>
              <feMergeNode in="SourceGraphic"/>
              <feMergeNode in="dirtOnText"/>
            </feMerge>
          </filter>
        </defs>
      </svg>

      {/* Sticky video — viewport 크기 100dvh × 100vw stuck. 히어로 콘텐츠 구간 동안 유지.
          dvh: 모바일 브라우저 주소창 hide/show 시 점프 방지. 데스크탑은 dvh==vh. */}
      <Box
        sx={{
          position: 'sticky',
          top: 0,
          width: '100%',
          height: '100dvh',
          zIndex: 0,
          overflow: 'hidden',
        }}
      >
        {/* motion.div wrapper: scale은 이 wrapper에만 적용 — VideoScrubbing 내부 element는
            건드리지 않아 motion.video 변환으로 인한 fetchpriority warning 등 부수효과 회피.
            isolation: isolate로 stacking 격리 → hero typo/PROLOGUE에 영향 없음. */}
        <motion.div
          style={{
            position: 'absolute',
            inset: 0,
            scale: videoScale,
            transformOrigin: 'center center',
            willChange: 'transform',
            isolation: 'isolate',
          }}
        >
          <VideoScrubbing
            src={heroVideoSrc}
            progress={scrollYProgress}
            onReady={onVideoReady}
            sx={
              isMobile
                ? {
                    /* 모바일: viewport width와 동일 + 원본 비율 유지 (1920×1440 = 4:3).
                       objectFit: contain → 컨테이너(100vh × 100vw) 안에서 작은 차원(가로)에 맞춰
                       width=100vw 채우고 height=75vw로 자동 비율, 세로 가운데 정렬. crop 없음. */
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain',
                  }
                : {
                    /* PC: 기존 동작 그대로 — viewport 전체 cover (필요 시 일부 crop). */
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }
            }
          />
        </motion.div>
      </Box>

      {/* Hero 타이포 — 자연 스크롤 (fade/transform 없음).
          marginTop: -100vh로 sticky video 첫 자리(top 0~100vh)와 자리 공유.
          사용자가 100vh 스크롤하는 동안 page-flow 따라 위로 자연스럽게 흘러나감.
          이 후 sticky video는 stuck 유지, BridgeSection이 등장. */}
      <Box
        sx={{
          position: 'relative',
          height: '100dvh',
          marginTop: '-100dvh',
          zIndex: 1,
          pointerEvents: 'none',
        }}
      >
        {/* 상단 타이포 — DAMIEN HIRST.
            사이트 배경이 흰색이고 영상 흰 배경과 매칭되므로 다크 토큰 텍스트로 표시.
            박스 자체에 translate y 적용해 자연 스크롤을 부분 상쇄 → 아래 타이틀의 절반 속도. */}
        <Box
          component={motion.div}
          style={{ y: damienY }}
          sx={{
            position: 'absolute',
            top: { xs: '4vw', md: '1.2vw' },
            left: { xs: '4vw', md: '3vw' },
            right: { xs: '4vw', md: '3vw' },
            height: '18%',
            filter: 'url(#hero-dirt)',
          }}
        >
          <HeroTypeBlock
            text="DAMIEN HIRST"
            align="flex-start"
            color={TOKENS.text.onLight}
            padding={0}
            scrollProgress={scrollYProgress}
            speed={0.5}
          />
        </Box>

        {/* 하단 타이포 — 1988 — PRESENT ─── FAME ALGORITHM */}
        <Box
          sx={{
            position: 'absolute',
            bottom: { xs: '4vw', md: '3vw' },
            left: { xs: '4vw', md: '3vw' },
            right: { xs: '4vw', md: '3vw' },
            height: '18%',
            filter: 'url(#hero-dirt)',
          }}
        >
          <HeroTypeBlock
            text="1988 — PRESENT ─────────── FAME ALGORITHM"
            align="flex-end"
            color={TOKENS.text.onLight}
            padding={0}
            scrollProgress={scrollYProgress}
          />
        </Box>
      </Box>

      {/* Spacer — 타이틀과 PROLOGUE 사이 100vh 빈 스크롤 공간.
          이 구간 동안 sticky video만 viewport에 보이며 영상 스크러빙이 진행됨. */}
      <Box
        aria-hidden="true"
        sx={{
          position: 'relative',
          zIndex: 1,
          pointerEvents: 'none',
          height: '100dvh',
        }}
      />

      {/* PROLOGUE 컨테이너 — 100vh fixed. 좌측 정렬 + 흰색 타이포.
          배경 영상 중앙에 Hirst 초상화가 위치하므로 좌측에 배치해 시각 충돌 회피.
          이 박스가 viewport에 정확히 일치하는 순간(top=top, bottom=bottom)이
          progress 1 = 영상 마지막 프레임 = sticky 해제 직전. */}
      <Box
        sx={{
          position: 'relative',
          zIndex: 1,
          pointerEvents: 'none',
          height: '100dvh',
          display: 'flex',
          alignItems: 'center',
          px: { xs: '3vw', md: '6vw' },
        }}
      >
        <BridgeSection
          section={BRIDGE_SECTIONS[0]}
          color={TOKENS.text.onDark}
          layout="grid"
        />
      </Box>
    </Box>
  );
}

export { HeroSection };
