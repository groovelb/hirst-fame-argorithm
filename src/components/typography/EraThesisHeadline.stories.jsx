import { EraThesisHeadline } from './EraThesisHeadline.jsx';
import { StoryStage } from '../../stories/fixtures/StoryStage.jsx';
import erasData from '../../data/hirst/hirst_eras.json';

/**
 * EraThesisHeadline 스토리
 *
 * 연대기 하나의 명제 헤드라인과 요약. 원문 설계의 연대기 화면에 속하고
 * 현재 랜딩에서는 도달하지 않는다.
 */
export default {
  title: 'Custom Component/7. Era (미연결)/EraThesisHeadline',
  component: EraThesisHeadline,
  parameters: { layout: 'padded' },
};

/** 첫 연대기 */
export const Default = {
  render: () => (
    <StoryStage minHeight={ 240 }>
      <EraThesisHeadline
        thesis={ erasData.eras[0].thesis }
        summary={ erasData.eras[0].summary }
        locale="ko"
      />
    </StoryStage>
  ),
};

/** 영어 */
export const English = {
  render: () => (
    <StoryStage minHeight={ 240 }>
      <EraThesisHeadline
        thesis={ erasData.eras[2].thesis }
        summary={ erasData.eras[2].summary }
        locale="en"
      />
    </StoryStage>
  ),
};
