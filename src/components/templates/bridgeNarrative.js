import { BAND_IMAGE_SRC } from '../timeline/bandMeta.js';

/**
 * Bridge sections narrative — Hero(영상) 직후 Timeline 직전까지 흘러가는
 * 6개의 자연 스크롤 섹션. 각 섹션은 100vh, R2 split (좌 영상 노출 / 우 검정 패널).
 *
 * 톤: Frieze magazine. 영문 단일. Big type은 짧은 doctrine, deck은 사건 압축 산문.
 *
 * variant:
 *   'prologue' | 'pivot'  → pictogram 없음, big type 중심
 *   'category'            → pictogram + big type + deck
 */
export const BRIDGE_SECTIONS = [
  {
    id: 'prologue',
    variant: 'prologue',
    bigType: 'HOW DID HE\nBECOME THE\nSYSTEM?',
    deck:
      'In 1988 a Goldsmiths student curated his own warehouse show called Freeze. ' +
      'Saatchi, Norman Rosenthal and Nicholas Serota came. ' +
      'Thirty years later, he is not an artist anymore. He is the system.',
    pictogram: null,
  },
  {
    id: 'mortality',
    variant: 'category',
    bigType: 'DEATH',
    deck:
      '1991 — Saatchi commissions a four-metre tiger shark for £50,000. ' +
      '1993 — a cow split in two, suspended in formaldehyde. ' +
      'Put death inside a vitrine, and the museum has to buy it. ' +
      'The first trophy was a corpse.',
    pictogram: BAND_IMAGE_SRC.MORTALITY,
  },
  {
    id: 'vanitas',
    variant: 'category',
    bigType: 'PRICE',
    deck:
      '2007 — 8,601 flawless diamonds set into a platinum skull. Reported sale: £50M. ' +
      '2008 — 218 brand-new works straight to Sotheby\'s. ' +
      'The auction opened the day Lehman Brothers fell. ' +
      'Now the price is the work.',
    pictogram: BAND_IMAGE_SRC.VANITAS,
  },
  {
    id: 'system',
    variant: 'category',
    bigType: 'GRID',
    deck:
      'The spot paintings are not painted by Hirst. His assistants paint them. ' +
      'From a single wall in Goldsmiths (1986) to eleven Gagosian galleries firing on the same day (2012), ' +
      'while Tate Modern drew 463,000 visitors. ' +
      'Once the hand disappears, the name becomes a system.',
    pictogram: BAND_IMAGE_SRC.SYSTEM,
  },
  {
    id: 'ritual',
    variant: 'category',
    bigType: 'BURN',
    deck:
      '2017 — Venice. Ten years building treasures from a shipwreck. Critics sink them. ' +
      '2021 — 10,000 spot paintings paired one-to-one with NFTs. Twelve months to choose. ' +
      '4,851 canvases were thrown into the fire by his own hand. ' +
      'The artwork now kills the artwork.',
    pictogram: BAND_IMAGE_SRC.RITUAL,
  },
  {
    id: 'pivot',
    variant: 'pivot',
    bigType: 'INDEX',
    deck:
      'From here on we no longer look at works. ' +
      'We look at the search graph that built them. ' +
      'Thirty years of peaks, in chronological order.',
    pictogram: null,
  },
];
