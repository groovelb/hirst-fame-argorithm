import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import {
  DocumentTitle,
  PageContainer,
  SectionTitle,
} from '../../components/storybookDocumentation';
import { DocSurface } from '../fixtures/DocSurface.jsx';
import { BRIDGE_SECTIONS } from '../../components/templates/bridgeNarrative.js';
import koContent from '../../i18n/locales/ko/content.js';
import enContent from '../../i18n/locales/en/content.js';

export default {
  title: 'Overview/Fame Algorithm/06 Content Data',
  parameters: {
    layout: 'padded',
  },
};

/** variant 값별 쓰이는 자리 */
const VARIANT_ROLE = {
  prologue: 'Hero · 도입 영상 위의 첫 선언',
  category: 'Bridge · 2열 그리드 카드 4장',
  pivot: 'Bridge · 통람으로 넘어가는 전환 장',
};

/** Hero 타이포는 컴포넌트 상수라 데이터 파일이 아니다. 화면 문자열만 옮겨 적는다. */
const HERO_TYPE = [
  { slot: '상단', text: 'DAMIEN HIRST', note: '아래 줄의 1/4 속도로 빠져나간다' },
  { slot: '하단', text: '1988 - PRESENT ... FAME ALGORITHM', note: '단어별 패럴럭스' },
];

/**
 * 서사 장 한 개를 카드로 그린다.
 *
 * Props:
 * @param {Object} section - BRIDGE_SECTIONS 의 한 항목 [Required]
 * @param {number} index - 배열 순서 [Required]
 *
 * Example usage:
 * <ChapterBlock section={ BRIDGE_SECTIONS[0] } index={ 0 } />
 */
function ChapterBlock({ section, index }) {
  return (
    <Box
      sx={ {
        mb: 4,
        p: 2.5,
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 1,
      } }
    >
      <Stack direction="row" spacing={ 1 } alignItems="center" sx={ { mb: 1.5 } }>
        <Chip label={ `#${ index }` } size="small" />
        <Chip label={ section.id } size="small" sx={ { fontFamily: 'monospace' } } />
        <Chip label={ section.variant } size="small" variant="outlined" />
        <Typography variant="caption" color="text.secondary">
          { VARIANT_ROLE[section.variant] ?? '' }
        </Typography>
      </Stack>

      <Typography
        sx={ {
          fontWeight: 800,
          fontSize: 28,
          lineHeight: 1.05,
          whiteSpace: 'pre-line',
          mb: 2,
        } }
      >
        { section.bigType }
      </Typography>

      <Typography variant="body2" sx={ { mb: 1.5, lineHeight: 1.8 } }>
        { section.deck?.ko }
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={ { mb: 1.5, lineHeight: 1.8 } }>
        { section.deck?.en }
      </Typography>

      <Typography
        variant="caption"
        sx={ { fontFamily: 'monospace', fontSize: 11, color: 'text.secondary' } }
      >
        pictogram: { section.pictogram ?? 'null' }
      </Typography>
    </Box>
  );
}

/** 세계관 밴드 해설을 한국어와 영어 한 쌍으로 펼친다 */
function bandRows() {
  const ko = koContent.bandDesc || {};
  const en = enContent.bandDesc || {};
  return Object.keys(ko).map((key) => ({ key, ko: ko[key], en: en[key] ?? '' }));
}

