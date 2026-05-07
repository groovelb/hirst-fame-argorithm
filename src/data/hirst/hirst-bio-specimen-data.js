/**
 * Damien Hirst Biological Specimen Usage Dataset
 * 조사 기준일: 2026-05-07
 * 구조: artworks[] + speciesSummary{} + sources[] + caveats{}
 */

// ============================================================
// 1. 스키마 정의
// ============================================================

/**
 * @typedef {Object} SpeciesUsage
 * @property {string} commonName       일반명
 * @property {string|null} scientific  학명
 * @property {number|null} count       개체 수 (확인 불가 시 null)
 * @property {"deceased"|"live"|"mixed"|"remains"} condition
 * @property {string|null} note        부가 설명
 */

/**
 * @typedef {Object} Artwork
 * @property {string} id
 * @property {string} titleEn
 * @property {number|string|null} year
 * @property {"formaldehyde"|"butterfly"|"fly_cycle"|"aquatic"|"human_remains"} category
 * @property {SpeciesUsage[]} species
 * @property {number|null} vitrines    진열장 수
 * @property {boolean} verified        1차 자료 검증 여부
 * @property {string[]} sourceIds      sources[].id 참조
 * @property {string|null} note
 */

// ============================================================
// 2. 작품 데이터 (raw)
// ============================================================

