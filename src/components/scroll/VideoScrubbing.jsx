import { useCallback, useRef, useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import { TOKENS } from '../../styles/themes/tokens.js';

/**
 * VideoScrubbing Component
 * 스크롤 위치에 따라 비디오를 프레임 단위로 재생(스크러빙)하는 컴포넌트입니다.
 *
 * @param {string} src - 비디오 소스 경로 [Required]
 * @param {React.RefObject} containerRef - 스크롤 추적용 컨테이너 요소 [Optional]
 * @param {Object} sx - MUI sx 스타일 [Optional]
 * @param {Object} progress - 외부에서 주입하는 MotionValue progress(0-1) [Optional]
 * @param {Object} scrollRange - 스크롤 범위 매핑 { start: 0, end: 1 } [Optional]
 * @param {function} onProgressChange - 진행도 변경 콜백 (progress: 0-1) [Optional]
 */
const VideoScrubbing = ({
  src,
  containerRef = null,
  sx = {},
  progress: externalProgress = null,
  scrollRange = { start: 0, end: 1 },
  onProgressChange,
  onReady,
  ...props
}) => {
  const videoRef = useRef(null);
  const [isInView, setIsInView] = useState(false);
  /**
   * isReady = video element가 끊김 없이 재생/스크럽 가능한 상태.
   * canplaythrough(브라우저 판단 충분 buffer) 또는 buffered range가 duration까지 도달 시 true.
   * 그 전까지 사이트 배경색 overlay + 로딩 인디케이터 표시 → 끊김 방지.
   */
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return undefined;

    const markReady = () => {
      setIsReady(true);
      onReady?.();
    };

    const handleProgress = () => {
      if (
        video.duration &&
        video.buffered.length > 0 &&
        video.buffered.end(video.buffered.length - 1) >= video.duration - 0.5
      ) {
        markReady();
      }
    };

    video.addEventListener('canplaythrough', markReady);
    video.addEventListener('progress', handleProgress);
    if (video.readyState >= 4) markReady();

    return () => {
      video.removeEventListener('canplaythrough', markReady);
      video.removeEventListener('progress', handleProgress);
    };
  }, [onReady]);

  const setVideoProgress = useCallback((nextProgress) => {
    const video = videoRef.current;
    if (!video || !Number.isFinite(nextProgress)) return;

    const clampedProgress = Math.max(0, Math.min(1, nextProgress));
    onProgressChange?.(clampedProgress);

    if (video.duration) {
      const targetTime = video.duration * clampedProgress;
      if (Math.abs(video.currentTime - targetTime) > 0.033) {
        video.currentTime = targetTime;
      }
    }
  }, [onProgressChange]);

  // Initialize video to frame 0 on load
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoadedData = () => {
      if (externalProgress?.get) {
        setVideoProgress(externalProgress.get());
      } else {
        video.currentTime = 0;
      }
    };

    video.addEventListener('loadeddata', handleLoadedData);

    if (video.readyState >= 2) {
      handleLoadedData();
    }

    return () => {
      video.removeEventListener('loadeddata', handleLoadedData);
    };
  }, [externalProgress, setVideoProgress]);

  useEffect(() => {
    if (!externalProgress?.on) return undefined;

    setVideoProgress(externalProgress.get());
    return externalProgress.on('change', setVideoProgress);
  }, [externalProgress, setVideoProgress]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    observer.observe(video);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (externalProgress) return undefined;

    const video = videoRef.current;
    if (!video || !isInView) return;

    let animationFrameId = null;
    let lastScrollTime = 0;
    const throttleDelay = 16; // ~60fps

    const updateVideoTime = () => {
      const now = Date.now();
      if (now - lastScrollTime < throttleDelay) {
        animationFrameId = requestAnimationFrame(updateVideoTime);
        return;
      }
      lastScrollTime = now;

      let progress = 0;

      if (containerRef && containerRef.current) {
        const container = containerRef.current;
        const scrollY = window.scrollY || window.pageYOffset;
        const containerTop = container.getBoundingClientRect().top + scrollY;
        const scrollableDistance = Math.max(1, container.offsetHeight);

        progress = (scrollY - containerTop) / scrollableDistance;
      } else {
        const videoHeight = video.offsetHeight;
        const scrollY = window.scrollY || window.pageYOffset;
        const videoTop = video.getBoundingClientRect().top + scrollY;

        progress = (scrollY - videoTop) / videoHeight;
      }

      // Apply scroll range mapping
      const { start, end } = scrollRange;
      progress = (progress - start) / (end - start);

      setVideoProgress(progress);

      animationFrameId = requestAnimationFrame(updateVideoTime);
    };

    animationFrameId = requestAnimationFrame(updateVideoTime);

    const handleScroll = () => {
      if (!animationFrameId) {
        animationFrameId = requestAnimationFrame(updateVideoTime);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [isInView, containerRef, externalProgress, scrollRange, setVideoProgress]);

  return (
    <Box
      sx={{
        position: 'relative',
        width: '100%',
        height: '100%',
      }}
    >
      {/* Loading overlay — 영상 전체 buffer 완료(canplaythrough) 전까지 표시.
          사이트 배경(TOKENS.bg.page) 위에 작은 인디케이터. isReady true 시 opacity 0으로 fade out. */}
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          zIndex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: TOKENS.bg.page,
          opacity: isReady ? 0 : 1,
          transition: 'opacity 600ms ease',
          pointerEvents: 'none',
        }}
      >
        <CircularProgress
          size={ 28 }
          thickness={ 3 }
          sx={ { color: TOKENS.alpha.onLight(0.45) } }
        />
      </Box>

      {/* Video — isReady 전엔 opacity 0 (디코더가 임의 frame 보이지 않게), 이후 fade in */}
      <Box
        component="video"
        ref={videoRef}
        muted
        playsInline
        preload="auto"
        sx={{
          width: '100%',
          height: 'auto',
          display: 'block',
          position: 'relative',
          zIndex: 0,
          opacity: isReady ? 1 : 0,
          transition: 'opacity 600ms ease',
          ...sx,
        }}
        {...props}
      >
        <source src={src} type="video/mp4" />
      </Box>
    </Box>
  );
};

export default VideoScrubbing;
