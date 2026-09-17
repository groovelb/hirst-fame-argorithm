import Stack from '@mui/material/Stack';
import { ColorDonutChart } from './ColorDonutChart.jsx';
import { StoryStage } from '../../stories/fixtures/StoryStage.jsx';
import worksData from '../../data/hirst/hirst_works.json';
import keywordTaxonomy from '../../data/hirst/hirst_keyword_taxonomy.json';

/** 5축 키와 표시 색. TimelineCanvas 의 AXIS_COLORS 와 같은 값이다. */
const AXIS_COLORS = {
  MORTALITY: '#3F4A5B',
  SYSTEM: '#9C8B5C',
  FAITH: '#A36C3F',
  VALUE: '#5B7878',
  FORM: '#BDB6A2',
};

/** 작품 전체의 axis_weights 를 합산해 도넛 데이터로 만든다 */
function buildAxisDonutData() {
  const keys = Object.keys(AXIS_COLORS);
  const sums = Object.fromEntries(keys.map((k) => [k, 0]));
  const byAxis = Object.fromEntries(keys.map((k) => [k, []]));
  worksData.works.forEach((work) => {
    const weights = work.axis_weights || {};
    keys.forEach((k) => {
      const v = Number(weights[k] || 0);
      sums[k] += v;
      if (v > 0) {
        byAxis[k].push(work);
      }
    });
  });
  const total = keys.reduce((s, k) => s + sums[k], 0) || 1;
  return keys.map((k) => ({
    axisId: k,
    color: AXIS_COLORS[k],
    pct: sums[k] / total,
    label: keywordTaxonomy.meta.axes_overview[k]?.label ?? { ko: k, en: k },
    works: byAxis[k],
    bands: [],
  }));
}

/**
 * ColorDonutChart 스토리
 *
 * 원래는 색 클러스터 도넛이었고 지금은 사상축 도넛으로 의미를 갈아끼웠다.
 * 화면에서는 하단 패널 전용이라 표시 플래그가 꺼져 있다.
 */
export default {
  title: 'Custom Component/4. Color Analysis/ColorDonutChart',
  component: ColorDonutChart,
  parameters: { layout: 'padded' },
};

/** 작품 72점의 사상축 가중치 합 */
export const Default = {
  render: () => (
    <StoryStage minHeight={ 360 }>
      <Stack alignItems="center">
        <ColorDonutChart
          data={ buildAxisDonutData() }
          size={ 260 }
          totalWorks={ worksData.works.length }
          centerCaption="axes"
        />
      </Stack>
    </StoryStage>
  ),
};
