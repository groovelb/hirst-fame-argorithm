import Box from '@mui/material/Box';
import { TimelineEventItem } from './TimelineEventItem.jsx';
import { StoryStage } from '../../stories/fixtures/StoryStage.jsx';
import { WithTimelineLayout } from '../../stories/fixtures/timelineFixtures.jsx';

/**
 * TimelineEventItem 스토리
 *
 * 축 아래 사건 노드. 연도와 제목이 한 줄로 붙는다.
 */
export default {
  title: 'Custom Component/2. Timeline Canvas/TimelineEventItem',
  component: TimelineEventItem,
  parameters: { layout: 'padded' },
};

/** 사건 다섯 건 */
export const Default = {
  render: () => (
    <WithTimelineLayout>
      { (layout) => {
        const sample = layout.positionedEvents.slice(0, 5);
        return (
          <StoryStage minHeight={ 300 }>
            <Box sx={ { position: 'relative', height: 240 } }>
              { sample.map((event, i) => (
                <TimelineEventItem
                  key={ event.id }
                  event={ { ...event, x: 40 + i * 220, y: 40 } }
                  axisY={ 20 }
                  isActive={ i === 0 }
                />
              )) }
            </Box>
          </StoryStage>
        );
      } }
    </WithTimelineLayout>
  ),
};
