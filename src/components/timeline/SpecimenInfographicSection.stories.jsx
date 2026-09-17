import { SpecimenInfographicSection } from './SpecimenInfographicSection.jsx';
import bioData from '../../data/hirst/hirst-bio-specimen-data.js';
import worksData from '../../data/hirst/hirst_works.json';

/**
 * SpecimenInfographicSection 스토리
 *
 * 표본 집계 구획. 총합과 기준일을 머리글에 두고 종별 카드를 격자로 편다.
 * 카드를 누르면 그 종이 쓰인 작품이 풀스크린으로 열린다.
 */
export default {
  title: 'Custom Component/3. Specimen & Bio/SpecimenInfographicSection',
  component: SpecimenInfographicSection,
  parameters: {
    layout: 'fullscreen',
  },
};

/** 실제 표본 데이터로 그린 기본 화면 */
export const Default = {
  args: {
    bioData,
    worksData,
    width: '100%',
    viewportHeight: 900,
  },
};
