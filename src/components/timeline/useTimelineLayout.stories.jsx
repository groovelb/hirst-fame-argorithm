import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { StoryStage } from '../../stories/fixtures/StoryStage.jsx';
import { WithTimelineLayout } from '../../stories/fixtures/timelineFixtures.jsx';

/**
 * useTimelineLayout 스토리
 *
 * 연도를 X 픽셀로, 사상 좌표를 Y 밴드 높이로 바꾸는 계산 훅. 축과 곡선과 노드가
 * 이 결과를 공유한다. 화면이 없는 훅이라 계산 결과를 표로 보여준다.
 */
export default {
  title: 'Custom Component/2. Timeline Canvas/useTimelineLayout',
  parameters: { layout: 'padded' },
};

/** 실제 작품·사건 데이터로 계산한 좌표 요약 */
export const Default = {
  render: () => (
    <WithTimelineLayout>
      { (layout, viewport) => (
        <StoryStage>
          <Typography variant="h6" sx={ { mb: 2 } }>useTimelineLayout</Typography>
          <Typography variant="body2" sx={ { color: 'text.secondary', mb: 3 } }>
            뷰포트 { viewport.width } x { viewport.height } 기준. 축은 { layout.startYear } 부터 { layout.endYear } 까지.
          </Typography>
          <TableContainer sx={ { mb: 3 } }>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell sx={ { fontWeight: 600 } }>키</TableCell>
                  <TableCell sx={ { fontWeight: 600 } }>값</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                { [
                  ['totalWidth', `${ Math.round(layout.totalWidth) }px`],
                  ['axisY', `${ Math.round(layout.axisY) }px`],
                  ['positionedWorks', layout.positionedWorks.length],
                  ['positionedEvents', layout.positionedEvents.length],
                  ['periodBands', layout.periodBands.length],
                  ['emotionBands', layout.emotionBands.length],
                  ['yearTicks', layout.yearTicks.length],
                  ['yearToX(2008)', `${ Math.round(layout.yearToX(2008)) }px`],
                ].map(([k, v]) => (
                  <TableRow key={ k }>
                    <TableCell sx={ { fontFamily: 'monospace', fontSize: 12 } }>{ k }</TableCell>
                    <TableCell sx={ { fontFamily: 'monospace', fontSize: 12 } }>{ String(v) }</TableCell>
                  </TableRow>
                )) }
              </TableBody>
            </Table>
          </TableContainer>
          <Typography variant="subtitle2" sx={ { mb: 1 } }>세계관 밴드 Y 좌표</Typography>
          <Box sx={ { display: 'flex', gap: 2, flexWrap: 'wrap' } }>
            { layout.emotionBands.map((b) => (
              <Box key={ b.id } sx={ { fontFamily: 'monospace', fontSize: 12, color: 'text.secondary' } }>
                { b.id } = { Math.round(b.y) }px
              </Box>
            )) }
          </Box>
        </StoryStage>
      ) }
    </WithTimelineLayout>
  ),
};
