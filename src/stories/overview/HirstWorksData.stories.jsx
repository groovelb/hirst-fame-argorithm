import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
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
import worksData from '../../data/hirst/hirst_works.json';
import eventsData from '../../data/hirst/hirst_events.json';
import trendData from '../../../data/hirst-trend-data.json';
import bioData from '../../data/hirst/hirst-bio-specimen-data.js';
import erasData from '../../data/hirst/hirst_eras.json';
import keywordTaxonomy from '../../data/hirst/hirst_keyword_taxonomy.json';
import workBioMap from '../../data/hirst/hirst_work_bio_map.json';
import bioArtworkImages from '../../data/hirst/hirst_bio_artwork_images.json';
import assetInventory from '../../data/assetInventory.js';

export default {
  title: 'Overview/Fame Algorithm/05 Works Data',
  parameters: {
    layout: 'padded',
  },
};

/** 표에 한 번에 노출하는 최대 행 수. 넘으면 상위 N행만 보이고 총계를 캡션에 적는다. */
const PREVIEW_ROWS = 20;

/** 작품 id 로 도판 경로를 찾는다. 파일명이 `W001_1986_...` 꼴이다. */
const WORK_IMAGE_BY_ID = Object.fromEntries(
  (assetInventory.items || [])
    .filter((it) => it.folder === 'images/hirst' && /^W\d{3}_/.test(it.name))
    .map((it) => [it.name.slice(0, 4), it.url]),
);

/** 종 키와 표본 인포그래픽 도판. SpecimenInfographicSection 의 SPECIES_ROWS 와 같은 짝이다. */
const SPECIMEN_IMAGE = {
  butterfly_live_2012: 'specimen-butterfly-reliquary.png',
  butterfly_paintings_cumulative: 'specimen-butterfly-reliquary.png',
  shark: 'specimen-shark-vitrine.png',
  sheep: 'specimen-ruminant-plate.png',
  bovine: 'specimen-ruminant-plate.png',
  pig: 'specimen-pig.png',
  zebra: 'specimen-zebra.png',
  dove: 'specimen-dove.png',
  cockerel: 'specimen-cockerel.png',
  fly_maggot: 'specimen-uncounted-cycle.png',
  fish_live: 'specimen-uncounted-cycle.png',
  human_remains: 'specimen-minor-animals-strip.png',
};

/**
 * 표 안의 작은 썸네일. 없으면 자리만 비운다.
 *
 * Props:
 * @param {string} src - 이미지 경로 [Optional]
 * @param {string} alt - 대체 텍스트 [Required]
 *
 * Example usage:
 * <RowThumb src={ WORK_IMAGE_BY_ID.W001 } alt="W001" />
 */
function RowThumb({ src, alt }) {
  return (
    <Box
      sx={ {
        width: 56,
        height: 56,
        backgroundColor: 'grey.100',
        overflow: 'hidden',
        lineHeight: 0,
      } }
    >
      { src && (
        <Box
          component="img"
          src={ src }
          alt={ alt }
          loading="lazy"
          sx={ { width: '100%', height: '100%', objectFit: 'cover', display: 'block' } }
        />
      ) }
    </Box>
  );
}

/**
 * 세계관 밴드(WorldviewBand) 5종.
 * 값 구간은 src/components/timeline/useTimelineLayout.js 의 BANDS 상수 기준이며,
 * 작품의 worldview_y 값이 어느 구간에 들어가는지로 세로 위치가 정해진다.
 */
const WORLDVIEW_BANDS = [
  { id: 'TRANSCENDENCE', min: 0.6, max: 1.0, note: '미, 승화, 신성기하' },
  { id: 'SYSTEM', min: 0.2, max: 0.59, note: '분류, 격자, 산업' },
  { id: 'RITUAL', min: -0.19, max: 0.19, note: '의례, 찰나, 순환' },
  { id: 'VANITAS', min: -0.59, max: -0.2, note: '바니타스, 소멸' },
  { id: 'MORTALITY', min: -1.0, max: -0.6, note: '죽음의 직시' },
];

