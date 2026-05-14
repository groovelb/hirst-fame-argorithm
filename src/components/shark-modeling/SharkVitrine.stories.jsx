import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import SharkVitrine from './SharkVitrine';

export default {
  title: 'Component/Shark Modeling/SharkVitrine',
  component: SharkVitrine,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
## SharkVitrine

Damien Hirst의 대표작
**'The Physical Impossibility of Death in the Mind of Someone Living'** (1991)
— 포름알데히드 탱크에 보존된 타이거 상어 작품을
\`three.js\` + \`@react-three/fiber\`로 재현한 인터랙티브 3D 컴포넌트.

### 컴포넌트 구조
\`SharkVitrine\`은 \`SharkVitrineScene\`을 \`<Canvas>\` + \`<OrbitControls>\`로 감싼 형태.
3D 씬만 외부 캔버스에 임베드하려면 \`SharkVitrineScene\` 사용.

### 시각 구성 (Phase 0~E)
- **외부 panel matte 프레임**: 박스 6면 외곽 흰색 도장 슬랫
- **plinth**: 박스 본체 아래 별도 받침대 (갭 라인 분리)
- **유리 5면**: 얇은 transmission 시트 (IOR 1.52)
- **포름알데히드 액체**: transmission 매질 (IOR 1.33) + 청록 attenuation
- **내부 rebar 케이지**: 4 코너 strut + 천장 ribs + 바닥 ridges (스틸 #6b9b94)
- **볼트 그리드**: 각 strut 안쪽에 11개 볼트
- **상어 모델**: \`/crysis_shark.glb\` (Sketchfab, AllThingsSaurus, CC-BY-4.0)
- **부유 애니메이션**: 시간 기반 sin 함수로 미세 떠 있는 움직임

### 디자인 토큰 시스템
\`vitrineDesign.js\`의 \`computeVitrineGeometry([w, h, d])\`가 박스 크기 하나로
모든 sub-dimension·재질을 파생. shortSide 비례 기준이라 크기 바꿔도 일관 유지.

### Props
- \`modelUrl\` (string): glTF 경로 (기본 \`/crysis_shark.glb\`)
- \`sharkScale\` (number): 상어 모델 스케일
- \`tankSize\` ([w, h, d]): 탱크 크기
- \`isFloating\` (boolean): 부유 애니메이션
- \`isAutoRotate\` (boolean): 카메라 자동 회전
- \`hasControls\` (boolean): OrbitControls 활성화
- \`background\` (string): 갤러리 배경색
- \`height\` (number): 캔버스 높이
- \`cameraPosition\` ([x, y, z]): 초기 카메라 위치
- \`cameraFov\` (number): 카메라 FOV
        `,
      },
    },
  },
  argTypes: {
    modelUrl: { control: 'text', description: 'glTF 파일 경로' },
    sharkScale: { control: { type: 'range', min: 0.05, max: 2, step: 0.05 } },
    isAutoRotate: { control: 'boolean' },
    hasControls: { control: 'boolean' },
    background: { control: 'color' },
    height: { control: { type: 'range', min: 320, max: 900, step: 20 } },
  },
};

export const Default = {
  args: {
    modelUrl: '/crysis_shark.glb',
    sharkScale: 0.3,
    tankSize: [6, 3, 2.4],
    isAutoRotate: false,
    hasControls: true,
    background: '#e8e8e3',
    height: 600,
  },
};

export const GalleryView = {
  args: {
    ...Default.args,
    background: '#ededea',
    isAutoRotate: false,
    height: 720,
  },
  parameters: {
    docs: {
      description: {
        story: '실제 갤러리 전시 뷰처럼 정적인 상태로 관람자가 직접 회전시키는 모드.',
      },
    },
  },
};

export const DarkRoom = {
  args: {
    ...Default.args,
    background: '#1a1a1a',
    isAutoRotate: false,
    height: 600,
  },
  parameters: {
    docs: {
      description: {
        story: '어두운 공간에서 포름알데히드 액체의 청록빛 굴절이 더 강조되는 연출.',
      },
    },
  },
};

export const Compact = {
  args: {
    ...Default.args,
    sharkScale: 0.25,
    height: 400,
    isAutoRotate: false,
  },
  parameters: {
    docs: {
      description: {
        story: '카드/사이드바 임베드용 컴팩트 사이즈.',
      },
    },
  },
};

/**
 * Hirst의 작품 설명과 함께 배치한 갤러리 카드 레이아웃 예시
 */
export const WithCaption = {
  render: (args) => (
    <Stack spacing={2} sx={{ p: 3, backgroundColor: '#fafaf7', minHeight: '100vh' }}>
      <Box>
        <Typography variant="overline" sx={{ color: 'grey.600', letterSpacing: 2 }}>
          DAMIEN HIRST · 1991 · NATURAL HISTORY SERIES
        </Typography>
        <Typography variant="h4" sx={{ fontWeight: 300, mt: 0.5 }}>
          The Physical Impossibility of Death
        </Typography>
        <Typography variant="h6" sx={{ fontWeight: 300, color: 'grey.700', fontStyle: 'italic' }}>
          in the Mind of Someone Living
        </Typography>
      </Box>
      <SharkVitrine {...args} />
      <Typography variant="body2" sx={{ color: 'grey.700', maxWidth: 720 }}>
        Tiger shark, glass, steel, 5% formaldehyde solution. 213 × 518 × 213 cm.
        Saatchi Collection / Steven A. Cohen.
      </Typography>
    </Stack>
  ),
  args: {
    ...Default.args,
    isAutoRotate: false,
    height: 560,
  },
};
