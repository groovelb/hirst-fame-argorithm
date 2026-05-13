---
status: draft
phase: 2-ux-flow-appendix
last_updated: 2026-05-14
---

# Landing Page 구현 청사진

> 02-ux-flow.md § 시나리오 1 / Hero Section / Timeline Canvas 페이지의 **구현 디테일**.
> 본 문서는 합의가 아니라 코드 청사진. 컴포넌트 분해, scroll progress 매핑, prop 흐름, edge case를 명시한다.

---

## 1. 컴포넌트 트리

```
App
└── LocaleProvider
    └── ThemeProvider (defaultTheme, dark)
        └── CssBaseline
            └── LandingPage  ★ 신규, App.jsx의 직접 자식이 됨
                ├── motion.div (root, bg color motion-bound by PageBackgroundFader)
                │   ├── LanguageToggle (기존, position fixed top-right)
                │   │
                │   ├── HeroSection ★ 신규
                │   │   └── ref → useScroll(target: heroRef, offset: ['start start', 'end end'])
                │   │       │   → heroProgress (0~1 motion value)
                │   │       │
                │   │       └── height: 200vh (수직 스크롤 공간)
                │   │           └── sticky inner (top: 0, height: 100vh)
                │   │               ├── HeroTypeBlock (position absolute top)
                │   │               │   └── <FitText text="DAMIEN" variant="headline" />
                │   │               │
                │   │               ├── SharkVitrine (position absolute center, height 50vh)
                │   │               │   └── background="transparent"
                │   │               │
                │   │               └── HeroTypeBlock (position absolute bottom)
                │   │                   └── <FitText text="HIRST" variant="headline" />
                │   │
                │   └── HirstTimeline (기존 RothkoTimeline 그대로)
                │       └── HorizontalScrollContainer
                │           └── TimelineCanvas (...)
                │
                └── PageBackgroundFader (logical, not a DOM node — heroProgress를 motion bg color로 변환해 root motion.div의 style.background에 적용)
```

---

## 2. Scroll 트랜지션 Phase 정의

`useScroll({ target: heroRef, offset: ['start start', 'end end'] })`로 Hero 영역의 **자체 진행도** `heroProgress`를 얻는다. heroProgress는 사용자가 Hero 영역의 첫 px(스크롤 시작)에서 0, 마지막 px(=Hero 영역 끝)에서 1.

| Phase | heroProgress | 페이지 bg | Hero 타이포 opacity | SharkVitrine opacity | 비고 |
|---|---|---|---|---|---|
| **Hero Static** | 0 ~ 0.35 | `#FFFFFF` | 1 | 1 | 첫 화면 monumental 인상 유지 |
| **Bridge (트랜지션)** | 0.35 ~ 0.85 | `#FFFFFF` → `#0A0A0A` (보간) | 1 → 0 (보간) | 1 → 0 (보간) | 충분한 스크롤 거리 동안 천천히 가라앉음 |
| **Settled (검은 빈 화면)** | 0.85 ~ 1.0 | `#0A0A0A` | 0 | 0 | Timeline 진입 직전 정적 검정 |
| **Timeline** | (Hero 끝 이후) | `#0A0A0A` | — | — | Timeline horizontal scroll 자체적으로 계속 진행 |

구현 (motion value chain):

```js
const { scrollYProgress: heroProgress } = useScroll({
  target: heroRef,
  offset: ['start start', 'end end'],
});

// 배경색 보간 — 0.35~0.85 구간에서 white→black
const pageBg = useTransform(
  heroProgress,
  [0, 0.35, 0.85, 1],
  ['#FFFFFF', '#FFFFFF', '#0A0A0A', '#0A0A0A']
);

// 타이포·상어 opacity
const heroOpacity = useTransform(
  heroProgress,
  [0.35, 0.85],
  [1, 0]
);
```

**왜 0.35 / 0.85 구분?**

