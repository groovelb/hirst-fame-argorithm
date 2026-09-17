import Stack from '@mui/material/Stack';
import { SpecimenCountBadge } from './SpecimenCountBadge.jsx';
import { StoryStage } from '../../stories/fixtures/StoryStage.jsx';

/**
 * SpecimenCountBadge 스토리
 *
 * 개체 수와 상태를 한 덩어리로 강조하는 배지.
 */
export default {
  title: 'Custom Component/7. Era (미연결)/SpecimenCountBadge',
  component: SpecimenCountBadge,
  parameters: { layout: 'padded' },
};

/** 상태 네 가지와 미공개 */
export const Default = {
  render: () => (
    <StoryStage>
      <Stack direction="row" spacing={ 2 } flexWrap="wrap" useFlexGap>
        <SpecimenCountBadge count={ 1 } condition="deceased" locale="ko" />
        <SpecimenCountBadge count={ 9000 } condition="live" locale="ko" />
        <SpecimenCountBadge count={ 8 } condition="mixed" locale="ko" />
        <SpecimenCountBadge count={ 1 } condition="remains" locale="ko" />
        <SpecimenCountBadge count={ null } condition="live" locale="ko" />
      </Stack>
    </StoryStage>
  ),
};
