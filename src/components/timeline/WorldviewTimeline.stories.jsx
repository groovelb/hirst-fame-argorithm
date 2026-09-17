import { WorldviewTimeline } from './WorldviewTimeline.jsx';
import worksData from '../../data/hirst/hirst_works.json';
import eventsData from '../../data/hirst/hirst_events.json';
import bioData from '../../data/hirst/hirst-bio-specimen-data.js';
import trendData from '../../../data/hirst-trend-data.json';

/**
 * WorldviewTimeline 스토리
 *
 * 통람 구획. 세로 스크롤이 가로 이동으로 바뀌고, 검색 지수 곡선 위에
 * 작품과 사건이 얹힌다. 데이터가 커서 실제 정적 파일을 그대로 넣는다.
 */
export default {
  title: 'Section/WorldviewTimeline',
  component: WorldviewTimeline,
  parameters: {
    layout: 'fullscreen',
  },
};

/** 실제 데이터로 그린 기본 통람 */
export const Default = {
  args: {
    worksData,
    eventsData,
    bioData,
    trendData,
    pxPerYear: 250,
    backgroundColor: '#08090F',
    hideMinimap: false,
  },
};