/** 데이터명 ↔ 한국어 ↔ 원천 파일 (02 UX Flow 3.2절 이름 사전과 같은 이름을 쓴다) */
const DATA_DICTIONARY = [
  { name: 'Work', ko: '작품', file: 'src/data/hirst/hirst_works.json', count: '72' },
  { name: 'Event', ko: '사건', file: 'src/data/hirst/hirst_events.json', count: '52' },
  { name: 'SearchTrend', ko: '검색 트렌드', file: 'data/hirst-trend-data.json', count: '266' },
  { name: 'Era', ko: '연대기', file: 'hirst_events.json · meta.worldview_periods', count: '7' },
  { name: 'WorldviewBand', ko: '세계관 밴드', file: 'components/timeline/useTimelineLayout.js', count: '5' },
  { name: 'NarrativeChapter', ko: '서사 장', file: 'components/templates/bridgeNarrative.js', count: '6' },
  { name: 'SpecimenLedger', ko: '표본 집계', file: 'src/data/hirst/hirst-bio-specimen-data.js', count: '12' },
];

/** 화면이 읽지 않는 병렬 데이터. 원문 설계의 흔적이라 함께 보여준다. */
const UNWIRED_FILES = [
  { file: 'src/data/hirst/hirst_eras.json', role: '연대기 7개의 명제와 축 가중치 평균', reader: '없음 (미연결 화면 전용)' },
  { file: 'src/data/hirst/hirst_keyword_taxonomy.json', role: '5축 키워드 사전 60개', reader: '없음 (미연결 화면 전용)' },
  { file: 'src/data/hirst/hirst_work_bio_map.json', role: '작품 id와 표본 작품 id의 수동 매핑', reader: 'SpecimenDetailModal' },
];

/**
 * 표 머리글과 행을 받아 그리는 얇은 표.
 *
 * Props:
 * @param {Array} columns - 컬럼 정의 [{ key, label, width, mono }] [Required]
 * @param {Array} rows - 표시할 행 배열 [Required]
 * @param {function} rowKey - 행의 key 를 만드는 함수 [Optional, 기본값: index 사용]
 *
 * Example usage:
 * <DataTable columns={ cols } rows={ items } rowKey={ (r) => r.id } />
 */
function DataTable({ columns, rows, rowKey }) {
  return (
    <TableContainer sx={ { mb: 4 } }>
      <Table size="small">
        <TableHead>
          <TableRow>
            { columns.map((c) => (
              <TableCell key={ c.key } sx={ { fontWeight: 600, width: c.width } }>
                { c.label }
              </TableCell>
            )) }
          </TableRow>
        </TableHead>
        <TableBody>
          { rows.map((r, i) => (
            <TableRow
              key={ rowKey ? rowKey(r) : i }
              sx={ { '&:hover': { backgroundColor: 'action.hover' } } }
            >
              { columns.map((c) => (
                <TableCell
                  key={ c.key }
                  sx={ {
                    fontSize: 12,
                    verticalAlign: 'top',
                    fontFamily: c.mono ? 'monospace' : undefined,
                    color: c.dim ? 'text.secondary' : undefined,
                  } }
                >
                  { c.render ? c.render(r) : String(r[c.key] ?? '') }
                </TableCell>
              )) }
            </TableRow>
          )) }
        </TableBody>
      </Table>
    </TableContainer>
  );
}

/** 표 아래에 붙는 총계 캡션 */
function TotalCaption({ shown, total, unit = '행' }) {
  if (shown >= total) {
    return null;
  }
  return (
    <Typography variant="caption" color="text.secondary" sx={ { display: 'block', mb: 4, mt: -3 } }>
      상위 { shown }{ unit }만 표시 · 총 { total }{ unit }
    </Typography>
  );
}

/** 한국어 라벨을 꺼낸다. { ko, en } 객체이거나 문자열이다. */
const ko = (v) => (typeof v === 'string' ? v : v?.ko ?? '');