- 0~0.35 (총 70vh): 사용자가 처음 70% 화면을 스크롤하기 전까지는 Hero가 그대로. monumental 인상이 깨지지 않음.
- 0.35~0.85 (총 100vh): 1뷰포트 동안 충분히 부드러운 트랜지션.
- 0.85~1.0 (총 30vh): 검정으로 settle된 상태에서 Timeline 진입의 호흡.

---

## 3. Hero Section 레이아웃

Hero의 sticky inner는 `height: 100vh`로 고정, 안에 3개 element를 absolute 배치:

```jsx
<motion.div style={{ opacity: heroOpacity }}> {/* 전체 Hero contents */}
  {/* 상단 타이포 */}
  <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, height: '32vh', display: 'flex', alignItems: 'flex-start' }}>
    <FitText text="DAMIEN" variant="headline" fontFamily='"Cinzel", serif' fontWeight={900} maxFontSize={9999} />
  </Box>

  {/* 중앙 상어 비트린 */}
  <Box sx={{ position: 'absolute', top: '32vh', left: 0, right: 0, height: '36vh' }}>
    <SharkVitrine background="transparent" height="100%" hasControls={false} isAutoRotate isFloating />
  </Box>

  {/* 하단 타이포 */}
  <Box sx={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '32vh', display: 'flex', alignItems: 'flex-end' }}>
    <FitText text="HIRST" variant="headline" fontFamily='"Cinzel", serif' fontWeight={900} maxFontSize={9999} />
  </Box>
</motion.div>
```

**Typography 색 (Hero 단계):**
- 흰 배경 위 → 검은 텍스트 `#0A0A0A` 또는 `#1A1A1A`.
- 트랜지션 동안 텍스트는 opacity로 페이드 → 색 변경 불필요.

**FitText 활용 결정:**
- `variant="headline"`이면 Chillax 폰트 default. 본 프로젝트의 브랜드 서체 토큰(`BRAND_DISPLAY = Cinzel`)을 `fontFamily` prop으로 강제 주입해야 함.
- `maxFontSize={9999}`로 두면 컨테이너 폭에 100% 맞춰 거대 타입 (예상 fontSize: 1440px viewport에서 ~ 280~320px).
- 컨테이너에 `padding`을 두면 양 끝 여백 확보 (예: 좌우 4vw).

---

## 4. SharkVitrine 통합 결정

| 항목 | 결정 | 이유 |
|---|---|---|
| `background` prop | `'transparent'` | 외부 페이지 배경(흰→검정)이 그대로 비치도록. SharkVitrine 자체의 Box sx에는 사용자 prop이 직접 들어가므로 'transparent'로 단순 처리 |
| `hasControls` | `false` (Hero에서) | 사용자가 의도치 않게 회전시키면 monumental presence 손상. 자동 회전으로 대체 |
| `isAutoRotate` | `true` | 느린 자동 회전(autoRotateSpeed 0.4 default)으로 살아있는 인상 |
| `isFloating` | `true` | 상어가 미세하게 부유. Hirst 원작이 포름알데히드 탱크 안에 떠 있는 모티프와 일치 |
| `height` | `'100%'` 또는 `36vh` | sticky inner의 36vh 영역을 가득 채움 |
| `cameraPosition` | default `[7, 2.5, 7]` | 측면에서 약간 위 — 비트린 전체가 보임 |
| `cameraFov` | default `35` | 좁은 시야로 monumental 압축 |

**잠재 이슈**: SharkVitrineScene 내부에서 background를 환경 조명·tone-mapping에 활용할 가능성. 만약 'transparent'에서 어둡게 나오면 SharkVitrineScene 코드를 확인하고 환경맵 fallback 필요.

---

## 5. Hero → Timeline 연결

Hero Section은 `height: 200vh`. Timeline은 `HorizontalScrollContainer`가 자기 영역 안에서 sticky + transform-x로 horizontal scroll을 수행. 두 영역은 단순히 LandingPage의 vertical scroll 흐름에서 순차 배치되면 됨.

```jsx
<LandingPage>
  <HeroSection ref={heroRef} />     {/* 200vh */}
  <HirstTimeline ... />             {/* internally has its own scroll height */}
</LandingPage>
```

