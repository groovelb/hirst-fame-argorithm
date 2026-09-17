import { useState } from 'react';
import Button from '@mui/material/Button';
import { SpecimenDetailModal } from './SpecimenDetailModal.jsx';
import { StoryStage } from '../../stories/fixtures/StoryStage.jsx';
import bioData from '../../data/hirst/hirst-bio-specimen-data.js';
import worksData from '../../data/hirst/hirst_works.json';

/**
 * SpecimenDetailModal 스토리
 *
 * 종 카드를 눌렀을 때 열리는 풀스크린 상세. 종 도판 옆에 그 종이 쓰인 작품들이 붙는다.
 */
export default {
  title: 'Custom Component/3. Specimen & Bio/SpecimenDetailModal',
  component: SpecimenDetailModal,
  parameters: { layout: 'fullscreen' },
};

/** SpecimenInfographicSection 이 넘기는 것과 같은 모양의 종 객체 */
function SpecimenDemo({ speciesKey, labelKo, labelEn, scientific, image }) {
  const [open, setOpen] = useState(true);
  const summary = bioData.speciesSummary[speciesKey] ?? {};
  const species = {
    key: speciesKey,
    labelKo,
    labelEn,
    labelText: labelKo,
    scientific,
    image: `/images/hirst/specimen-infographic/${ image }`,
    count: summary.individualCount ?? null,
  };
  return (
    <StoryStage minHeight={ 480 }>
      <Button variant="outlined" onClick={ () => setOpen(true) }>종 상세 열기</Button>
      <SpecimenDetailModal
        open={ open }
        onClose={ () => setOpen(false) }
        species={ species }
        artworks={ bioData.artworks }
        worksData={ worksData.works }
      />
    </StoryStage>
  );
}

/** 상어 5개체 */
export const Default = {
  render: () => (
    <SpecimenDemo
      speciesKey="shark"
      labelKo="상어"
      labelEn="Sharks"
      scientific="Galeocerdo cuvier, Cetorhinus maximus"
      image="specimen-shark-vitrine.png"
    />
  ),
};

/** 2012년 테이트 나비 9,000마리 */
export const Butterflies = {
  render: () => (
    <SpecimenDemo
      speciesKey="butterfly_live_2012"
      labelKo="나비"
      labelEn="Butterflies"
      scientific="mixed tropical species"
      image="specimen-butterfly-reliquary.png"
    />
  ),
};
