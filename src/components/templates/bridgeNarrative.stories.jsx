import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { BRIDGE_SECTIONS } from './bridgeNarrative.js';
import { StoryStage } from '../../stories/fixtures/StoryStage.jsx';

/**
 * bridgeNarrative 스토리
 *
 * 도입부 서사 6장의 원문 카피. 큰 글자는 영문 한 벌이고 해설만 두 언어다.
 * 데이터 상수 파일이라 컴포넌트 없이 값만 펼쳐 보여준다.
 */
export default {
  title: 'Custom Component/5. Bridge & Narrative/bridgeNarrative',
  parameters: { layout: 'padded' },
};

/** 여섯 장의 카피 전문 */
export const Default = {
  render: () => (
    <StoryStage>
      { BRIDGE_SECTIONS.map((section, i) => (
        <Box
          key={ section.id }
          sx={ { mb: 4, pb: 3, borderBottom: '1px solid', borderColor: 'divider' } }
        >
          <Stack direction="row" spacing={ 1 } sx={ { mb: 1.5 } }>
            <Chip label={ `#${ i }` } size="small" />
            <Chip label={ section.id } size="small" sx={ { fontFamily: 'monospace' } } />
            <Chip label={ section.variant } size="small" variant="outlined" />
          </Stack>
          <Typography sx={ { fontWeight: 800, fontSize: 30, lineHeight: 1.05, whiteSpace: 'pre-line', mb: 1.5 } }>
            { section.bigType }
          </Typography>
          <Typography variant="body2" sx={ { lineHeight: 1.8, mb: 1 } }>
            { section.deck?.ko }
          </Typography>
          <Typography variant="body2" sx={ { lineHeight: 1.8, color: 'text.secondary' } }>
            { section.deck?.en }
          </Typography>
          <Typography variant="caption" sx={ { fontFamily: 'monospace', color: 'text.disabled' } }>
            pictogram: { section.pictogram ?? 'null' }
          </Typography>
        </Box>
      )) }
    </StoryStage>
  ),
};
