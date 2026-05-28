import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stage, useGLTF } from '@react-three/drei';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { formatFileSize } from './formatFileSize';

/**
 * GltfModel 내부 컴포넌트
 *
 * useGLTF로 .glb를 로드하여 <primitive>로 렌더한다.
 * Suspense 경계 안에서 사용되어야 한다.
 *
 * Props:
 * @param {string} src - .glb 경로 [Required]
 */
function GltfModel({ src }) {
  const { scene } = useGLTF(src);
  return <primitive object={ scene } />;
}

/**
 * ModelAssetCard 컴포넌트
 *
 * Storybook Asset 카탈로그용 3D 모델(.glb) 자산 카드.
 * 1:1 정사각형 캔버스에 OrbitControls로 회전 가능한 모델 프리뷰를 표시한다.
 *
 * 동작 방식:
 * 1. <Canvas>에 Stage(자동 라이팅/카메라 프레이밍) + OrbitControls 구성
 * 2. Suspense fallback으로 로딩 텍스트 표시
 * 3. 메타 영역에 label / usage / sourcePipeline / 사이즈 표시
 *
 * Props:
 * @param {string} src - .glb 경로 [Required]
 * @param {string} label - 자산 라벨 [Required]
 * @param {string} usage - 사용처 설명 [Optional]
 * @param {string} sourcePipeline - 생성 파이프라인 라벨 [Optional]
 * @param {number} fileSizeBytes - 파일 사이즈 (bytes) [Optional]
 *
 * Example usage:
 * <ModelAssetCard
 *   src="/models/hirst/shark.glb"
 *   label="Shark"
 *   usage="3D Hero"
 *   sourcePipeline="Meshy.ai"
 *   fileSizeBytes={ 8388608 }
 * />
 */
function ModelAssetCard({
  src,
  label,
  usage,
  sourcePipeline,
  fileSizeBytes,
}) {
  const sizeLabel = formatFileSize(fileSizeBytes);

  return (
    <Card
      variant="outlined"
      sx={ {
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        borderRadius: 1,
      } }
    >
      <Box
        sx={ {
          width: '100%',
          aspectRatio: '1 / 1',
          backgroundColor: 'grey.900',
          position: 'relative',
          overflow: 'hidden',
        } }
      >
        <Canvas
          camera={ { position: [0, 0, 4], fov: 45 } }
          dpr={ [1, 2] }
          style={ { width: '100%', height: '100%', display: 'block' } }
        >
          <ambientLight intensity={ 0.6 } />
          <directionalLight position={ [3, 5, 2] } intensity={ 1 } />
          <Suspense fallback={ null }>
            <Stage adjustCamera intensity={ 0.5 } environment={ null } shadows={ false }>
              <GltfModel src={ src } />
            </Stage>
          </Suspense>
          <OrbitControls enablePan={ false } enableZoom autoRotate={ false } />
        </Canvas>

        <Box
          sx={ {
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            pointerEvents: 'none',
          } }
        >
          <Suspense
            fallback={
              <Typography
                variant="caption"
                sx={ {
                  color: 'text.disabled',
                  fontFamily: 'monospace',
                } }
              >
                loading…
              </Typography>
            }
          >
            <Box sx={ { display: 'none' } } />
          </Suspense>
        </Box>
      </Box>

      <Stack spacing={ 0.75 } sx={ { p: 2 } }>
        <Stack direction="row" spacing={ 1 } alignItems="center" sx={ { minWidth: 0 } }>
          <Typography
            variant="subtitle2"
            sx={ {
              fontWeight: 600,
              flex: 1,
              minWidth: 0,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            } }
          >
            { label }
          </Typography>
          <Chip
            label="GLB"
            size="small"
            sx={ {
              height: 20,
              fontSize: '0.65rem',
              fontFamily: 'monospace',
            } }
          />
        </Stack>

        { usage && (
          <Typography variant="body2" color="text.secondary">
            { usage }
          </Typography>
        ) }

        { sourcePipeline && (
          <Typography
            variant="caption"
            sx={ {
              color: 'text.disabled',
              fontFamily: 'monospace',
            } }
          >
            { sourcePipeline }
          </Typography>
        ) }

        { sizeLabel && (
          <Typography
            variant="caption"
            sx={ {
              color: 'text.disabled',
              fontFamily: 'monospace',
            } }
          >
            { sizeLabel }
          </Typography>
        ) }
      </Stack>
    </Card>
  );
}

export { ModelAssetCard };
export default ModelAssetCard;
