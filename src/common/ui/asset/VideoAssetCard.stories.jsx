import Box from '@mui/material/Box';
import { VideoAssetCard } from './VideoAssetCard';

export default {
  title: 'Common/Asset/VideoAssetCard',
  component: VideoAssetCard,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    src: { control: 'text' },
    label: { control: 'text' },
    usage: { control: 'text' },
    sourcePipeline: { control: 'text' },
    promptRef: { control: 'text' },
    fileSizeBytes: { control: { type: 'number', min: 0 } },
    isAutoPlay: { control: 'boolean' },
    onHoverPlay: { control: 'boolean' },
  },
};

/** hover 시 재생되는 기본 카드 */
export const Default = {
  args: {
    src: '/videos/hirst/hero-motion.mp4',
    label: 'Hirst Hero Motion',
    usage: 'Landing hero · loop background',
    sourcePipeline: 'Kling AI 1.6',
    promptRef: 'scripts/prompts/hero-motion.md',
    fileSizeBytes: 5242880,
    isAutoPlay: false,
    onHoverPlay: true,
  },
  render: (args) => (
    <Box sx={ { width: 360 } }>
      <VideoAssetCard { ...args } />
    </Box>
  ),
};

/** 자동 재생 (auto-play loop) */
export const AutoPlay = {
  args: {
    src: '/videos/hirst/hero-motion.mp4',
    label: 'Hirst Hero Motion (Auto)',
    usage: 'Landing hero · loop background',
    sourcePipeline: 'Kling AI 1.6',
    fileSizeBytes: 5242880,
    isAutoPlay: true,
  },
  render: (args) => (
    <Box sx={ { width: 360 } }>
      <VideoAssetCard { ...args } />
    </Box>
  ),
};
