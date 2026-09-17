import { HeroSection } from './HeroSection.jsx';
import { StoryStage } from '../../stories/fixtures/StoryStage.jsx';

/**
 * HeroSection 스토리
 *
 * 도입 구획. 고정 영상 위에 거대 타이포 두 줄이 얹히고, 스크롤이 영상의
 * 재생 위치가 된다. 진행도 콜백 세 개는 부모가 대기 화면과 지면 색에 쓴다.
 */
export default {
  title: 'Custom Component/1. Hero/HeroSection',
  component: HeroSection,
  parameters: { layout: 'fullscreen' },
};

/** 콜백 없이 기본 동작만. 영상을 전부 받은 뒤에야 스크럽이 시작된다 */
export const Default = {
  render: () => (
    <StoryStage isFlush>
      <HeroSection />
    </StoryStage>
  ),
};
