import { HeroSection } from './HeroSection.jsx';

/**
 * HeroSection 스토리
 *
 * 도입 구획. 고정 영상 위에 거대 타이포 두 줄이 얹히고, 스크롤이 영상의
 * 재생 위치가 된다. 진행도 콜백 세 개는 부모가 대기 화면과 지면 색에 쓴다.
 */
export default {
  title: 'Section/HeroSection',
  component: HeroSection,
  parameters: {
    layout: 'fullscreen',
  },
};

/** 콜백 없이 기본 동작만 */
export const Default = {
  args: {},
};
