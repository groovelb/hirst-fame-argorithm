import { useTimelineLayout } from '../../components/timeline/useTimelineLayout.js';
import worksData from '../../data/hirst/hirst_works.json';
import eventsData from '../../data/hirst/hirst_events.json';

/** 스토리에서 쓰는 고정 뷰포트. 실제 화면 대신 결정적인 값으로 고정한다. */
const STORY_VIEWPORT = { width: 1440, height: 720 };

/**
 * WithTimelineLayout
 *
 * `useTimelineLayout` 은 훅이라 스토리 객체에서 바로 부를 수 없다.
 * 이 컴포넌트가 실제 작품·사건 데이터로 레이아웃을 계산해 자식 함수에 넘긴다.
 *
 * Props:
 * @param {function} children - (layout, viewport) => ReactNode [Required]
 * @param {number} pxPerYear - 연도당 픽셀 [Optional, 기본값: 250]
 * @param {number} axisRatio - 축 Y 위치 비율 [Optional, 기본값: 0.62]
 *
 * Example usage:
 * <WithTimelineLayout>{ (layout) => <TimelineAxis { ...layout } /> }</WithTimelineLayout>
 */
function WithTimelineLayout({ children, pxPerYear = 250, axisRatio = 0.62 }) {
  const layout = useTimelineLayout({
    worksData,
    eventsData,
    pxPerYear,
    viewportWidth: STORY_VIEWPORT.width,
    viewportHeight: STORY_VIEWPORT.height,
    axisRatio,
  });
  return children(layout, STORY_VIEWPORT);
}

export { WithTimelineLayout };