**관찰**: `HorizontalScrollContainer`는 자기 `containerRef` 안에서 `useScroll`을 잡으므로 Hero의 useScroll과 충돌하지 않음. 두 컴포넌트 모두 자기 영역에 대한 progress를 독립적으로 계산.

**스크롤 위치 의존성**: Hero가 끝나는 시점에 Timeline의 sticky inner가 viewport에 등장. Timeline의 0번째 가로 진행도가 시작됨.

---

## 6. PageBackgroundFader의 위치

배경색을 root에 적용하려면 LandingPage의 최상위 motion.div가 적절. 단 Timeline은 이미 자기 영역에 `background.default`(검정)로 그려지므로 페이지 root bg가 Hero 영역에서만 흰색일 때 그 너머는 자동으로 검정 = Timeline bg와 일치. 즉:

- Page root motion.div의 background는 Hero가 끝나기 직전부터 검정.
- Timeline의 자체 검정 배경이 그 위에 자연스럽게 이어짐.
- 시각 차이 없음.

---

## 7. App.jsx 변경

**Before** (현재):
```jsx
<LocaleProvider>
  <ThemeProvider theme={theme}>
    <CssBaseline />
    <LanguageToggle />
    <HirstTimeline worksData={...} eventsData={...} bioData={...} trendData={...} />
  </ThemeProvider>
</LocaleProvider>
```

**After**:
```jsx
<LocaleProvider>
  <ThemeProvider theme={theme}>
    <CssBaseline />
    <LandingPage
      worksData={...}
      eventsData={...}
      bioData={...}
      trendData={...}
    />
  </ThemeProvider>
</LocaleProvider>
```

`LandingPage`가 `LanguageToggle` + `HeroSection` + `HirstTimeline`을 호스팅. prop 통로는 그대로 timeline에 전달.

---

## 8. 파일 배치 (CLAUDE.md 디렉토리 규칙 준수)

| 파일 | 경로 | 카테고리 |
|---|---|---|
| `LandingPage.jsx` | `src/components/templates/LandingPage.jsx` | `templates/` (페이지 템플릿) |
| `LandingPage.stories.jsx` | 동일 폴더 | Storybook |
| `HeroSection.jsx` | `src/components/templates/HeroSection.jsx` | `templates/` |
| `HeroTypeBlock.jsx` | `src/components/typography/HeroTypeBlock.jsx` | `typography/` (FitText 변형) |
| `PageBackgroundFader.jsx` | `src/components/motion/PageBackgroundFader.jsx` 또는 LandingPage 내부 hook으로 인라인 | `motion/` |

> `PageBackgroundFader`는 visual element가 없는 logical hook성이라 별도 컴포넌트로 분리할지 LandingPage 내부 `useTransform`으로 인라인할지는 구현 단계에서 결정. 인라인이 더 단순.

---

## 9. Edge cases

| 케이스 | 대응 |
|---|---|
| **SSR / 첫 paint** | LandingPage의 motion.div background는 framer-motion이 마운트 후 attach. 첫 paint에 흰색이 아닐 수 있음 → root에 inline `style={{ background: '#FFFFFF' }}` fallback. Timeline은 mount 후 자기 영역이 검정 처리. |
| **모바일 viewport (작은 화면)** | FitText는 컨테이너 폭에 자동 맞춤이라 OK. 단 sticky `100vh`가 모바일 주소창 변동으로 불안정 → `100dvh` 사용. |
| **prefers-reduced-motion** | 사용자가 reduced motion 선호 시 spring·복잡한 motion 줄임. Hero 트랜지션은 색 보간만이라 영향 적음. SharkVitrine의 autoRotate는 off가 적절. |
| **FitText measure 타이밍** | 폰트(Cinzel) 로딩 전에 measure하면 폭 측정 오류. 폰트 로드 후 ResizeObserver가 한 번 더 fire하므로 자동 보정 — 단 layout shift 발생. `font-display: swap`이 default라 받아들임. |
| **느린 디바이스 SharkVitrine 부담** | three.js + drei + 3D 모델은 무거움. Hero에서 fps 떨어지면 autoRotate off + isFloating off로 폴백 가능. |
| **스크롤 점프 (anchor 진입)** | 사용자가 `/#timeline`로 직진입하면 Hero 트랜지션 건너뜀. heroProgress가 0.85~1로 시작 → 자연스럽게 settled 상태. 별도 처리 불필요. |
| **Hero 영역 height 부족** | 200vh가 짧다면 250vh~300vh로 확장. progress 매핑 구간(0.35, 0.85)은 상대값이라 영향 없음. |