/** 서사 장(NarrativeChapter) 6개의 카피와 픽토그램 매핑 */
export const Default = {
  render: () => (
    <DocSurface>
      <DocumentTitle
        title="Content Data"
        status="Available"
        note="서사 장 6개의 큰 글자와 해설, 한국어와 영어"
        brandName="Design System"
        systemName="Fame Algorithm"
        version="1.0"
      />
      <PageContainer>
        <Typography variant="h4" sx={ { fontWeight: 700, mb: 1 } }>
          Content Data
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={ { mb: 2 } }>
          <code>src/components/templates/bridgeNarrative.js</code>
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={ { mb: 4 } }>
          02 UX Flow의 대상 이름으로는 NarrativeChapter(서사 장)다. 큰 글자는 영문 한 벌이고,
          해설만 한국어와 영어 두 벌을 둔다. 로케일 선택은 화면 우상단 토글이 맡는다.
        </Typography>

        <SectionTitle
          title="BRIDGE_SECTIONS"
          description={ `${ BRIDGE_SECTIONS.length }개 · { id, variant, bigType, deck: { ko, en }, pictogram }` }
        />
        <TableContainer sx={ { mb: 4 } }>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={ { fontWeight: 600, width: 60 } }>#</TableCell>
                <TableCell sx={ { fontWeight: 600, width: 120 } }>id</TableCell>
                <TableCell sx={ { fontWeight: 600, width: 100 } }>variant</TableCell>
                <TableCell sx={ { fontWeight: 600, width: 200 } }>bigType</TableCell>
                <TableCell sx={ { fontWeight: 600 } }>쓰이는 자리</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              { BRIDGE_SECTIONS.map((s, i) => (
                <TableRow key={ s.id }>
                  <TableCell sx={ { fontFamily: 'monospace', fontSize: 12 } }>{ i }</TableCell>
                  <TableCell sx={ { fontFamily: 'monospace', fontSize: 12 } }>{ s.id }</TableCell>
                  <TableCell sx={ { fontFamily: 'monospace', fontSize: 12 } }>{ s.variant }</TableCell>
                  <TableCell sx={ { fontSize: 12, whiteSpace: 'pre-line' } }>{ s.bigType }</TableCell>
                  <TableCell sx={ { fontSize: 12, color: 'text.secondary' } }>
                    { VARIANT_ROLE[s.variant] ?? '' }
                  </TableCell>
                </TableRow>
              )) }
            </TableBody>
          </Table>
        </TableContainer>

        <SectionTitle title="Hero Typography" description="도입 화면의 거대 타이포. 데이터 파일이 아니라 화면 상수다" />
        <TableContainer sx={ { mb: 4 } }>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={ { fontWeight: 600, width: 80 } }>slot</TableCell>
                <TableCell sx={ { fontWeight: 600, width: 320 } }>text</TableCell>
                <TableCell sx={ { fontWeight: 600 } }>비고</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              { HERO_TYPE.map((h) => (
                <TableRow key={ h.slot }>
                  <TableCell sx={ { fontSize: 12 } }>{ h.slot }</TableCell>
                  <TableCell sx={ { fontFamily: 'monospace', fontSize: 12 } }>{ h.text }</TableCell>
                  <TableCell sx={ { fontSize: 12, color: 'text.secondary' } }>{ h.note }</TableCell>
                </TableRow>
              )) }
            </TableBody>
          </Table>
        </TableContainer>

        <SectionTitle
          title="bandDesc (i18n)"
          description={ `${ bandRows().length }개 · src/i18n/locales/{ko,en}/content.js. 세계관 밴드(WorldviewBand) 해설의 실제 원천` }
        />
        { bandRows().map((r) => (
          <Box
            key={ r.key }
            sx={ {
              mb: 3,
              p: 2.5,
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 1,
            } }
          >
            <Chip label={ r.key } size="small" sx={ { fontFamily: 'monospace', mb: 1.5 } } />
            <Typography variant="body2" sx={ { mb: 1.5, lineHeight: 1.8 } }>
              { r.ko }
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={ { lineHeight: 1.8 } }>
              { r.en }
            </Typography>
          </Box>
        )) }

        <Typography variant="body2" color="text.secondary" sx={ { mb: 4 } }>
          로케일 파일은 <code>content.js</code>(콘텐츠 카피)와 <code>ui.js</code>(버튼과 라벨) 두 벌이다.
          위 표는 content.js 전량이다.
        </Typography>

        <SectionTitle title="장별 전문" description="큰 글자, 한국어 해설, 영어 해설, 픽토그램 경로" />
        { BRIDGE_SECTIONS.map((s, i) => (
          <ChapterBlock key={ s.id } section={ s } index={ i } />
        )) }
      </PageContainer>
    </DocSurface>
  ),
};
