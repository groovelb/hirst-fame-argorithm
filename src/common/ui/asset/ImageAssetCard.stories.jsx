import Box from '@mui/material/Box';
import { ImageAssetCard } from './ImageAssetCard';

export default {
  title: 'Common/Asset/ImageAssetCard',
  component: ImageAssetCard,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    src: { control: 'text' },
    label: { control: 'text' },
    usage: { control: 'text' },
    sourcePipeline: { control: 'text' },
    format: { control: 'text' },
    fileSizeBytes: { control: { type: 'number', min: 0 } },
  },
};

/** 모든 메타가 채워진 기본 케이스 */
export const Default = {
  args: {
    src: '/images/hirst/spot-painting-001.jpg',
    label: 'Spot Painting 001',
    usage: 'Timeline thumbnail · Career stage 2',
    sourcePipeline: 'Wikimedia → sharp resize',
    format: 'JPG',
    fileSizeBytes: 245760,
  },
  render: (args) => (
    <Box sx={ { width: 320 } }>
      <ImageAssetCard { ...args } />
    </Box>
  ),
};

/** 메타 정보 일부 누락 케이스 */
export const WithoutMeta = {
  args: {
    src: '/images/hirst/portrait.jpg',
    label: 'Damien Hirst Portrait',
  },
  render: (args) => (
    <Box sx={ { width: 320 } }>
      <ImageAssetCard { ...args } />
    </Box>
  ),
};
