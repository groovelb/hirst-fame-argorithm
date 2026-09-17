import Box from '@mui/material/Box';
import { TimelineAxis } from './TimelineAxis.jsx';
import { StoryStage } from '../../stories/fixtures/StoryStage.jsx';
import { WithTimelineLayout } from '../../stories/fixtures/timelineFixtures.jsx';

/**
 * TimelineAxis 스토리
 *
 * 연도 눈금과 시기 구획 띠, 세계관 밴드 라벨을 그린다. 가로 폭이 넓어
 * 스토리에서는 가로 스크롤 상자 안에 둔다.
 */
export default {
  title: 'Custom Component/2. Timeline Canvas/TimelineAxis',
  component: TimelineAxis,
  parameters: { layout: 'fullscreen' },
};

/** 실제 좌표계 위의 축 */
export const Default = {
  render: () => (
    <WithTimelineLayout>
      { (layout, viewport) => (
        <StoryStage isFlush>
          <Box sx={ { overflowX: 'auto', height: viewport.height } }>
            <Box sx={ { position: 'relative', width: layout.totalWidth, height: viewport.height } }>
              <TimelineAxis
                totalWidth={ layout.totalWidth }
                axisY={ layout.axisY }
                yearTicks={ layout.yearTicks }
                periodBands={ layout.periodBands }
                emotionBands={ layout.emotionBands }
                viewportHeight={ viewport.height }
              />
            </Box>
          </Box>
        </StoryStage>
      ) }
    </WithTimelineLayout>
  ),
};
