/**
 * Design Tokens — Cool tone palette (2-layer).
 *
 * Layer 1 (PRIMITIVE): 색의 raw value. 컴포넌트에서 직접 import 금지.
 * Layer 2 (TOKENS):    용도 기반 시멘틱 alias. 컴포넌트는 이 layer만 사용한다.
 *
 * 색 정책:
 *  - 모든 흑/백을 "아주 살짝 차가운" 톤으로 grading (B 채널만 미세 우상향).
 *  - 사이트 페이지 배경(`bg.page`)과 영상 wrapper backdrop(`bg.surface`)을 동일 값으로
 *    유지해야 mix-blend-mode가 stacking context 안에서도 페이지 배경과 일치되어 작동.
 */

/* Layer 1 — PRIMITIVE (raw values, 외부 import 금지)
 *
 * Cool grading 강도:
 *  - black: R8 G10 B22  → B-R = 14, picker로 구분 가능한 차가운 잉크 검정
 *  - bgPage: R10 G12 B22 → 페이지 배경에 동일 hue 유지
 *  - white: R236 G241 B250 → 살짝 푸른 오프화이트
 */
const PRIMITIVE = {
  /** Cool deep black — 텍스트 베이스 */
  black: '#08090F',
  /** Page background — 영상 흰 배경(#FFFFFF)과 정확 매칭, 영상과 페이지 통합 */
  bgPage: '#FFFFFF',
  /** Cool off-white — 다크 배경 위 본문 */
  white: '#ECF1FA',
  /** Brand blue — default MUI theme primary.main */
  brandBlue: '#6666FF',
  /** Brand blue light — default MUI theme primary.light */
  brandBlueLight: '#9999FF',
  /** Alpha helpers (rgba string with given α) */
  blackAlpha: (a) => `rgba(8, 9, 15, ${a})`,
  whiteAlpha: (a) => `rgba(236, 241, 250, ${a})`,
};

/* Layer 2 — SEMANTIC TOKENS (컴포넌트 사용 전용) */
export const TOKENS = {
  bg: {
    /** 페이지 root 배경 (영상 흰 배경 영역) */
    page: PRIMITIVE.bgPage,
    /** PROLOGUE 이후 영역(분리 BridgeSection·HirstTimeline) 검정 배경 */
    dark: PRIMITIVE.black,
    /** 영상/이미지의 stacking context backdrop. page와 같아야 mix-blend 정확. */
    surface: PRIMITIVE.bgPage,
  },
  text: {
    /** 다크 배경 위 메인 텍스트 (분리 BridgeSection 등) */
    onDark: PRIMITIVE.white,
    /** 라이트/영상 흰 배경 위 메인 텍스트 (Hero 타이틀) */
    onLight: PRIMITIVE.black,
  },
  divider: {
    onDark: PRIMITIVE.whiteAlpha(0.4),
    onLight: PRIMITIVE.blackAlpha(0.4),
  },
  accent: {
    brand: PRIMITIVE.brandBlue,
    brandLight: PRIMITIVE.brandBlueLight,
  },
  /** 알파가 필요한 곳용 — 베이스 색상은 cool primitive에 맞춰져 있음 */
  alpha: {
    onDark: PRIMITIVE.whiteAlpha,   // 다크 배경 위 알파(흰색 베이스)
    onLight: PRIMITIVE.blackAlpha,  // 라이트 배경 위 알파(검정 베이스)
  },
};

export default TOKENS;
