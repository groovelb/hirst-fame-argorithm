import { TigerSharkModelingLab } from './TigerSharkModelingLab.jsx';

/**
 * TigerSharkModelingLab 스토리
 *
 * 상어 모델링 실험실. 뷰 전환, 참고판, 랜드마크, 와이어프레임, 이빨, 줄무늬를
 * 툴바에서 켜고 끈다. 캔버스와 툴바를 스스로 갖춘 완결 화면이다.
 */
export default {
  title: 'Custom Component/8. Shark 3D (미연결)/TigerSharkModelingLab',
  component: TigerSharkModelingLab,
  parameters: { layout: 'fullscreen' },
};

/** 실험실 전체 */
export const Default = {
  render: () => <TigerSharkModelingLab />,
};
