import { useMotionValue } from 'framer-motion';
import { TimelineMinimap } from './TimelineMinimap.jsx';
import { StoryStage } from '../../stories/fixtures/StoryStage.jsx';
import { WithTimelineLayout } from '../../stories/fixtures/timelineFixtures.jsx';

/**
 * TimelineMinimap 스토리
 *
 * 통람 중 현재 위치를 보여주고 누르면 그 연도 구간으로 건너뛴다.
 * 화면 하단에 고정되는 컴포넌트라 스토리에서도 고정 위치로 뜬다.
 */
export default {
  title: 'Custom Component/2. Timeline Canvas/TimelineMinimap',
  component: TimelineMinimap,
  parameters: { layout: 'fullscreen' },
};

/** 진행도 0 상태 */
function MinimapDemo() {
  const progress = useMotionValue(0.35);
  return (
    <WithTimelineLayout>
      { (layout, viewport) => (
        <StoryStage minHeight={ 420 }>
          <TimelineMinimap
            positionedWorks={ layout.positionedWorks }
            totalWidth={ layout.totalWidth }
            axisY={ layout.axisY }
            viewportWidth={ viewport.width }
            scrollProgress={ progress }
            onNavigate={ (p) => progress.set(p) }
          />
        </StoryStage>
      ) }
    </WithTimelineLayout>
  );
}

export const Default = {
  render: () => <MinimapDemo />,
};
