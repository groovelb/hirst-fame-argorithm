import { RothkoTimeline } from './RothkoTimeline.jsx';
import { StoryStage } from '../../stories/fixtures/StoryStage.jsx';
import worksData from '../../data/hirst/hirst_works.json';
import eventsData from '../../data/hirst/hirst_events.json';
import bioData from '../../data/hirst/hirst-bio-specimen-data.js';
import trendData from '../../../data/hirst-trend-data.json';

/**
 * RothkoTimeline 스토리
 *
 * 앞선 코드베이스의 타임라인 셸 원형. 지금 화면은 WorldviewTimeline 을 쓰고
 * 이 파일은 비교용으로만 남아 있다.
 */
export default {
  title: 'Custom Component/10. Legacy Rothko (미연결)/RothkoTimeline',
  component: RothkoTimeline,
  parameters: { layout: 'fullscreen' },
};

/** 현재 데이터로 그린 원형 */
export const Default = {
  args: {
    worksData,
    eventsData,
    bioData,
    trendData,
    pxPerYear: 250,
    hideMinimap: true,
  },
  render: (args) => (
    <StoryStage isFlush>
      <RothkoTimeline { ...args } />
    </StoryStage>
  ),
};