---

## 10. 구현 순서 (추천)

1. **`HeroSection.jsx`** 작성 — 200vh container + sticky inner + 3-slot absolute 레이아웃. 정적 콘텐츠(FitText 2개 + SharkVitrine 1개)로 일단 흰 배경 위에 monumental 화면.
2. **Hero scroll progress 연결** — useScroll로 heroProgress 노출. 타이포·상어 opacity를 progress에 바인딩.
3. **`LandingPage.jsx`** 작성 — HeroSection + HirstTimeline 호스트. root motion.div의 background를 `useTransform(heroProgress, ...)`로 바인딩.
4. **`App.jsx` 교체** — 기존 직접 마운트 → LandingPage로 교체. 기존 prop 통로 보존.
5. **Storybook 스토리** — `LandingPage.stories.jsx`로 Default, ReducedMotion, Mobile 변형 추가.
6. **시각 미세 조정** — FitText 폭 padding, SharkVitrine 카메라 fov, autoRotate 속도, 트랜지션 구간(0.35/0.85) 미세 튜닝.

---

## 11. 검증 체크리스트 (구현 후)

- [ ] 첫 진입 시 흰 배경 + `DAMIEN` 상단 + 상어 + `HIRST` 하단이 1프레임에 정확히 표시되는가
- [ ] FitText가 폰트 로드 후 다시 measure되어 폭에 꽉 차는가
- [ ] SharkVitrine background가 'transparent'로 페이지 배경과 통합되는가 (어색한 박스 없음)
- [ ] 스크롤 시 Hero contents가 0.35~0.85 구간에서 부드럽게 fade out
- [ ] 페이지 배경이 0.35~0.85 구간에서 흰→검정으로 보간
- [ ] Hero 끝 직후 Timeline horizontal scroll이 끊김 없이 시작
- [ ] Timeline의 RothkoTimeline / 우측 trend Y축 / peak 마커 등 기존 동작 영향 없음
- [ ] LanguageToggle이 Hero와 Timeline 양쪽에서 보이는가 (position fixed)
- [ ] 모바일에서 100dvh 사용으로 주소창 영향 없는가
- [ ] reduced-motion에서 autoRotate 비활성, 트랜지션 즉시 cut

---

## 12. 미해결 결정 사항 (Phase 3 / 구현 중 확정)

- **타이포 색**: Hero 단계의 텍스트 색은 검정 default. Timeline 검정 배경에선 텍스트가 보이지 않아도 됨 (opacity 0). 단 트랜지션 중간(progress 0.5)에서 회색 페이드는 어색할 수 있음 → 단순 opacity로 통일.
- **타이포 폰트 weight**: Cinzel 900이 충분히 무거움. 그러나 FitText는 default headline에서 Chillax 사용. 명시적으로 `fontFamily='"Cinzel", serif'` + `fontWeight={900}` 강제 주입 필요.
- **타이포 letter-spacing**: 거대 사이즈에서 자간 좁히면 더 monumental. FitText prop으로 `letterSpacing={0.5}` 정도 (base 0.02em × 0.5 = 0.01em).
- **SharkVitrine 환경맵**: 'transparent' bg에서 환경맵이 어떻게 작동하는지 SharkVitrineScene 코드 확인 필요. 어두우면 별도 lighting 강화 필요.
- **Hero subtitle 여부**: "1965 — present" 같은 sublabel을 Hero에도 둘지, Timeline 진입 후에만 둘지. 현재 Timeline 좌상단에 있음 → Hero에는 불필요로 결정.