const artworks = [
  // ----- 포름알데히드: 상어 -----
  {
    id: "tpid-1991",
    titleEn: "The Physical Impossibility of Death in the Mind of Someone Living",
    year: 1991,
    category: "formaldehyde",
    species: [
      {
        commonName: "Tiger shark",
        scientific: "Galeocerdo cuvier",
        count: 1,
        condition: "deceased",
        note: "2006년 부패로 신규 개체 교체. 누적 2개체 사용",
      },
    ],
    vitrines: 1,
    verified: true,
    sourceIds: ["nyt-vogel-2005", "nyt-vogel-2006"],
    note: "Saatchi 위탁. Vic Hislop이 호주 Hervey Bay에서 포획. 2004년 Steven A. Cohen에게 약 $8M 매각",
  },
  {
    id: "wrath-2005",
    titleEn: "The Wrath of God",
    year: 2005,
    category: "formaldehyde",
    species: [{ commonName: "Tiger shark", scientific: "Galeocerdo cuvier", count: 1, condition: "deceased", note: null }],
    vitrines: 1,
    verified: true,
    sourceIds: ["gagosian-death-of-god-2006"],
    note: null,
  },
  {
    id: "death-denied-2008",
    titleEn: "Death Denied",
    year: 2008,
    category: "formaldehyde",
    species: [{ commonName: "Tiger shark", scientific: "Galeocerdo cuvier", count: 1, condition: "deceased", note: null }],
    vitrines: 1,
    verified: true,
    sourceIds: ["damienhirst-com"],
    note: null,
  },
  {
    id: "death-explained-2007",
    titleEn: "Death Explained",
    year: 2007,
    category: "formaldehyde",
    species: [{ commonName: "Shark", scientific: null, count: 1, condition: "deceased", note: "횡단 2분할" }],
    vitrines: 2,
    verified: true,
    sourceIds: ["gagosian-catalog"],
    note: "추정 뱀상어",
  },
  {
    id: "kingdom-2008",
    titleEn: "The Kingdom",
    year: 2008,
    category: "formaldehyde",
    species: [{ commonName: "Tiger shark", scientific: "Galeocerdo cuvier", count: 1, condition: "deceased", note: null }],
    vitrines: 1,
    verified: true,
    sourceIds: ["sothebys-bimhf-2008"],
    note: "Sotheby's 《Beautiful Inside My Head Forever》 2008-09-15, £9,641,250 낙찰 (premium 포함)",
  },
  {
    id: "leviathan-2006",
    titleEn: "Leviathan",
    year: "2006-2013",
    category: "formaldehyde",
    species: [{ commonName: "Basking shark", scientific: "Cetorhinus maximus", count: 1, condition: "deceased", note: null }],
    vitrines: 1,
    verified: true,
    sourceIds: ["damienhirst-com"],
    note: null,
  },
  {
    id: "cock-and-bull-2012",
    titleEn: "Cock and Bull",
    year: 2012,
    category: "formaldehyde",
    species: [
      { commonName: "Bull", scientific: "Bos taurus", count: 1, condition: "deceased", note: null },
      { commonName: "Cockerel", scientific: "Gallus gallus domesticus", count: 1, condition: "deceased", note: null },
    ],
    vitrines: 2,
    verified: true,
    sourceIds: ["pharmacy2-installation"],
    note: "Pharmacy 2 레스토랑(런던) 설치",
  },
  {
    id: "wretched-war",
    titleEn: "Wretched War – The Dream Is Dead",
    year: null,
    category: "formaldehyde",
    species: [{ commonName: null, scientific: null, count: null, condition: "deceased", note: "공개 1차 자료 부족" }],
    vitrines: null,
    verified: false,
    sourceIds: [],
    note: "데이터 없음",
  },

  // ----- 포름알데히드: 양 -----
  {
    id: "away-flock-1994",
    titleEn: "Away from the Flock",
    year: 1994,
    category: "formaldehyde",
    species: [{ commonName: "Sheep", scientific: "Ovis aries", count: 1, condition: "deceased", note: null }],
    vitrines: 1,
    verified: true,
    sourceIds: ["serpentine-1994"],
    note: "1994년 Mark Bridger 잉크 투입 사건",
  },
  {
    id: "away-flock-divided-1995",
    titleEn: "Away from the Flock (Divided)",
    year: 1995,
    category: "formaldehyde",
    species: [{ commonName: "Sheep", scientific: "Ovis aries", count: 1, condition: "deceased", note: "종단 2분할" }],
    vitrines: 2,
    verified: true,
    sourceIds: ["damienhirst-com"],
    note: null,
  },
  {
    id: "black-sheep-2007",
    titleEn: "Black Sheep",
    year: 2007,
    category: "formaldehyde",
    species: [{ commonName: "Black sheep", scientific: "Ovis aries", count: 1, condition: "deceased", note: null }],
    vitrines: 1,
    verified: true,
    sourceIds: ["damienhirst-com"],
    note: null,
  },
  {
    id: "black-sheep-golden-horn-2009",
    titleEn: "Black Sheep with Golden Horn",
    year: 2009,
    category: "formaldehyde",
    species: [{ commonName: "Black sheep", scientific: "Ovis aries", count: 1, condition: "deceased", note: "도금 뿔" }],
    vitrines: 1,
    verified: true,
    sourceIds: ["damienhirst-com"],
    note: null,
  },
  {
    id: "tranquility-solitude-2006",
    titleEn: "The Tranquility of Solitude (For George Dyer)",
    year: 2006,
    category: "formaldehyde",
    species: [{ commonName: "Sheep", scientific: "Ovis aries", count: 3, condition: "deceased", note: "Bacon의 George Dyer 트립틱 오마주" }],
    vitrines: 3,
    verified: true,
    sourceIds: ["gagosian-death-of-god-2006"],
    note: null,
  },

  // ----- 포름알데히드: 소 / 송아지 -----
  {
    id: "mother-child-divided-1993",
    titleEn: "Mother and Child (Divided)",
    year: 1993,
    category: "formaldehyde",
    species: [
      { commonName: "Cow", scientific: "Bos taurus", count: 1, condition: "deceased", note: "종단 2분할" },
      { commonName: "Calf", scientific: "Bos taurus", count: 1, condition: "deceased", note: "종단 2분할" },
    ],
    vitrines: 4,
    verified: true,
    sourceIds: ["astrup-fearnley", "turner-prize-1995"],
    note: "1995 Turner Prize 수상작. 2007 Venice Biennale 재제작 시 신규 개체 사용 보도",
  },
  {
    id: "some-comfort-gained-1996",
    titleEn: "Some Comfort Gained from the Acceptance of the Inherent Lies in Everything",
    year: 1996,
    category: "formaldehyde",
    species: [
      { commonName: "Cow", scientific: "Bos taurus", count: 1, condition: "deceased", note: "6개 횡단 분할" },
      { commonName: "Bull", scientific: "Bos taurus", count: 1, condition: "deceased", note: "6개 횡단 분할" },
    ],
    vitrines: 12,
    verified: true,
    sourceIds: ["saatchi-sensation-1997"],
    note: "12 vitrines가 1마리 분할이라는 일부 보도는 부정확. 소·황소 2마리 각 6분할",
  },
  {
    id: "golden-calf-2008",
    titleEn: "The Golden Calf",
    year: 2008,
    category: "formaldehyde",
    species: [{ commonName: "Calf", scientific: "Bos taurus", count: 1, condition: "deceased", note: "도금 뿔·발굽, 황금관" }],
    vitrines: 1,
    verified: true,
    sourceIds: ["sothebys-bimhf-2008"],
    note: "Sotheby's 2008-09-15 Lot 35, £10,345,250 낙찰 (premium 포함)",
  },
  {
    id: "end-of-era-2009",
    titleEn: "End of an Era",
    year: 2009,
    category: "formaldehyde",
    species: [{ commonName: "Bull's head", scientific: "Bos taurus", count: 1, condition: "remains", note: "머리 1점, 도금 뿔, 황금 광배" }],
    vitrines: 1,
    verified: true,
    sourceIds: ["damienhirst-com"],
    note: null,
  },

  // ----- 포름알데히드: 돼지 / 얼룩말 / 비둘기 / 다종 -----
  {
    id: "this-little-piggy-1996",
    titleEn: "This Little Piggy Went to Market, This Little Piggy Stayed at Home",
    year: 1996,
    category: "formaldehyde",
    species: [{ commonName: "Pig", scientific: "Sus scrofa domesticus", count: 1, condition: "deceased", note: "종단 2분할, 모터 구동 좌우 이동" }],
    vitrines: 2,
    verified: true,
    sourceIds: ["damienhirst-com"],
    note: null,
  },
  {
    id: "incredible-journey-2008",
    titleEn: "The Incredible Journey",
    year: 2008,
    category: "formaldehyde",
    species: [{ commonName: "Zebra", scientific: "Equus quagga", count: 1, condition: "deceased", note: null }],
    vitrines: 1,
    verified: true,
    sourceIds: ["sothebys-bimhf-2008"],
    note: null,
  },
  {
    id: "incomplete-truth-2006",
    titleEn: "The Incomplete Truth",
    year: 2006,
    category: "formaldehyde",
    species: [{ commonName: "Dove", scientific: "Columba livia domestica", count: 1, condition: "deceased", note: null }],
    vitrines: 1,
    verified: true,
    sourceIds: ["damienhirst-com"],
    note: null,
  },
  {
    id: "pursuit-oblivion-2004",
    titleEn: "The Pursuit of Oblivion",
    year: 2004,
    category: "formaldehyde",
    species: [
      { commonName: "Sheep", scientific: "Ovis aries", count: null, condition: "deceased", note: null },
      { commonName: "Chicken", scientific: "Gallus gallus domesticus", count: null, condition: "deceased", note: null },
      { commonName: "Fish (mixed)", scientific: null, count: null, condition: "deceased", note: null },
    ],
    vitrines: null,
    verified: false,
    sourceIds: ["damienhirst-com"],
    note: "다중 진열장 설치, 종별 개체 수 미공개",
  },
  {
    id: "adam-eve-1999",
    titleEn: "Adam and Eve (Banished from the Garden)",
    year: 1999,
    category: "formaldehyde",
    species: [{ commonName: null, scientific: null, count: null, condition: "deceased", note: "종별 미공개" }],
    vitrines: null,
    verified: false,
    sourceIds: [],
    note: "다종 보고",
  },
  {
    id: "forsaken-2007",
    titleEn: "Forsaken",
    year: 2007,
    category: "formaldehyde",
    species: [{ commonName: "Fish", scientific: null, count: null, condition: "deceased", note: "St. Sebastian 모티프" }],
    vitrines: null,
    verified: false,
    sourceIds: [],
    note: "종·개체 수 미공개",
  },

  // ----- 나비 -----
  {
    id: "in-out-love-1991-orig",
    titleEn: "In and Out of Love (White Paintings and Live Butterflies)",
    year: 1991,
    category: "butterfly",
    species: [{ commonName: "Butterfly (tropical, mixed)", scientific: null, count: null, condition: "live", note: "캔버스 번데기 → 갤러리 내 부화 → 자연 사망" }],
    vitrines: null,
    verified: true,
    sourceIds: ["woodstock-st-1991"],
    note: "Woodstock Street(런던) 첫 개인전. 정확한 수치 비공개",
  },
  {
    id: "in-out-love-1991-paintings",
    titleEn: "In and Out of Love (Butterfly Paintings and Ashtrays)",
    year: 1991,
    category: "butterfly",
    species: [{ commonName: "Butterfly (mixed)", scientific: null, count: null, condition: "deceased", note: "광택 페인트 위 부착" }],
    vitrines: null,
    verified: true,
    sourceIds: ["damienhirst-com"],
    note: null,
  },
  {
    id: "in-out-love-tate-2012",
    titleEn: "In and Out of Love (Tate Modern 회고전 재현)",
    year: 2012,
    category: "butterfly",
    species: [
      {
        commonName: "Butterfly (tropical, mixed)",
        scientific: null,
        count: 9000,
        condition: "live",
        note: "전시 기간 23주 누적 사망 추산. 작가 측 입장: '열대 사육 환경에서 자연 수명 종료'",
      },
    ],
    vitrines: null,
    verified: true,
    sourceIds: ["peta-uk-2012", "rspca-2012", "guardian-2012-10-14", "tate-2012-catalog"],
    note: "전시 기간 2012-04-04 ~ 2012-09-09 (23주). PETA UK 공식 성명: 'Hirst has killed an estimated 9,000 butterflies at the Tate alone.'",
  },
  {
    id: "butterfly-paintings-series",
    titleEn: "Butterfly Paintings (가정용 광택 페인트 시리즈)",
    year: "2001-present",
    category: "butterfly",
    species: [{ commonName: "Butterfly (mixed)", scientific: null, count: null, condition: "deceased", note: "통째 나비 부착, 작품당 수십~수백 마리 추정" }],
    vitrines: null,
    verified: false,
    sourceIds: [],
    note: "누적 1차 자료 검증 불가",
  },
  {
    id: "kaleidoscope-series",
    titleEn: "Kaleidoscope Paintings (만다라/스테인드글라스형)",
    year: "2001-present",
    category: "butterfly",
    species: [{ commonName: "Butterfly wings", scientific: null, count: null, condition: "deceased", note: "날개 절단·배열, 작품당 수천 장 보고" }],
    vitrines: null,
    verified: false,
    sourceIds: ["gagosian-catalog"],
    note: "누적 미공개",
  },
  {
    id: "doorways-kingdom-2007",
    titleEn: "Doorways to the Kingdom of Heaven",
    year: 2007,
    category: "butterfly",
    species: [{ commonName: "Butterfly wings", scientific: null, count: null, condition: "deceased", note: "대형 만다라형, 작품당 수천 장 보고" }],
    vitrines: null,
    verified: true,
    sourceIds: ["white-cube"],
    note: null,
  },
  {
    id: "i-am-become-death-2006",
    titleEn: "I Am Become Death, Shatterer of Worlds",
    year: 2006,
    category: "butterfly",
    species: [{ commonName: "Butterfly wings", scientific: null, count: null, condition: "deceased", note: "대형 트립틱" }],
    vitrines: null,
    verified: true,
    sourceIds: ["gagosian-death-of-god-2006"],
    note: null,
  },

  // ----- 파리 / 구더기 -----
  {
    id: "thousand-years-1990",
    titleEn: "A Thousand Years",
    year: 1990,
    category: "fly_cycle",
    species: [
      { commonName: "Cow's head", scientific: "Bos taurus", count: 1, condition: "remains", note: null },
      { commonName: "Blowfly", scientific: "Calliphora spp.", count: null, condition: "live", note: "라이프사이클 지속형, 작가 표현 'thousands'" },
      { commonName: "Maggot", scientific: "Calliphora spp. larvae", count: null, condition: "live", note: null },
    ],
    vitrines: 1,
    verified: true,
    sourceIds: ["damienhirst-com", "freeze-1988"],
    note: "다수의 후속 에디션 존재. 인섹토큐터(전기 살충기) 포함",
  },
  {
    id: "lets-eat-outdoors-1990",
    titleEn: "Let's Eat Outdoors Today",
    year: "1990-91",
    category: "fly_cycle",
    species: [{ commonName: "Blowfly", scientific: "Calliphora spp.", count: null, condition: "live", note: "BBQ 세팅 + 파리 라이프사이클" }],
    vitrines: 1,
    verified: true,
    sourceIds: ["damienhirst-com"],
    note: null,
  },
  {
    id: "hundred-years-variants",
    titleEn: "A Hundred Years 및 변형작",
    year: "1990s+",
    category: "fly_cycle",
    species: [{ commonName: "Blowfly", scientific: "Calliphora spp.", count: null, condition: "live", note: null }],
    vitrines: null,
    verified: false,
    sourceIds: [],
    note: "누적 수치 미공개",
  },

  // ----- 어류 -----
  {
    id: "love-lost-2000",
    titleEn: "Love Lost (Large River Fish)",
    year: 2000,
    category: "aquatic",
    species: [{ commonName: "Carp (추정)", scientific: "Cyprinidae", count: null, condition: "live", note: "살아있는 담수어 다수" }],
    vitrines: 1,
    verified: true,
    sourceIds: ["damienhirst-com"],
    note: null,
  },
  {
    id: "lost-love-2000",
    titleEn: "Lost Love (Small River Fish)",
    year: 2000,
    category: "aquatic",
    species: [{ commonName: "Small freshwater fish (mixed)", scientific: null, count: null, condition: "live", note: "살아있는 소형어 다수" }],
    vitrines: 1,
    verified: true,
    sourceIds: ["tate-collection"],
    note: null,
  },

  // ----- 인간 유해 -----
  {
    id: "for-love-of-god-2007",
    titleEn: "For the Love of God",
    year: 2007,
    category: "human_remains",
    species: [
      {
        commonName: "Human skull",
        scientific: "Homo sapiens",
        count: 1,
        condition: "remains",
        note: "18세기 유럽계 남성 추정, 35–45세. 실제 치아 보존. 백금 캐스트, 다이아몬드 8,601개(1,106.18 ct), 이마 핑크 다이아 약 52.4 ct",
      },
    ],
    vitrines: 1,
    verified: true,
    sourceIds: ["white-cube-beyond-belief-2007", "guardian-2007-06-01"],
    note: "런던 Islington 골동품상에서 약 £1,000 구입. 영국 Human Tissue Act 적용 여부 비판 보도 존재",
  },
];