/** Hirst 정적 데이터 4종의 스키마와 실제 값 */
export const Default = {
  render: () => {
    const works = worksData.works || [];
    const events = eventsData.events || [];
    const eras = eventsData.meta?.worldview_periods || [];
    const series = trendData.trendData?.series || [];
    const peaks = trendData.trendData?.peaks || [];
    const trendEvents = trendData.events || [];
    const species = Object.entries(bioData.speciesSummary || {});
    const eraCards = erasData.eras || [];
    const axes = Object.entries(keywordTaxonomy.meta?.axes_overview || {});
    const keywords = Object.entries(keywordTaxonomy.keywords || {});
    const bioMap = Object.entries(workBioMap.workToBio || {});
    const bioImageRows = Object.entries(bioArtworkImages.images || {});
    const sources = bioData.sources || [];
    const caveats = bioData.caveats || {};

    return (
      <DocSurface>
        <DocumentTitle
          title="Works Data"
          status="Available"
          note="작품 · 사건 · 검색 트렌드 · 표본 집계의 정적 데이터"
          brandName="Design System"
          systemName="Fame Algorithm"
          version="1.0"
        />
        <PageContainer>
          <Typography variant="h4" sx={ { fontWeight: 700, mb: 1 } }>
            Works Data
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={ { mb: 2 } }>
            <code>src/data/hirst/*.json</code> · <code>src/data/hirst/hirst-bio-specimen-data.js</code> · <code>data/hirst-trend-data.json</code>
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={ { mb: 4 } }>
            이름은 02 UX Flow 3.2절 이름 사전을 그대로 쓴다. 모든 데이터는 정적 파일이고 서버는 없다.
          </Typography>

          <SectionTitle title="이름 사전" description="데이터명과 원천 파일" />
          <DataTable
            columns={ [
              { key: 'name', label: '데이터명', width: 150, mono: true },
              { key: 'ko', label: '한국어', width: 110 },
              { key: 'file', label: '원천 파일', mono: true, dim: true },
              { key: 'count', label: '항목 수', width: 70, mono: true },
            ] }
            rows={ DATA_DICTIONARY }
            rowKey={ (r) => r.name }
          />

          <SectionTitle title="병렬 데이터 파일" description="같은 주제를 담았지만 화면 연결이 다른 파일" />
          <DataTable
            columns={ [
              { key: 'file', label: '파일', width: 300, mono: true },
              { key: 'role', label: '담은 것', width: 260 },
              { key: 'reader', label: '읽는 곳', dim: true },
            ] }
            rows={ UNWIRED_FILES }
            rowKey={ (r) => r.file }
          />

          <SectionTitle title="Work (작품)" description={ `${ works.length }점 · id, year, title, period, worldview_period, medium, axis_weights` } />
          <DataTable
            columns={ [
              { key: 'thumb', label: '도판', width: 70, render: (r) => <RowThumb src={ WORK_IMAGE_BY_ID[r.id] } alt={ r.id } /> },
              { key: 'id', label: 'id', width: 60, mono: true },
              { key: 'year', label: 'year', width: 55, mono: true },
              { key: 'title', label: 'title', width: 220 },
              { key: 'worldview_period', label: 'worldview_period', width: 170, mono: true },
              { key: 'medium', label: 'medium', dim: true },
            ] }
            rows={ works.slice(0, PREVIEW_ROWS) }
            rowKey={ (r) => r.id }
          />
          <TotalCaption shown={ PREVIEW_ROWS } total={ works.length } unit="점" />

          <SectionTitle title="Era (연대기)" description={ `${ eras.length }구획 · 통람 화면의 시기 띠. hirst_events.json 의 meta.worldview_periods` } />
          <DataTable
            columns={ [
              { key: 'id', label: 'id', width: 200, mono: true },
              { key: 'label', label: 'label', width: 200, render: (r) => ko(r.label) },
              { key: 'range', label: 'range', width: 120, mono: true, render: (r) => (r.range || []).join(' ~ ') },
              { key: 'dominant_axes', label: 'dominant_axes', mono: true, render: (r) => (r.dominant_axes || []).join(', ') },
            ] }
            rows={ eras }
            rowKey={ (r) => r.id }
          />

          <SectionTitle
            title="Era · hirst_eras.json"
            description={ `${ eraCards.length }개 · 같은 7구획의 명제와 요약. 화면은 이 파일을 읽지 않는다` }
          />
          <DataTable
            columns={ [
              { key: 'id', label: 'id', width: 190, mono: true },
              { key: 'slug', label: 'slug', width: 110, mono: true },
              { key: 'years', label: 'years', width: 100, mono: true, render: (r) => `${ r.yearStart } ~ ${ r.yearEnd }` },
              { key: 'name', label: 'name', width: 130, render: (r) => ko(r.name) },
              { key: 'thesis', label: 'thesis', render: (r) => ko(r.thesis) },
            ] }
            rows={ eraCards }
            rowKey={ (r) => r.id }
          />

          <SectionTitle title="WorldviewBand (세계관 밴드)" description="5종 · 작품의 worldview_y 값이 들어가는 구간이 세로 위치를 정한다" />
          <DataTable
            columns={ [
              { key: 'id', label: 'id', width: 180, mono: true },
              { key: 'min', label: 'min', width: 80, mono: true },
              { key: 'max', label: 'max', width: 80, mono: true },
              { key: 'note', label: '뜻', dim: true },
            ] }
            rows={ WORLDVIEW_BANDS }
            rowKey={ (r) => r.id }
          />

          <SectionTitle
            title="사상축 · hirst_keyword_taxonomy.json"
            description={ `5축 × 키워드 ${ keywords.length }개. 작품의 axis_weights 키와 글자 단위로 맞춘다` }
          />
          <DataTable
            columns={ [
              { key: 'axis', label: 'axis', width: 120, mono: true, render: (r) => r[0] },
              { key: 'label', label: 'label', width: 150, render: (r) => ko(r[1].label) },
              { key: 'polarity', label: 'y_polarity', width: 100, mono: true, render: (r) => r[1].y_polarity },
              { key: 'color', label: 'signature_color', width: 120, mono: true, render: (r) => r[1].signature_color },
              { key: 'premise', label: 'premise', dim: true, render: (r) => ko(r[1].premise) },
            ] }
            rows={ axes }
            rowKey={ (r) => r[0] }
          />

          <SectionTitle title="사상축 키워드" description={ `${ keywords.length }개 · 축별 12개씩` } />
          <DataTable
            columns={ [
              { key: 'key', label: 'key', width: 170, mono: true, render: (r) => r[0] },
              { key: 'axis', label: 'axis', width: 120, mono: true, render: (r) => r[1].axis },
              { key: 'label', label: 'label', width: 140, render: (r) => ko(r[1].label) },
              { key: 'category', label: 'category', width: 90, mono: true, render: (r) => r[1].category },
              { key: 'definition', label: 'definition', dim: true, render: (r) => ko(r[1].definition) },
            ] }
            rows={ keywords.slice(0, PREVIEW_ROWS) }
            rowKey={ (r) => r[0] }
          />
          <TotalCaption shown={ PREVIEW_ROWS } total={ keywords.length } unit="개" />

          <SectionTitle title="Event (사건)" description={ `${ events.length }건 · 생애, 전시, 시장 사건. 통람 화면의 축 아래 노드` } />
          <DataTable
            columns={ [
              { key: 'id', label: 'id', width: 60, mono: true },
              { key: 'year', label: 'year', width: 55, mono: true },
              { key: 'category', label: 'category', width: 90, mono: true },
              { key: 'title', label: 'title', width: 220, render: (r) => ko(r.title) },
              { key: 'worldview_period', label: 'worldview_period', mono: true, dim: true },
            ] }
            rows={ events.slice(0, PREVIEW_ROWS) }
            rowKey={ (r) => r.id }
          />
          <TotalCaption shown={ PREVIEW_ROWS } total={ events.length } unit="건" />

          <SectionTitle title="SearchTrend (검색 트렌드)" description={ `${ trendData.trendData?.source ?? '' } · ${ trendData.trendData?.unit ?? '' }` } />
          <Box sx={ { mb: 2 } }>
            <Chip label={ `range ${ trendData.trendData?.range?.start } ~ ${ trendData.trendData?.range?.end }` } size="small" sx={ { mr: 1 } } />
            <Chip label={ `series ${ series.length }` } size="small" sx={ { mr: 1 } } />
            <Chip label={ `peaks ${ peaks.length }` } size="small" sx={ { mr: 1 } } />
            <Chip label={ `events ${ trendEvents.length }` } size="small" sx={ { mr: 1 } } />
            <Chip label={ `as of ${ trendData.$meta?.asOfDate ?? '' }` } size="small" />
          </Box>
          <DataTable
            columns={ [
              { key: 'date', label: 'date', width: 90, mono: true },
              { key: 'value', label: 'value', width: 70, mono: true },
              { key: 'trigger', label: 'trigger' },
              { key: 'eventId', label: 'eventId', width: 120, mono: true, dim: true },
            ] }
            rows={ peaks }
            rowKey={ (r) => r.date }
          />

          <SectionTitle title="SearchTrend · series" description={ `월별 검색 지수. [date, value] 쌍 ${ series.length }개` } />
          <DataTable
            columns={ [
              { key: 'date', label: 'date', width: 120, mono: true, render: (r) => r[0] },
              { key: 'value', label: 'value', mono: true, render: (r) => String(r[1]) },
            ] }
            rows={ series.slice(0, PREVIEW_ROWS) }
            rowKey={ (r) => r[0] }
          />
          <TotalCaption shown={ PREVIEW_ROWS } total={ series.length } unit="개월" />

          <SectionTitle title="SearchTrend · events" description={ `${ trendEvents.length }건 · 정점을 누르면 열리는 사건 해설` } />
          <DataTable
            columns={ [
              { key: 'id', label: 'id', width: 150, mono: true },
              { key: 'date', label: 'date', width: 80, mono: true },
              { key: 'label', label: 'label', width: 200 },
              { key: 'impactPercent', label: 'impact', width: 80, mono: true },
              { key: 'subtitle', label: 'subtitle', dim: true },
            ] }
            rows={ trendEvents }
            rowKey={ (r) => r.id }
          />

          <SectionTitle title="SpecimenLedger (표본 집계)" description={ `${ species.length }키 · 화면 카드는 이 가운데 8종. 기준일 ${ caveats.asOfDate ?? '' }` } />
          <DataTable
            columns={ [
              { key: 'thumb', label: '도판', width: 70, render: (r) => (
                <RowThumb
                  src={ SPECIMEN_IMAGE[r[0]] ? `/images/hirst/specimen-infographic/${ SPECIMEN_IMAGE[r[0]] }` : null }
                  alt={ r[0] }
                />
              ) },
              { key: 'key', label: 'key', width: 180, mono: true, render: (r) => r[0] },
              { key: 'species', label: 'species', width: 170, render: (r) => (r[1].species || []).join(', ') },
              { key: 'artworkCount', label: '작품 수', width: 70, mono: true, render: (r) => String(r[1].artworkCount ?? '미공개') },
              { key: 'individualCount', label: '개체 수', width: 70, mono: true, render: (r) => String(r[1].individualCount ?? '미공개') },
              { key: 'verified', label: 'verified', width: 70, mono: true, render: (r) => String(r[1].verified) },
              { key: 'note', label: 'note', dim: true, render: (r) => r[1].note ?? '' },
            ] }
            rows={ species }
            rowKey={ (r) => r[0] }
          />

          <SectionTitle title="SpecimenLedger · sources" description={ `${ sources.length }건 · 정량 수치의 1차 자료. 현재 화면에는 노출되지 않는다` } />
          <DataTable
            columns={ [
              { key: 'id', label: 'id', width: 170, mono: true },
              { key: 'type', label: 'type', width: 80, mono: true },
              { key: 'citation', label: 'citation' },
              { key: 'verified', label: 'verified', width: 70, mono: true, render: (r) => String(r.verified) },
            ] }
            rows={ sources.slice(0, PREVIEW_ROWS) }
            rowKey={ (r) => r.id }
          />
          <TotalCaption shown={ PREVIEW_ROWS } total={ sources.length } unit="건" />

          <SectionTitle title="SpecimenLedger · caveats" description="통계 해석의 단서. 화면에는 기준일만 나온다" />
          <DataTable
            columns={ [
              { key: 'key', label: 'key', width: 230, mono: true, render: (r) => r[0] },
              { key: 'value', label: 'value', render: (r) => (Array.isArray(r[1]) ? r[1].join(' / ') : String(r[1])) },
            ] }
            rows={ Object.entries(caveats) }
            rowKey={ (r) => r[0] }
          />

          <SectionTitle
            title="작품 매핑 · hirst_work_bio_map.json"
            description={ `${ bioMap.length }건 · 작품 id와 표본 작품 id를 손으로 이었다. ${ workBioMap.meta?.asOfDate ?? '' }` }
          />
          <DataTable
            columns={ [
              { key: 'workThumb', label: '작품', width: 70, render: (r) => <RowThumb src={ WORK_IMAGE_BY_ID[r[0]] } alt={ r[0] } /> },
              { key: 'workId', label: 'Work.id', width: 110, mono: true, render: (r) => r[0] },
              { key: 'bioId', label: '표본 작품 id', mono: true, render: (r) => r[1] },
            ] }
            rows={ bioMap.slice(0, PREVIEW_ROWS) }
            rowKey={ (r) => r[0] }
          />
          <TotalCaption shown={ PREVIEW_ROWS } total={ bioMap.length } unit="건" />

          <SectionTitle
            title="표본 작품 보조 도판 · hirst_bio_artwork_images.json"
            description={ `${ bioImageRows.length }건 · 위 매핑에 없는 표본 작품의 도판. ${ bioArtworkImages.meta?.asOfDate ?? '' }` }
          />
          <DataTable
            columns={ [
              { key: 'thumb', label: '도판', width: 70, render: (r) => <RowThumb src={ r[1] } alt={ r[0] } /> },
              { key: 'bioId', label: '표본 작품 id', width: 230, mono: true, render: (r) => r[0] },
              { key: 'path', label: 'path', mono: true, dim: true, render: (r) => r[1] },
            ] }
            rows={ bioImageRows }
            rowKey={ (r) => r[0] }
          />

          <Typography variant="body2" color="text.secondary">
            NarrativeChapter(서사 장)는 06 Content Data에서 다룬다. 세계관 밴드의 긴 해설은
            06의 i18n 카피 표에 있다.
          </Typography>
        </PageContainer>
      </DocSurface>
    );
  },
};
