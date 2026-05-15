# LandingPage 모바일 반응형 대응 계획

작성일: 2026-05-15
대상 파일: `src/components/templates/LandingPage.jsx` (+ 종속 컴포넌트 일부)
원칙: **md(768px) 이상 PC 디자인/동작 영향 0** — 모든 변경은 xs/sm 분기 또는 dvh 등가 교체로만 수행.

---

## 1. 배경

현 LandingPage는 데스크탑 풀스크린 영상 스크럽 + 패럴럭스 그리드 + 가로 스크롤 타임라인으로 구성된 PC-first 인터랙션 페이지다. 모바일 미대응 시 다음 4건이 사용성을 깬다.

1. `100vh` 기반 sticky 영상 — iOS/Android 주소창 hide/show 시 hero 타이포가 점프.
2. `ParallaxGridItem`의 `depth=65vh` — 모바일 viewport(~667px) 기준 ~433px 오프셋, 카드 높이 초과 → 레이아웃 붕괴.
3. `BridgeSection` 내부 토큰(`maxWidth: 460`, 픽토그램 180px, bigType 4rem) — 375px 폭에서 오버플로우/줄바꿈 압박.
4. `HirstTimeline` — vertical→horizontal hijack + hover 전용 인터랙션, 터치 본질적 부적합.

## 2. 전략 요약

| 영역 | PC | 모바일 (xs/sm) |
|---|---|---|
| Hero 영상 스크럽 | 그대로 (100dvh==100vh) | 100dvh로 주소창 점프 해소 |
| 4-카드 그리드 | ParallaxGridItem (offsetY/depth 적용) | 정적 Box (offsetY=0, depth=0) |
| 섹션 padding | `py:28vh / mt:28vh` | `py:12vh / mt:12vh`로 축소 |
| BridgeSection 토큰 | 현행 | xs 한정 보정 (deck 폭/픽토그램/bigType) |
| HirstTimeline | 현행 horizontal scroll | "PC에서 전체 타임라인 보기" 안내 카드로 대체 |

분기 방식: `useMediaQuery(theme.breakpoints.down('md'))` → `isMobile`. 컴포넌트 트리에서 분기 렌더, hooks는 **항상 호출**(rules-of-hooks 준수).

---

## 3. Phase A — LandingPage.jsx 구조 분기

### A-1. isMobile 변수 도입
```jsx
import { useMediaQuery, useTheme } from '@mui/material';

const theme = useTheme();
const isMobile = useMediaQuery(theme.breakpoints.down('md'));
```

`gridRef`/`useScroll`은 분기와 무관하게 항상 attach/호출 (모바일에선 결과만 미사용).

### A-2. ParallaxGridItem 분기 (LandingPage.jsx:151-164)
```jsx
{BRIDGE_SECTIONS.slice(1, 5).map((section, i) => (
  isMobile ? (
    <Box
      key={section.id}
      sx={{ backgroundColor: TOKENS.bg.dark }}
    >
      <BridgeSection
        section={section}
        color={TOKENS.text.onDark}
        layout="grid"
      />
    </Box>
  ) : (
    <ParallaxGridItem
      key={section.id}
      progress={gridProgress}
      offsetY={GRID_OFFSETS[i]}
      depth={GRID_DEPTHS[i]}
    >
      <BridgeSection
        section={section}
        color={TOKENS.text.onDark}
        layout="grid"
      />
    </ParallaxGridItem>
  )
))}
```

### A-3. Section 패딩 축소 (LandingPage.jsx:138, 168)
- `py: { xs: '20vh', md: '28vh' }` → `py: { xs: '12vh', md: '28vh' }`
- INDEX pivot `mt: { xs: '20vh', md: '28vh' }` → `mt: { xs: '12vh', md: '28vh' }`

### A-4. Timeline 자리 분기 (LandingPage.jsx:176-186)
```jsx
<div ref={timelineRef}>
  {isMobile ? (
    <Box
      sx={{
        backgroundColor: TOKENS.bg.dark,
        color: TOKENS.text.onDark,
        px: '6vw',
        py: '20vh',
        minHeight: '60vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        gap: 3,
      }}
    >
      <Typography sx={{ fontFamily: BRAND_DISPLAY, fontSize: '2.4rem', lineHeight: 1.05 }}>
        TIMELINE
      </Typography>
      <Typography sx={{ fontFamily: PRODUCT, fontSize: '0.95rem', lineHeight: 1.7, opacity: 0.8 }}>
        이 작품은 가로 스크롤 인터랙션 기반으로 데스크탑에서 최적화되어 있습니다.
        전체 타임라인은 PC에서 확인해 주세요.
      </Typography>
    </Box>
  ) : (
    <HirstTimeline
      worksData={worksData}
      eventsData={eventsData}
      bioData={bioData}
      trendData={trendData}
      backgroundColor={TOKENS.bg.dark}
      hideMinimap={!isTimelineVisible}
      onModalStateChange={setIsTimelineModalOpen}
    />
  )}
</div>
```

