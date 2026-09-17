import { BridgeSection } from './BridgeSection.jsx';
import { BRIDGE_SECTIONS } from './bridgeNarrative.js';

/**
 * BridgeSection 스토리
 *
 * 서사 장 한 개를 그린다. variant 는 prologue / category / pivot 세 가지이고
 * 큰 글자는 영문 한 벌, 해설은 로케일에 따라 갈린다.
 */
export default {
  title: 'Section/BridgeSection',
  component: BridgeSection,
  parameters: {
    layout: 'fullscreen',
    backgrounds: { default: 'dark' },
  },
};

/** 도입 선언 (prologue) */
export const Default = {
  args: {
    section: BRIDGE_SECTIONS[0],
    color: '#ECF1FA',
    layout: 'grid',
  },
};
