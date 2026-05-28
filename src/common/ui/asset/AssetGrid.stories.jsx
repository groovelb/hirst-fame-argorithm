import Box from '@mui/material/Box';
import { AssetGrid } from './AssetGrid';

const MIXED_ITEMS = [
  {
    id: 'img-001',
    kind: 'image',
    src: '/images/hirst/spot-painting-001.jpg',
    label: 'Spot Painting 001',
    usage: 'Timeline thumbnail',
    sourcePipeline: 'Wikimedia → sharp',
    format: 'JPG',
    fileSizeBytes: 245760,
  },
  {
    id: 'vid-001',
    kind: 'video',
    src: '/videos/hirst/hero-motion.mp4',
    label: 'Hirst Hero Motion',
    usage: 'Landing hero',
    sourcePipeline: 'Kling AI 1.6',
    promptRef: 'scripts/prompts/hero-motion.md',
    fileSizeBytes: 5242880,
  },
  {
    id: 'mdl-001',
    kind: 'model',
    src: '/models/hirst/shark.glb',
    label: 'Shark',
    usage: '3D hero',
    sourcePipeline: 'Meshy.ai',
    fileSizeBytes: 8388608,
  },
  {
    id: 'img-002',
    kind: 'image',
    src: '/images/hirst/butterfly.jpg',
    label: 'Butterfly Kaleidoscope',
    usage: 'Career stage 3',
    sourcePipeline: 'Wikimedia → sharp',
    format: 'JPG',
    fileSizeBytes: 312000,
  },
  {
    id: 'vid-002',
    kind: 'video',
    src: '/videos/hirst/spin-motion.mp4',
    label: 'Spin Painting Motion',
    usage: 'Section transition',
    sourcePipeline: 'Kling AI 1.6',
    promptRef: 'scripts/prompts/spin-motion.md',
    fileSizeBytes: 3145728,
  },
  {
    id: 'mdl-002',
    kind: 'model',
    src: '/models/hirst/skull.glb',
    label: 'For the Love of God',
    usage: 'Detail scene',
    sourcePipeline: 'Meshy.ai',
    fileSizeBytes: 6291456,
  },
];

export default {
  title: 'Common/Asset/AssetGrid',
  component: AssetGrid,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
};

/** 3종 타입 혼합 6개 자동 분기 */
export const Mixed = {
  args: {
    items: MIXED_ITEMS,
    columns: { xs: 12, sm: 6, md: 4, lg: 3 },
    kind: 'auto',
  },
  render: (args) => (
    <Box sx={ { p: 2 } }>
      <AssetGrid { ...args } />
    </Box>
  ),
};

/** 이미지만 (kind 강제) */
export const ImagesOnly = {
  args: {
    items: MIXED_ITEMS.filter((item) => item.kind === 'image'),
    columns: { xs: 12, sm: 6, md: 4 },
    kind: 'image',
  },
  render: (args) => (
    <Box sx={ { p: 2 } }>
      <AssetGrid { ...args } />
    </Box>
  ),
};
