import { useState } from 'react';
import Button from '@mui/material/Button';
import { ColorDetailModal } from './ColorDetailModal.jsx';
import { StoryStage } from '../../stories/fixtures/StoryStage.jsx';
import worksData from '../../data/hirst/hirst_works.json';

/**
 * ColorDetailModal 스토리
 *
 * 도넛 세그먼트 하나를 눌렀을 때 열리는 상세. 색, 비율, 그 색이 쓰인 작품 목록을 보여준다.
 */
export default {
  title: 'Custom Component/4. Color Analysis/ColorDetailModal',
  component: ColorDetailModal,
  parameters: { layout: 'padded' },
};

/** 실제 작품에서 뽑은 세그먼트 하나 */
function ModalDemo() {
  const [open, setOpen] = useState(true);
  const sample = worksData.works.filter((w) => Array.isArray(w.color_blocks) && w.color_blocks.length);
  const color = sample[0]?.color_blocks?.[0]?.color ?? '#FFFFFF';
  const segment = {
    color,
    pct: 0.28,
    bands: [
      { id: 'MORTALITY', count: 12 },
      { id: 'SYSTEM', count: 7 },
    ],
    works: sample.slice(0, 8),
  };
  return (
    <StoryStage minHeight={ 240 }>
      <Button variant="outlined" onClick={ () => setOpen(true) }>세그먼트 상세 열기</Button>
      <ColorDetailModal open={ open } onClose={ () => setOpen(false) } segment={ segment } />
    </StoryStage>
  );
}

export const Default = {
  render: () => <ModalDemo />,
};
