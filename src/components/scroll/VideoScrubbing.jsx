import { useCallback, useRef, useEffect, useState } from 'react';
import Box from '@mui/material/Box';

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
  onLoadProgress,
  ...props
}) => {
  const videoRef = useRef(null);
  const [isInView, setIsInView] = useState(false);
  /**
   * isReady = 전체 영상 fetch 완료 + blob URL을 video element가 디코딩 완료한 상태.
   * 이 시점부터 임의 frame seek가 메모리 내 즉시 처리 → scrubbing 완전 부드러움.
   */
  const [isReady, setIsReady] = useState(false);
  const [blobSrc, setBlobSrc] = useState(null);

  /** onLoadProgress가 매 렌더 새 ref여도 fetch effect 재실행 안 되게 ref로 stash */
  const onLoadProgressRef = useRef(onLoadProgress);
  onLoadProgressRef.current = onLoadProgress;

  /**
   * fetch + Blob URL 전략 — Vercel CDN의 Range Request 우회.
   * 영상 전체 byte stream을 한 번에 받아 Blob으로 보관, video.src에는 blob URL 주입.
   * → 모든 frame이 메모리 상주, scroll seek 시 disk/network round-trip 0.
   * 진행률(0~1)을 onLoadProgress로 외부에 노출 → LoadingScreen %표시 등에 사용.
   */
  useEffect(() => {
    let cancelled = false;
    let createdBlobUrl = null;

    const fetchVideo = async () => {
      try {
        const res = await fetch(src);
        if (!res.ok) throw new Error(`fetch failed: ${ res.status }`);
        const total = Number(res.headers.get('Content-Length')) || 0;
        const reader = res.body.getReader();
        const chunks = [];
        let received = 0;
        /* eslint-disable no-constant-condition */
        while (true) {
          const { done, value } = await reader.read();
          if (done || cancelled) break;
          chunks.push(value);
          received += value.length;
          if (total) {
            const pct = Math.min(1, received / total);
            onLoadProgressRef.current?.(pct);
          }
        }
        /* eslint-enable no-constant-condition */
        if (cancelled) return;
        const blob = new Blob(chunks, { type: 'video/mp4' });
        createdBlobUrl = URL.createObjectURL(blob);
        setBlobSrc(createdBlobUrl);
        onLoadProgressRef.current?.(1);
      } catch (err) {
        if (!cancelled) {
          // fetch 실패 시 fallback으로 원본 src 그대로 사용
          // eslint-disable-next-line no-console
          console.warn('VideoScrubbing: fetch failed, falling back to direct src.', err);
          setBlobSrc(src);
          onLoadProgressRef.current?.(1);
        }
      }
    };

    fetchVideo();

    return () => {
      cancelled = true;
      if (createdBlobUrl) URL.revokeObjectURL(createdBlobUrl);
    };
  }, [src]);

  /** blob URL이 video element에 로드되어 metadata 디코딩 완료 시 ready 신호 발생 */
  useEffect(() => {
    if (!blobSrc) return undefined;
    const video = videoRef.current;
    if (!video) return undefined;
    const markReady = () => {
      setIsReady(true);
      onReady?.();
    };
    video.addEventListener('loadeddata', markReady);
    if (video.readyState >= 2) markReady();
    return () => video.removeEventListener('loadeddata', markReady);
  }, [blobSrc, onReady]);

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
      {/* Video — blob URL이 준비되기 전까지 src 미설정 → 빈 video element.
          외부 LoadingScreen이 fetch 진행률 동안 viewport 전체를 가린다. */}
      <Box
        component="video"
        ref={videoRef}
        src={blobSrc ?? undefined}
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
      />
    </Box>
  );
};

export default VideoScrubbing;
