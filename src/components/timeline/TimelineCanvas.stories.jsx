import Box from '@mui/material/Box';
import { useMotionValue } from 'framer-motion';
import { TimelineCanvas } from './TimelineCanvas.jsx';
import { StoryStage } from '../../stories/fixtures/StoryStage.jsx';
import { WithTimelineLayout } from '../../stories/fixtures/timelineFixtures.jsx';
import bioData from '../../data/hirst/hirst-bio-specimen-data.js';
import trendData from '../../../data/hirst-trend-data.json';

/**
 * TimelineCanvas 스토리
 *
 * 절대 좌표 캔버스. 검색 지수 곡선, 연도 축, 작품 노드, 사건 노드를 한 평면에 얹는다.
 * 실제 화면에서는 가로 스크롤 컨테이너가 이 캔버스를 밀어준다.
 */
export default {
  title: 'Custom Component/2. Timeline Canvas/TimelineCanvas',
  component: TimelineCanvas,
  parameters: { layout: 'fullscreen' },
};

/** 전체 좌표계를 가로 스크롤 상자에 담아 본다 */
function CanvasDemo() {
  const scrollOffset = useMotionValue(0);
  const scrollProgress = useMotionValue(0);
  return (
    <WithTimelineLayout>
      { (layout, viewport) => (
        <StoryStage isFlush>
          <Box sx={ { overflowX: 'auto', height: viewport.height } }>
            <TimelineCanvas
              positionedWorks={ layout.positionedWorks }
              positionedEvents={ layout.positionedEvents }
              emotionBands={ [] }
              periodBands={ layout.periodBands }
              yearTicks={ layout.yearTicks }
              totalWidth={ layout.totalWidth }
              axisY={ layout.axisY }
              viewportHeight={ viewport.height }
              viewportWidth={ viewport.width }
              scrollOffset={ scrollOffset }
              scrollProgress={ scrollProgress }
              nodeScale={ 1 }
              bioData={ bioData }
              trendData={ trendData.trendData }
              yearToX={ layout.yearToX }
            />
          </Box>
        </StoryStage>
      ) }
    </WithTimelineLayout>
  );
}

export const Default = {
  render: () => <CanvasDemo />,
};
