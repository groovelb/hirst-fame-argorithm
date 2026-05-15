/**
 * BridgeSection pictogram — 그리드 카드용 모션 영상.
 * BridgeSection이 .mp4 경로를 받으면 autoPlay/loop/muted video로 렌더한다.
 */
const BAND_MOTION_SRC = {
  MORTALITY: '/images/hirst/grotesque-motion/motion-morality.mp4',
  VANITAS:   '/images/hirst/grotesque-motion/motion-vanitas.mp4',
  SYSTEM:    '/images/hirst/grotesque-motion/motion-system.mp4',
  RITUAL:    '/images/hirst/grotesque-motion/motion-ritual.mp4',
};

/**
 * Bridge sections narrative — Hero(영상) 직후 Timeline 직전까지의 6개 섹션.
 *
 * 정책:
 *  - bigType(타이틀)은 영문 단일 (브랜드 톤)
 *  - deck(설명)은 { ko, en } 로케일 객체 — BridgeSection에서 useLocale().localized() 적용
 */
export const BRIDGE_SECTIONS = [
  {
    id: 'prologue',
    variant: 'prologue',
    bigType: 'HOW DID HE\nBECOME THE\nSYSTEM?',
    deck: {
      en:
        'In 1988 a Goldsmiths student curated his own warehouse show called Freeze. ' +
        'Saatchi, Norman Rosenthal and Nicholas Serota came. ' +
        'Thirty years later, he is not an artist anymore. He is the system.',
      ko:
        '1988년, 골드스미스 학생 하나가 창고를 빌려 자기 전시를 직접 큐레이션했다. 이름은 Freeze. ' +
        '사치, 노먼 로젠탈, 니컬러스 세로타가 다녀갔다. ' +
        '30년이 지난 지금, 그는 더 이상 작가가 아니다. 그가 시스템이다.',
    },
    pictogram: null,
  },
  {
    id: 'mortality',
    variant: 'category',
    bigType: 'DEATH',
    deck: {
      en:
        '1991 — Saatchi commissions a four-metre tiger shark for £50,000. ' +
        '1993 — a cow split in two, suspended in formaldehyde. ' +
        'Put death inside a vitrine, and the museum has to buy it. ' +
        'The first trophy was a corpse.',
      ko:
        '1991년 — 사치가 4미터 타이거 샤크를 5만 파운드에 의뢰했다. ' +
        '1993년 — 두 동강 난 소가 포름알데히드에 매달렸다. ' +
        '죽음을 비트린에 넣으면, 미술관은 살 수밖에 없다. ' +
        '첫 트로피는 시체였다.',
    },
    pictogram: BAND_MOTION_SRC.MORTALITY,
  },
  {
    id: 'vanitas',
    variant: 'category',
    bigType: 'PRICE',
    deck: {
      en:
        '2007 — 8,601 flawless diamonds set into a platinum skull. Reported sale: £50M. ' +
        '2008 — 218 brand-new works straight to Sotheby\'s. ' +
        'The auction opened the day Lehman Brothers fell. ' +
        'Now the price is the work.',
      ko:
        '2007년 — 백금 두개골에 8,601개의 무결점 다이아몬드. 보도된 판매가 5천만 파운드. ' +
        '2008년 — 신작 218점이 곧장 소더비로. ' +
        '경매가 열린 날, 리먼 브라더스가 무너졌다. ' +
        '이제 가격이 곧 작품이다.',
    },
    pictogram: BAND_MOTION_SRC.VANITAS,
  },
  {
    id: 'system',
    variant: 'category',
    bigType: 'GRID',
    deck: {
      en:
        'The spot paintings are not painted by Hirst. His assistants paint them. ' +
        'From a single wall in Goldsmiths (1986) to eleven Gagosian galleries firing on the same day (2012), ' +
        'while Tate Modern drew 463,000 visitors. ' +
        'Once the hand disappears, the name becomes a system.',
      ko:
        '스팟 페인팅은 허스트가 그리지 않는다. 어시스턴트들이 그린다. ' +
        '1986년 골드스미스의 벽 하나에서 시작해, 2012년에는 가고시안 11개 갤러리가 같은 날 동시 점화되었고, ' +
        '같은 해 테이트 모던에 46만 3천 명이 다녀갔다. ' +
        '손이 사라지자 이름이 시스템이 되었다.',
    },
    pictogram: BAND_MOTION_SRC.SYSTEM,
  },
  {
    id: 'ritual',
    variant: 'category',
    bigType: 'BURN',
    deck: {
      en:
        '2017 — Venice. Ten years building treasures from a shipwreck. Critics sink them. ' +
        '2021 — 10,000 spot paintings paired one-to-one with NFTs. Twelve months to choose. ' +
        '4,851 canvases were thrown into the fire by his own hand. ' +
        'The artwork now kills the artwork.',
      ko:
        '2017년 — 베니스. 10년에 걸쳐 난파선에서 보물을 건져 올렸다. 비평가들이 가라앉혔다. ' +
        '2021년 — 스팟 페인팅 1만 점이 NFT와 1:1로 짝지어졌다. 12개월의 선택. ' +
        '4,851점의 캔버스가 그의 손에 의해 불 속에 던져졌다. ' +
        '이제 작품이 작품을 죽인다.',
    },
    pictogram: BAND_MOTION_SRC.RITUAL,
  },
  {
    id: 'pivot',
    variant: 'pivot',
    bigType: 'INDEX',
    deck: {
      en:
        'From here on we no longer look at works. ' +
        'We look at the search graph that built them. ' +
        'Thirty years of peaks, in chronological order.',
      ko:
        '이제부터 우리는 작품을 보지 않는다. ' +
        '작품을 만든 검색 그래프를 본다. ' +
        '시간 순으로 펼친 30년의 봉우리.',
    },
    pictogram: null,
  },
];
