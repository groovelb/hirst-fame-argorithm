import { useState } from 'react';
import Button from '@mui/material/Button';
import { WorkFocusOverlay } from './WorkFocusOverlay.jsx';
import { StoryStage } from '../../stories/fixtures/StoryStage.jsx';
import { WithTimelineLayout } from '../../stories/fixtures/timelineFixtures.jsx';

/**
 * WorkFocusOverlay 스토리
 *
 * 작품을 눌렀을 때 열리는 풀스크린 상세. 도판, 연도, 매체, 소장처, 의의가 한 화면에 온다.
 */
export default {
  title: 'Custom Component/6. Overlays & Modals/WorkFocusOverlay',
  component: WorkFocusOverlay,
  parameters: { layout: 'fullscreen' },
};

/** 좌표가 붙은 실제 작품 하나 */
function OverlayDemo() {
  const [isOpen, setIsOpen] = useState(true);
  return (
    <WithTimelineLayout>
      { (layout) => {
        const work = layout.positionedWorks.find((w) => w.image) ?? layout.positionedWorks[0];
        return (
          <StoryStage minHeight={ 480 }>
            <Button variant="outlined" onClick={ () => setIsOpen(true) }>작품 상세 열기</Button>
            <WorkFocusOverlay
              activeWork={ isOpen ? work : null }
              onClose={ () => setIsOpen(false) }
            />
          </StoryStage>
        );
      } }
    </WithTimelineLayout>
  );
}

export const Default = {
  render: () => <OverlayDemo />,
};