> 안내 카드 카피/타이포는 디자인 검토 후 확정. 위 코드는 placeholder.

---

## 4. Phase B — HeroSection 안전 보정

### B-1/B-2. vh → dvh **짝 교체** (필수 동시 변경)
HeroSection.jsx:147, 184, 185, 244, 257 모두 `100vh` → `100dvh` 일괄 교체.

| 위치 | 현재 | 변경 |
|---|---|---|
| L147 sticky video height | `'100vh'` | `'100dvh'` |
| L184 hero typo height | `'100vh'` | `'100dvh'` |
| L185 hero typo marginTop | `'-100vh'` | `'-100dvh'` |
| L244 spacer height | `'100vh'` | `'100dvh'` |
| L257 PROLOGUE height | `'100vh'` | `'100dvh'` |

**PC 영향**: 데스크탑 브라우저는 dynamic toolbar가 없어 `100dvh === 100vh`. 시각/스크롤 동작 동일.

**모바일 watch item** (PC 무관): HeroSection.jsx:59 `useScroll` 콜백이 `window.innerHeight`(vh 등가) 기반. dvh CSS와 미세 desync 가능 — 모바일 sticky 해제 타이밍이 영상 마지막 프레임과 1~2% 어긋날 수 있음. 시각 검증 후 필요 시 `useResizeObserver` 또는 `visualViewport` API로 보정.

---

## 5. Phase C — BridgeSection 토큰 보정

| 위치 | 현재 | 변경 | PC 영향 |
|---|---|---|---|
| BridgeSection.jsx:178 | `maxWidth: 460` | `maxWidth: { xs: '100%', md: 460 }` | 없음 (md 보존) |
| BridgeSection.jsx:75 | `{ xs: 180, sm: 240, md: 300, lg: 360 }` | `{ xs: 140, sm: 180, md: 300, lg: 360 }` | 없음 (md/lg 보존) |
| BridgeSection.jsx:149 | `{ xs: '4rem', sm: '5.5rem', md: '7rem', lg: '9rem' }` | `{ xs: '3.2rem', sm: '5.5rem', md: '7rem', lg: '9rem' }` | 없음 (sm 이상 보존) |

---

## 6. PC 무영향 검증 매트릭스

| 변경 | PC 시각 | PC 스크롤 동작 | PC hover/click |
|---|:-:|:-:|:-:|
| A-1 isMobile 변수 | 0 | 0 | 0 |
| A-2 ParallaxGridItem 분기 | 0 (md+ 동일 트리) | 0 | 0 |
| A-3 py/mt xs 값 | 0 (md 보존) | 0 | 0 |
| A-4 Timeline 분기 | 0 (md+ 동일) | 0 | 0 |
| B-1/B-2 dvh 짝 교체 | 0 (PC dvh==vh) | 0 | 0 |
| C-1~C-3 BridgeSection 토큰 | 0 (md+ 보존) | 0 | 0 |

---

## 7. 작업 순서 & 검증

### 커밋 분리 권장
1. `feat(hero): swap 100vh to 100dvh for mobile chrome stability` — Phase B
2. `feat(bridge): mobile-only sizing tokens` — Phase C
3. `feat(landing): mobile branch (parallax disable + timeline desktop-only notice)` — Phase A

각 단계마다 PC 1280/1440/1920 시각 회귀 확인 후 다음 커밋.

### 검증 체크리스트
- [ ] PC 1280/1440/1920 풀 스크롤 → 변경 전과 픽셀/타이밍 동일
- [ ] iOS Safari 375/390 → 4-카드 1열 적층, depth 잔상 없음
- [ ] iOS Safari 주소창 hide/show 시 hero 타이포 점프 없음
- [ ] Android Chrome 360/412 → 동일 확인
- [ ] 모바일에서 Timeline 자리 안내 카드만 노출, hover 의존 잔재 없음
- [ ] BridgeSection 카드 deck 텍스트 모바일 가로 오버플로우 없음
- [ ] Storybook 기존 BridgeSection 스토리 회귀 통과

---

## 8. 범위 외 (별도 작업)

- 480p 모바일 비디오 인코딩 + `<source media>` 분기 (셀룰러 데이터 절감)
- HirstTimeline 모바일 전용 카루셀/세로 리스트 fallback (디자인 재정의 필요)
- HeroSection.jsx:59 useScroll의 visualViewport 보정 (모바일 sticky 정밀화)

이번 작업 범위에서 제외, 추후 별도 PR로.
