/**
 * 세계관 5밴드 메타데이터 — 라벨/이미지/표시 순서.
 *
 * BandLegend(하단 범례), WorkFocusOverlay(작품 상세) 등에서 공통 사용.
 * 단일 출처(single source of truth)로 두어 라벨/자산 변경 시 한 곳만 수정.
 */

/** 표시 순서: 좌→우 (서사적 그라데이션: 죽음 → 초월) */
export const BAND_ORDER = ['MORTALITY', 'VANITAS', 'RITUAL', 'SYSTEM', 'TRANSCENDENCE'];

/** 영문 라벨 — i18n 사용 안 함, 영어 고정 */
export const BAND_LABEL_EN = {
  TRANSCENDENCE: 'Transcendence',
  SYSTEM: 'System',
  RITUAL: 'Ritual',
  VANITAS: 'Vanitas',
  MORTALITY: 'Mortality',
};

/** 밴드 대표 이미지 — TimelineAxis에서 사용하던 자산 그대로 */
export const BAND_IMAGE_SRC = {
  TRANSCENDENCE: '/images/hirst/grotesque-bitmap/transcendence-sacred-heart.png',
  SYSTEM: '/images/hirst/grotesque-bitmap/system-medicine-cabinet.png',
  RITUAL: '/images/hirst/grotesque-bitmap/ritual-vanitas-burning-money.png',
  VANITAS: '/images/hirst/grotesque-bitmap/ritual-vanitas-burning-money.png',
  MORTALITY: '/images/hirst/grotesque-bitmap/mortality-skull.png',
};
