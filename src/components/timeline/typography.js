/**
 * Timeline 전용 서체 토큰 — 브랜드 vs 프로덕트 분리.
 *
 * - BRAND: 헤딩, monumental 라벨, peak value 등 — Hirst의 mortality/grotesque 톤
 *          (Cinzel = Roman 묘비 비문, IM Fell English = 17c 영국 antique 인쇄체)
 * - PRODUCT: UI 라벨, 본문, 숫자/연도/정보성 텍스트 — 가독성·중립성 우선 (Inter)
 *
 * 적용 가이드:
 *   "DAMIEN HIRST" 타이틀 → BRAND_DISPLAY
 *   peak value 숫자       → BRAND_DISPLAY
 *   "1965 — PRESENT" 등   → BRAND_LABEL (small caps)
 *   year tick, search idx → PRODUCT (sans-serif)
 *   tooltip 본문/연도/medium → PRODUCT
 */
export const BRAND_DISPLAY = '"Cinzel", "Trajan Pro", "IM Fell English", "Times New Roman", serif';
export const BRAND_LABEL = '"IM Fell English SC", "IM Fell English", "Cinzel", serif';
export const BRAND_BODY = '"IM Fell English", "Times New Roman", serif';
export const PRODUCT = '"Inter", "Helvetica Neue", "Arial", system-ui, sans-serif';
