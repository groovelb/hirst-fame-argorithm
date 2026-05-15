import { useCallback, useRef, useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import { motion } from 'framer-motion';

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
  scale,
  transformOrigin = 'center center',
  ...props
}) => {
  const videoRef = useRef(null);
  const [isInView, setIsInView] = useState(false);

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

  /**
   * scale은 video element 자체에만 적용. wrapper Box(outer)는 layout 그대로 유지하여
   * 외부 element(hero typo 등 sibling)에는 어떤 transform/stacking 영향도 가지 않게 한다.
   * scale prop이 motion value면 framer-motion이 매 frame video DOM에 직접 transform 적용.
   */
  const motionStyle = scale != null
    ? { scale, transformOrigin, willChange: 'transform' }
    : undefined;

  return (
    <Box
      sx={{
        position: 'relative',
        width: '100%',
        height: '100%',
      }}
    >
      {/* Video — scale 받을 때만 motion.video, 아니면 일반 video */}
      <Box
        component={scale != null ? motion.video : 'video'}
        ref={videoRef}
        muted
        playsInline
        preload="auto"
        style={motionStyle}
        sx={{
          width: '100%',
          height: 'auto',
          display: 'block',
          position: 'relative',
          zIndex: 0,
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
