import { HirstWorldviewTimeline } from './HirstWorldviewTimeline.jsx';
import { StoryStage } from '../../stories/fixtures/StoryStage.jsx';
import erasData from '../../data/hirst/hirst_eras.json';
import worksData from '../../data/hirst/hirst_works.json';
import eventsData from '../../data/hirst/hirst_events.json';
import bioData from '../../data/hirst/hirst-bio-specimen-data.js';
import workBioMap from '../../data/hirst/hirst_work_bio_map.json';

/**
 * HirstWorldviewTimeline 스토리
 *
 * 원문 설계의 연대기 셸. 7구획을 세로로 호스팅하고 각 구획에 도넛과 사건 띠를 얹는다.
 * App 에서 도달하지 않아 이 스토리가 유일한 진입점이다.
 */
export default {
  title: 'Custom Component/7. Era (미연결)/HirstWorldviewTimeline',
  component: HirstWorldviewTimeline,
  parameters: { layout: 'fullscreen' },
};

/** 실제 데이터로 그린 연대기 전체 */
export const Default = {
  args: {
    erasData,
    worksData,
    eventsData,
    bioData,
    workBioMap,
    locale: 'ko',
  },
  render: (args) => (
    <StoryStage isFlush>
      <HirstWorldviewTimeline { ...args } />
    </StoryStage>
  ),
};
