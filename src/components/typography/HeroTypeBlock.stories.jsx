import { HeroTypeBlock } from './HeroTypeBlock.jsx';
import { StoryStage } from '../../stories/fixtures/StoryStage.jsx';

/**
 * HeroTypeBlock 스토리
 *
 * 도입 화면의 거대 한 줄. FitText 로 컨테이너 폭을 가득 채우고,
 * 스크롤 진행도를 주면 단어마다 다른 속도로 움직인다.
 */
export default {
  title: 'Custom Component/1. Hero/HeroTypeBlock',
  component: HeroTypeBlock,
  parameters: { layout: 'fullscreen' },
};

/** 위쪽 줄 */
export const Default = {
  render: () => (
    <StoryStage minHeight={ 240 }>
      <HeroTypeBlock text="DAMIEN HIRST" align="center" padding={ 2 } color="text.primary" />
    </StoryStage>
  ),
};

/** 아래쪽 줄. 활동 기간과 프로젝트 이름이 한 줄에 온다 */
export const PeriodLine = {
  render: () => (
    <StoryStage minHeight={ 240 }>
      <HeroTypeBlock
        text="1988 - PRESENT ........... FAME ALGORITHM"
        align="center"
        padding={ 2 }
        color="text.primary"
      />
    </StoryStage>
  ),
};
