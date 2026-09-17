import Stack from '@mui/material/Stack';
import { SourceChip } from './SourceChip.jsx';
import { StoryStage } from '../../stories/fixtures/StoryStage.jsx';
import bioData from '../../data/hirst/hirst-bio-specimen-data.js';

/**
 * SourceChip 스토리
 *
 * 1차 자료 한 건을 칩으로. 누르면 인용과 검증 여부가 뜬다.
 */
export default {
  title: 'Custom Component/7. Era (미연결)/SourceChip',
  component: SourceChip,
  parameters: { layout: 'padded' },
};

/** 실제 출처 여섯 건 */
export const Default = {
  render: () => (
    <StoryStage minHeight={ 320 }>
      <Stack direction="row" spacing={ 1 } flexWrap="wrap" useFlexGap>
        { bioData.sources.slice(0, 6).map((source) => (
          <SourceChip key={ source.id } source={ source } />
        )) }
      </Stack>
    </StoryStage>
  ),
};
