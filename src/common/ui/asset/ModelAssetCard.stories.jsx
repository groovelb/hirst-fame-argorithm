import Box from '@mui/material/Box';
import { ModelAssetCard } from './ModelAssetCard';

export default {
  title: 'Common/Asset/ModelAssetCard',
  component: ModelAssetCard,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    src: { control: 'text' },
    label: { control: 'text' },
    usage: { control: 'text' },
    sourcePipeline: { control: 'text' },
    fileSizeBytes: { control: { type: 'number', min: 0 } },
  },
};

/** 모든 메타가 채워진 기본 케이스 */
export const Default = {
  args: {
    src: '/models/hirst/shark.glb',
    label: 'Shark (Physical Impossibility)',
    usage: '3D hero · interactive scene',
    sourcePipeline: 'Meshy.ai → glb compress',
    fileSizeBytes: 8388608,
  },
  render: (args) => (
    <Box sx={ { width: 320 } }>
      <ModelAssetCard { ...args } />
    </Box>
  ),
};

/** 메타 일부 누락 */
export const WithoutMeta = {
  args: {
    src: '/models/hirst/skull.glb',
    label: 'Skull',
  },
  render: (args) => (
    <Box sx={ { width: 320 } }>
      <ModelAssetCard { ...args } />
    </Box>
  ),
};
