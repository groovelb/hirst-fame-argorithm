import Box from '@mui/material/Box';
import { TimelineTrendBackground } from './TimelineTrendBackground.jsx';
import { StoryStage } from '../../stories/fixtures/StoryStage.jsx';
import { WithTimelineLayout } from '../../stories/fixtures/timelineFixtures.jsx';
import trendData from '../../../data/hirst-trend-data.json';

/**
 * TimelineTrendBackground 스토리
 *
 * 검색 지수 곡선과 정점 마커. 최대 정점 하나만 다른 색으로 찍힌다.
 * scrollProgress 를 주지 않으면 곡선 전체가 바로 보인다.
 */
export default {
  title: 'Custom Component/2. Timeline Canvas/TimelineTrendBackground',
  component: TimelineTrendBackground,
  parameters: { layout: 'fullscreen' },
};

/** 2004년부터 2026년까지 266개월 */
export const Default = {
  render: () => (
    <WithTimelineLayout>
      { (layout, viewport) => (
        <StoryStage isFlush>
          <Box sx={ { overflowX: 'auto', height: viewport.height } }>
            <Box sx={ { position: 'relative', width: layout.totalWidth, height: viewport.height } }>
              <TimelineTrendBackground
                series={ trendData.trendData.series }
                peaks={ trendData.trendData.peaks }
                axisY={ layout.axisY }
                totalWidth={ layout.totalWidth }
                yearToX={ layout.yearToX }
              />
            </Box>
          </Box>
        </StoryStage>
      ) }
    </WithTimelineLayout>
  ),
};
