import { BridgeSection } from './BridgeSection.jsx';
import { BRIDGE_SECTIONS } from './bridgeNarrative.js';
import { StoryStage } from '../../stories/fixtures/StoryStage.jsx';

/**
 * BridgeSection 스토리
 *
 * 서사 장 한 개를 그린다. variant 는 prologue / category / pivot 세 가지이고
 * 큰 글자는 영문 한 벌, 해설은 로케일에 따라 갈린다.
 */
export default {
  title: 'Custom Component/5. Bridge & Narrative/BridgeSection',
  component: BridgeSection,
  parameters: { layout: 'fullscreen' },
};

/** 도입 선언 (prologue) */
export const Default = {
  render: () => (
    <StoryStage minHeight={ 480 }>
      <BridgeSection section={ BRIDGE_SECTIONS[0] } layout="grid" />
    </StoryStage>
  ),
};

/** 서사 카드 (category). 픽토그램 영상이 붙는다 */
export const CategoryCard = {
  render: () => (
    <StoryStage minHeight={ 560 }>
      <BridgeSection section={ BRIDGE_SECTIONS[1] } layout="grid" />
    </StoryStage>
  ),
};

/** 통람으로 넘어가는 전환 장 (pivot) */
export const Pivot = {
  render: () => (
    <StoryStage minHeight={ 480 }>
      <BridgeSection section={ BRIDGE_SECTIONS[5] } />
    </StoryStage>
  ),
};
