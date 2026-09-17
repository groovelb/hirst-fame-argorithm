import Typography from '@mui/material/Typography';
import { LanguageToggle } from './LanguageToggle.jsx';
import { StoryStage } from '../../stories/fixtures/StoryStage.jsx';

/**
 * LanguageToggle 스토리
 *
 * 화면 우상단에 고정되는 한국어와 영어 토글. 상세가 열리면 부모가 이 토글을 숨긴다.
 */
export default {
  title: 'Custom Component/6. Overlays & Modals/LanguageToggle',
  component: LanguageToggle,
  parameters: { layout: 'fullscreen' },
};

/** 고정 위치라 빈 무대 위에 띄운다 */
export const Default = {
  render: () => (
    <StoryStage minHeight={ 360 }>
      <Typography variant="body2" sx={ { color: 'text.secondary' } }>
        토글은 화면 우상단에 고정된다. 누르면 전역 로케일이 바뀐다.
      </Typography>
      <LanguageToggle />
    </StoryStage>
  ),
};