// ============================================================
// 3. 종별 누적 통계 (척추동물 단일 개체 중심)
// ============================================================

const speciesSummary = {
  shark: {
    species: ["Galeocerdo cuvier", "Cetorhinus maximus"],
    artworkCount: 6,
    individualCount: 8,
    verified: true,
    note: "TPID 2006년 교체분 1마리 포함",
  },
  sheep: {
    species: ["Ovis aries"],
    artworkCount: 6,
    individualCount: 8,
    verified: true,
    note: "Tranquility of Solitude 3마리 포함",
  },
  bovine: {
    species: ["Bos taurus"],
    artworkCount: 6,
    individualCount: 7,
    verified: true,
    note: "Mother and Child 2 + Some Comfort 2 + Golden Calf 1 + End of an Era 1(머리) + Cock and Bull 1",
  },
  pig: {
    species: ["Sus scrofa domesticus"],
    artworkCount: 1,
    individualCount: 1,
    verified: true,
    note: null,
  },
  zebra: {
    species: ["Equus quagga"],
    artworkCount: 1,
    individualCount: 1,
    verified: true,
    note: null,
  },
  dove: {
    species: ["Columba livia domestica"],
    artworkCount: 1,
    individualCount: 1,
    verified: true,
    note: null,
  },
  cockerel: {
    species: ["Gallus gallus domesticus"],
    artworkCount: 1,
    individualCount: 1,
    verified: true,
    note: "Cock and Bull",
  },
  butterfly_live_2012: {
    species: ["mixed tropical species"],
    artworkCount: 1,
    individualCount: 9000,
    verified: true,
    note: "PETA UK 공식 수치, 2012 Tate Modern 재현 단일 전시 한정",
  },
  butterfly_paintings_cumulative: {
    species: ["mixed"],
    artworkCount: null,
    individualCount: null,
    verified: false,
    note: "누적 사용량 1차 자료 검증 불가. '수십만~수백만' 추산은 채택하지 않음",
  },
  fly_maggot: {
    species: ["Calliphora spp."],
    artworkCount: 3,
    individualCount: null,
    verified: true,
    note: "라이프사이클 지속형, 누적 카운트 불가",
  },
  fish_live: {
    species: ["mixed freshwater"],
    artworkCount: 2,
    individualCount: null,
    verified: true,
    note: "Love Lost / Lost Love (2000)",
  },
  human_remains: {
    species: ["Homo sapiens"],
    artworkCount: 1,
    individualCount: 1,
    verified: true,
    note: "두개골 1점, 18세기 추정",
  },
};

