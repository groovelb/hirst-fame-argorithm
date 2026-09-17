import Stack from '@mui/material/Stack';
import { CaveatNote } from './CaveatNote.jsx';
import { StoryStage } from '../../stories/fixtures/StoryStage.jsx';
import bioData from '../../data/hirst/hirst-bio-specimen-data.js';

/**
 * CaveatNote 스토리
 *
 * 통계 해석의 단서를 강조하는 주석 블록.
 */
export default {
  title: 'Custom Component/7. Era (미연결)/CaveatNote',
  component: CaveatNote,
  parameters: { layout: 'padded' },
};

/** 실제 해석 단서 두 건 */
export const Default = {
  render: () => (
    <StoryStage>
      <Stack spacing={ 2 }>
        <CaveatNote title="집계 범위">{ bioData.caveats.butterfly9000Scope }</CaveatNote>
        <CaveatNote title="검증 불가" severity="warning">
          { bioData.caveats.unverifiedMillions }
        </CaveatNote>
      </Stack>
    </StoryStage>
  ),
};
