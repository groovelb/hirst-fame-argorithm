import { useState } from 'react';
import Button from '@mui/material/Button';
import { PeakHoverOverlay } from './PeakHoverOverlay.jsx';
import { StoryStage } from '../../stories/fixtures/StoryStage.jsx';
import trendData from '../../../data/hirst-trend-data.json';

/**
 * PeakHoverOverlay 스토리
 *
 * 검색 지수 정점을 눌렀을 때 열리는 사건 상세. 계기, 맥락, 거래 기록, 반응이 들어간다.
 */
export default {
  title: 'Custom Component/6. Overlays & Modals/PeakHoverOverlay',
  component: PeakHoverOverlay,
  parameters: { layout: 'fullscreen' },
};

/** 정점 사건을 라벨로 찾아주는 헬퍼 */
function getEventLabel(id) {
  const found = (trendData.events || []).find((e) => e.id === id);
  return found?.label || found?.title || id;
}

/** 2008년 소더비 경매 정점 */
function PeakDemo({ eventId }) {
  const [isOpen, setIsOpen] = useState(true);
  const activeEvent = (trendData.events || []).find((e) => e.id === eventId)
    ?? trendData.events[0];
  return (
    <StoryStage minHeight={ 480 }>
      <Button variant="outlined" onClick={ () => setIsOpen(true) }>정점 상세 열기</Button>
      <PeakHoverOverlay
        activeEvent={ isOpen ? activeEvent : null }
        getEventLabel={ getEventLabel }
        onClose={ () => setIsOpen(false) }
      />
    </StoryStage>
  );
}

export const Default = {
  render: () => <PeakDemo eventId="sotheby" />,
};

/** 2012년 테이트 회고전 정점 */
export const TateRetrospective = {
  render: () => <PeakDemo eventId="tate" />,
};
