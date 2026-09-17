import Typography from '@mui/material/Typography';
import { EraSegment } from './EraSegment.jsx';
import { EraEventStrip } from '../data-display/EraEventStrip.jsx';
import { StoryStage } from '../../stories/fixtures/StoryStage.jsx';
import erasData from '../../data/hirst/hirst_eras.json';
import eventsData from '../../data/hirst/hirst_events.json';

/**
 * EraSegment 스토리
 *
 * 연대기 한 구획을 좌우 슬롯으로 호스팅하는 컨테이너.
 * 원문 설계에서는 좌측에 도넛과 대표작, 우측에 명제와 사건 띠가 들어갔다.
 */
export default {
  title: 'Custom Component/7. Era (미연결)/EraSegment',
  component: EraSegment,
  parameters: { layout: 'fullscreen' },
};

/** 사건 띠를 우측 슬롯에 넣은 구성 */
export const Default = {
  render: () => {
    const era = erasData.eras[2];
    const events = eventsData.events.filter((e) => e.worldview_period === era.id);
    return (
      <StoryStage minHeight={ 520 }>
        <EraSegment
          era={ era }
          locale="ko"
          left={ <Typography variant="body2" sx={ { color: 'text.secondary' } }>좌측 슬롯: 도넛과 대표작 자리</Typography> }
          right={ <EraEventStrip events={ events } locale="ko" /> }
        />
      </StoryStage>
    );
  },
};
