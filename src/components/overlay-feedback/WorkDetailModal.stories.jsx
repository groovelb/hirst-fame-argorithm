import { useState } from 'react';
import Button from '@mui/material/Button';
import { WorkDetailModal } from './WorkDetailModal.jsx';
import { StoryStage } from '../../stories/fixtures/StoryStage.jsx';
import worksData from '../../data/hirst/hirst_works.json';
import erasData from '../../data/hirst/hirst_eras.json';
import bioData from '../../data/hirst/hirst-bio-specimen-data.js';

/**
 * WorkDetailModal 스토리
 *
 * 원문 설계의 작품 상세. 매체, 사용 종, 소속 연대기, 출처 칩이 한 화면에 온다.
 * 현재 랜딩은 WorkFocusOverlay 를 쓴다.
 */
export default {
  title: 'Custom Component/7. Era (미연결)/WorkDetailModal',
  component: WorkDetailModal,
  parameters: { layout: 'padded' },
};

/** 1991년 상어 작품 */
function ModalDemo() {
  const [isOpen, setIsOpen] = useState(true);
  const work = worksData.works.find((w) => w.worldview_period === 'WV_VITRINE') ?? worksData.works[0];
  const era = erasData.eras.find((e) => e.id === work.worldview_period) ?? erasData.eras[0];
  const bioRecord = bioData.artworks.find((a) => a.id === 'tpid-1991') ?? bioData.artworks[0];
  const sources = bioData.sources.filter((s) => (bioRecord.sourceIds ?? []).includes(s.id));
  return (
    <StoryStage minHeight={ 320 }>
      <Button variant="outlined" onClick={ () => setIsOpen(true) }>작품 상세 열기</Button>
      <WorkDetailModal
        isOpen={ isOpen }
        onClose={ () => setIsOpen(false) }
        work={ work }
        bioRecord={ bioRecord }
        era={ era }
        sources={ sources }
        locale="ko"
      />
    </StoryStage>
  );
}

export const Default = {
  render: () => <ModalDemo />,
};
