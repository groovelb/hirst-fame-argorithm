import { useEffect, useState } from 'react';
import { Box, Stack, Typography } from '@mui/material';

/**
 * WorldviewMiniMap 컴포넌트
 *
 * 우측 스티키 7-Era 앵커 내비. 현재 뷰포트의 Era id를 인디케이터로 표시.
 * IntersectionObserver로 활성 Era 추적.
 *
 * Props:
 * @param {array} eras - Era 배열 (id, slug, name, yearStart, yearEnd) [Required]
 * @param {string} locale - 'ko' | 'en' [Optional, 기본값: 'ko']
 *
 * Example usage:
 * <WorldviewMiniMap eras={ eras } locale="ko" />
 */
export function WorldviewMiniMap({ eras = [], locale = 'ko' }) {
  const [activeId, setActiveId] = useState(eras[0]?.id ?? null);

  useEffect(() => {
    const observers = [];
    eras.forEach((era) => {
      const node = document.getElementById(`era-${era.slug}`);
      if (!node) return;
      const obs = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) setActiveId(era.id);
          });
        },
        { rootMargin: '-40% 0px -50% 0px' },
      );
      obs.observe(node);
      observers.push(obs);
    });
    return () => observers.forEach((o) => o.disconnect());
  }, [eras]);

  return (
    <Box
      component="nav"
      aria-label="Worldview eras"
      sx={{
        position: 'fixed',
        top: '50%',
        right: { xs: 'auto', md: 24 },
        bottom: { xs: 16, md: 'auto' },
        left: { xs: 16, md: 'auto' },
        transform: { xs: 'none', md: 'translateY(-50%)' },
        display: { xs: 'none', md: 'block' },
        zIndex: 10,
      }}
    >
      <Stack spacing={ 1.5 }>
        { eras.map((era) => {
          const isActive = era.id === activeId;
          const name = era.name?.[locale] ?? era.name?.ko ?? era.id;
          return (
            <Box
              key={ era.id }
              component="a"
              href={ `#era-${era.slug}` }
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1.5,
                textDecoration: 'none',
                color: 'text.primary',
                opacity: isActive ? 1 : 0.5,
                transition: 'opacity 200ms',
                '&:hover': { opacity: 1 },
              }}
            >
              <Box
                sx={{
                  width: isActive ? 24 : 12,
                  height: 2,
                  backgroundColor: 'primary.main',
                  transition: 'width 200ms',
                }}
              />
              <Typography variant="overline" sx={{ fontWeight: isActive ? 700 : 500 }}>
                { name }
              </Typography>
            </Box>
          );
        }) }
      </Stack>
    </Box>
  );
}
