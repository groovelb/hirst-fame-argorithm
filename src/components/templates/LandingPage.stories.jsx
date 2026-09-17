import { LandingPage } from './LandingPage.jsx';
import worksData from '../../data/hirst/hirst_works.json';
import eventsData from '../../data/hirst/hirst_events.json';
import bioData from '../../data/hirst/hirst-bio-specimen-data.js';
import trendData from '../../../data/hirst-trend-data.json';

/**
 * LandingPage 스토리
 *
 * 라우트 `/` 하나를 통째로 그린다. 도입 영상, 서사 장, 통람 화면, 표본 집계가
 * 한 흐름으로 이어진다. 실제 정적 데이터 4종을 그대로 넣는다.
 */
export default {
  title: 'Page/LandingPage',
  component: LandingPage,
  parameters: {
    layout: 'fullscreen',
  },
};

/** 실제 데이터로 그린 기본 화면 */
export const Default = {
  args: {
    worksData,
    eventsData,
    bioData,
    trendData,
  },
};
