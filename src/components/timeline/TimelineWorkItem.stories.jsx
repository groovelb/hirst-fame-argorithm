import Box from '@mui/material/Box';
import { TimelineWorkItem } from './TimelineWorkItem.jsx';
import { StoryStage } from '../../stories/fixtures/StoryStage.jsx';
import { WithTimelineLayout } from '../../stories/fixtures/timelineFixtures.jsx';

/**
 * TimelineWorkItem 스토리
 *
 * 축 위에 놓이는 작품 노드 하나. 연도 라벨, 도판, 점으로 이뤄진다.
 * 좌표는 레이아웃 훅이 계산한 값을 그대로 쓴다.
 */
export default {
  title: 'Custom Component/2. Timeline Canvas/TimelineWorkItem',
  component: TimelineWorkItem,
  parameters: { layout: 'padded' },
};

/** 앞의 작품 여섯 점을 나란히 */
export const Default = {
  render: () => (
    <WithTimelineLayout>
      { (layout) => {
        const sample = layout.positionedWorks.slice(0, 6);
        return (
          <StoryStage minHeight={ 420 }>
            <Box sx={ { position: 'relative', height: 360 } }>
              { sample.map((work, i) => (
                <TimelineWorkItem
                  key={ work.id }
                  work={ { ...work, x: 40 + i * 180, y: 40 } }
                  axisY={ 320 }
                  nodeScale={ 1 }
                />
              )) }
            </Box>
          </StoryStage>
        );
      } }
    </WithTimelineLayout>
  ),
};

/** 다른 작품이 활성일 때 흐려지는 상태 */
export const Dimmed = {
  render: () => (
    <WithTimelineLayout>
      { (layout) => {
        const sample = layout.positionedWorks.slice(0, 3);
        return (
          <StoryStage minHeight={ 420 }>
            <Box sx={ { position: 'relative', height: 360 } }>
              { sample.map((work, i) => (
                <TimelineWorkItem
                  key={ work.id }
                  work={ { ...work, x: 40 + i * 180, y: 40 } }
                  axisY={ 320 }
                  isDimmed={ i !== 0 }
                />
              )) }
            </Box>
          </StoryStage>
        );
      } }
    </WithTimelineLayout>
  ),
};
