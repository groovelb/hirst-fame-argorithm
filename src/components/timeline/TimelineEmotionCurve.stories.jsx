import Box from '@mui/material/Box';
import { TimelineEmotionCurve } from './TimelineEmotionCurve.jsx';
import { StoryStage } from '../../stories/fixtures/StoryStage.jsx';

/**
 * TimelineEmotionCurve 스토리
 *
 * 앞선 코드베이스의 감정선 곡선. SVG path 문자열 하나를 받아 그린다.
 * import 그래프에서 완전히 고립되어 있어 이 스토리가 유일한 진입점이다.
 */
export default {
  title: 'Custom Component/10. Legacy Rothko (미연결)/TimelineEmotionCurve',
  component: TimelineEmotionCurve,
  parameters: { layout: 'fullscreen' },
};

/** 사인 곡선으로 만든 예시 경로 */
function samplePath(width, height, points = 60) {
  const step = width / points;
  const mid = height / 2;
  const d = [];
  for (let i = 0; i <= points; i += 1) {
    const x = i * step;
    const y = mid + Math.sin(i / 6) * (height * 0.22) + Math.sin(i / 2.3) * (height * 0.05);
    d.push(`${ i === 0 ? 'M' : 'L' } ${ x.toFixed(1) } ${ y.toFixed(1) }`);
  }
  return d.join(' ');
}

export const Default = {
  render: () => {
    const width = 2400;
    const height = 520;
    return (
      <StoryStage isFlush>
        <Box sx={ { overflowX: 'auto', height } }>
          <Box sx={ { position: 'relative', width, height } }>
            <TimelineEmotionCurve path={ samplePath(width, height) } totalWidth={ width } viewportHeight={ height } />
          </Box>
        </Box>
      </StoryStage>
    );
  },
};
