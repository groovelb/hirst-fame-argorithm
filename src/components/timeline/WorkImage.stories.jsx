import Grid from '@mui/material/Grid';
import { WorkImage } from './WorkImage.jsx';
import { StoryStage } from '../../stories/fixtures/StoryStage.jsx';
import worksData from '../../data/hirst/hirst_works.json';

/**
 * WorkImage 스토리
 *
 * 작품 도판 한 장. 이미지가 없으면 색 블록 자리표시로 떨어진다.
 */
export default {
  title: 'Custom Component/2. Timeline Canvas/WorkImage',
  component: WorkImage,
  parameters: { layout: 'padded' },
};

/** 앞의 작품 여덟 점 */
export const Default = {
  render: () => (
    <StoryStage>
      <Grid container spacing={ 2 }>
        { worksData.works.slice(0, 8).map((work) => (
          <Grid key={ work.id } size={ { xs: 6, sm: 4, md: 3 } }>
            <WorkImage work={ work } sx={ { width: '100%', height: 160, objectFit: 'cover' } } />
          </Grid>
        )) }
      </Grid>
    </StoryStage>
  ),
};

/** 도판 경로가 없을 때의 자리표시 */
export const Placeholder = {
  render: () => (
    <StoryStage>
      <WorkImage
        work={ { ...worksData.works[0], image: null } }
        sx={ { width: 320, height: 200 } }
        showTitleInPlaceholder
      />
    </StoryStage>
  ),
};