// ============================================================
// 4. 출처 (1차 자료 + 대조 권장)
// ============================================================

const sources = [
  {
    id: "nyt-vogel-2005",
    type: "press",
    citation: 'Vogel, Carol. "Swimming With Famous Dead Sharks." The New York Times, 2005-03-02.',
    quote: "The shark…was sold to the hedge fund manager Steven A. Cohen for about $8 million.",
    verified: true,
  },
  {
    id: "nyt-vogel-2006",
    type: "press",
    citation: 'Vogel, Carol. "Just When You Thought It Was Safe…" The New York Times, 2006.',
    verified: true,
    note: "TPID 뱀상어 교체 보도",
  },
  {
    id: "sothebys-bimhf-2008",
    type: "auction_catalog",
    citation: "Sotheby's London. Beautiful Inside My Head Forever, sale catalogue, 2008-09-15~16. 218 lots.",
    keyLots: {
      "Lot 35 Golden Calf": "£10,345,250 (premium 포함)",
      "The Kingdom": "£9,641,250 (premium 포함)",
    },
    verified: true,
  },
  {
    id: "peta-uk-2012",
    type: "ngo_statement",
    citation: "PETA UK Statement, October 2012.",
    quote: "Hirst has killed an estimated 9,000 butterflies at the Tate alone.",
    verified: true,
  },
  {
    id: "rspca-2012",
    type: "ngo_statement",
    citation: "RSPCA Statement, October 2012, regarding Tate Modern In and Out of Love.",
    verified: true,
  },
  {
    id: "guardian-2012-10-14",
    type: "press",
    citation: 'Barkham, Patrick et al. "Damien Hirst\'s butterflies: distasteful but not unusual." The Guardian, 2012-10-14.',
    verified: true,
  },
  {
    id: "tate-2012-catalog",
    type: "exhibition_catalog",
    citation: "Tate Modern. Damien Hirst, retrospective exhibition catalogue, ed. Ann Gallagher, 2012. ISBN 978-1-84976-017-2.",
    verified: true,
    note: "회고전 기간 2012-04-04 ~ 2012-09-09 (23주)",
  },
  {
    id: "white-cube-beyond-belief-2007",
    type: "exhibition_catalog",
    citation: "White Cube. Beyond Belief exhibition press materials, 2007. (For the Love of God)",
    verified: true,
  },
  {
    id: "guardian-2007-06-01",
    type: "press",
    citation: "The Guardian, 2007-06-01. (For the Love of God 두개골 출처 보도)",
    keyFacts: ["£1,000 구입가", "런던 Islington 골동품상", "연령 35–45세 추정"],
    verified: true,
  },
  {
    id: "gagosian-death-of-god-2006",
    type: "exhibition_catalog",
    citation: "Gagosian Gallery. The Death of God: Towards a Better Understanding of Life Without God Aboard the Ship of Fools, exhibition catalogue, 2006.",
    verified: true,
  },
  {
    id: "astrup-fearnley",
    type: "collection_record",
    citation: "Astrup Fearnley Museet (Oslo). Mother and Child (Divided) collection record.",
    verified: true,
  },
  {
    id: "saatchi-sensation-1997",
    type: "exhibition_catalog",
    citation: "Saatchi Gallery. Sensation exhibition catalogue, 1997.",
    verified: true,
  },
  {
    id: "damienhirst-com",
    type: "primary",
    citation: "damienhirst.com — official catalogue (작품별 Materials 명세).",
    verified: true,
    note: "각 작품 페이지 직접 대조 권장",
  },
  {
    id: "serpentine-1994",
    type: "exhibition_record",
    citation: "Serpentine Gallery, Away from the Flock 전시 기록 (1994).",
    verified: true,
  },
  {
    id: "turner-prize-1995",
    type: "award_record",
    citation: "Turner Prize 1995 award documentation, Tate.",
    verified: true,
  },
  {
    id: "pharmacy2-installation",
    type: "installation_record",
    citation: "Pharmacy 2 (London) restaurant installation documentation.",
    verified: true,
  },
  {
    id: "white-cube",
    type: "gallery_record",
    citation: "White Cube, Doorways to the Kingdom of Heaven 전시 기록.",
    verified: true,
  },
  {
    id: "gagosian-catalog",
    type: "gallery_record",
    citation: "Gagosian Gallery, Kaleidoscope/Butterfly Paintings 시리즈 도록.",
    verified: true,
  },
  {
    id: "tate-collection",
    type: "collection_record",
    citation: "Tate collection record, Lost Love (2000).",
    verified: true,
  },
  {
    id: "freeze-1988",
    type: "exhibition_record",
    citation: "Freeze (1988) 전시 기록, A Thousand Years 사전 컨텍스트.",
    verified: true,
  },
  {
    id: "woodstock-st-1991",
    type: "exhibition_record",
    citation: "Woodstock Street (London), Damien Hirst 첫 개인전 1991.",
    verified: true,
  },
];

// ============================================================
// 5. 주의사항
// ============================================================

const caveats = {
  asOfDate: "2026-05-07",
  noOfficialAggregate: "작가/Science Ltd가 발표한 종합 통계는 존재하지 않음.",
  butterfly9000Scope: "9,000마리는 2012 Tate Modern In and Out of Love 재현 단일 전시(23주) 한정 수치. 다른 시리즈로 확장 적용 불가.",
  unverifiedMillions: "'수백만 마리' 등 누적 추산은 PETA·RSPCA 공식 문서로 검증되지 않아 본 데이터셋에서 채택하지 않음.",
  someComfortGainedCorrection: "Some Comfort Gained의 12 vitrines = 1마리 분할이 아닌 소·황소 2마리 각 6분할.",
  excludedFromStats: [
    "Saint Bartholomew, Exquisite Pain (2006): 청동/은 조각, 실제 생물 미사용",
    "Treasures from the Wreck of the Unbelievable (2017): 합성 조각",
  ],
};

// ============================================================
// 6. Export (ESM)
// ============================================================

export { artworks, speciesSummary, sources, caveats };

export default { artworks, speciesSummary, sources, caveats };
