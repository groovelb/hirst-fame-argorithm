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

### 구성 요소
- **상어 모델**: \`/public/crysis_shark.glb\` (glTF 2.0 binary)
- **유리 비트린**: \`MeshPhysicalMaterial\` + \`transmission\` + \`ior 1.33\`로 포름알데히드 굴절 효과
- **스틸 프레임**: 12개 엣지 실린더로 Hirst의 시그니처 케이스 재현
- **부유 애니메이션**: 시간 기반 sin 함수로 미세한 떠있는 움직임
- **OrbitControls**: 드래그로 회전, 스크롤로 줌

### 기술 스택
- glTF 2.0 (\`.glb\`) — Three.js 공식 권장 포맷
- \`useGLTF\` + \`useGLTF.preload\` 로 지연 로딩 최적화
- \`<Suspense>\` + Loader UI

### Props
- \`modelUrl\`: glTF 경로
- \`sharkScale\`: 상어 모델 스케일
- \`tankSize\`: \`[w, h, d]\` 탱크 크기
- \`isAutoRotate\`: 카메라 자동 회전
- \`hasControls\`: OrbitControls 활성화
- \`background\`: 갤러리 배경색
- \`height\`: 캔버스 높이
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
    modelUrl: '/shark_hirst_pose.glb',
    sharkScale: 0.3,
    tankSize: [6, 3, 2.4],
    isAutoRotate: true,
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
    isAutoRotate: true,
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
    isAutoRotate: true,
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
    isAutoRotate: true,
    height: 560,
  },
};
