import { Suspense, useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { Grid, OrbitControls } from '@react-three/drei';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { Box as BoxIcon, CircleDot, Eye, EyeOff, Fish, Grid3X3, Layers, Ruler } from 'lucide-react';

import { CameraRig } from './CameraRig';
import { ReferencePlanes } from './ReferencePlanes';
import { TigerSharkModel } from './TigerSharkModel';
import { CHECK_RATIOS } from './geometry/galeocerdoCuvierRatios';

const VIEW_OPTIONS = [
  { id: 'inspect', label: '3D' },
  { id: 'side', label: 'Side' },
  { id: 'dorsal', label: 'Top' },
  { id: 'ventral', label: 'Bottom' },
  { id: 'front', label: 'Front' },
  { id: 'rear', label: 'Rear' },
];

export function TigerSharkModelingLab() {
  const controlsRef = useRef(null);
  const [view, setView] = useState('inspect');
  const [showReferences, setShowReferences] = useState(true);
  const [showLandmarks, setShowLandmarks] = useState(true);
  const [showWireframe, setShowWireframe] = useState(false);
  const [showTeeth, setShowTeeth] = useState(true);
  const [showPattern, setShowPattern] = useState(false);

  return (
    <Box
      sx={{
        position: 'relative',
        width: '100%',
        height: '100dvh',
        minHeight: 560,
        overflow: 'hidden',
        bgcolor: '#0a0b09',
      }}
    >
      <Canvas
        orthographic
        shadows={ false }
        camera={{ position: [6.8, 3.2, 6.2], zoom: 72, near: 0.1, far: 100 }}
        gl={{ antialias: true, alpha: false }}
        style={{ width: '100%', height: '100%' }}
      >
        <color attach="background" args={ ['#0b0c0a'] } />
        <ambientLight intensity={ 1.45 } />
        <directionalLight position={ [4, 7, 5] } intensity={ 1.65 } />
        <directionalLight position={ [-5, -3, -4] } intensity={ 0.55 } />

        <CameraRig view={ view } controlsRef={ controlsRef } />
        <Suspense fallback={ null }>
          <ReferencePlanes activeView={ view } visible={ showReferences } />
        </Suspense>

        <TigerSharkModel
          showLandmarks={ showLandmarks }
          showWireframe={ showWireframe }
          showTeeth={ showTeeth }
          showPattern={ showPattern }
        />

        <Grid
          position={ [0, -1.12, 0] }
          args={ [12, 3.5] }
          cellSize={ 0.5 }
          cellThickness={ 0.45 }
          cellColor="#26312c"
          sectionSize={ 2 }
          sectionThickness={ 0.75 }
          sectionColor="#46544e"
          fadeDistance={ 12 }
          fadeStrength={ 1.5 }
        />

        <OrbitControls
          ref={ controlsRef }
          makeDefault
          enableDamping
          enableRotate={ view === 'inspect' }
          enablePan
          enableZoom
          minZoom={ 28 }
          maxZoom={ 260 }
        />
      </Canvas>

      <SceneToolbar
        view={ view }
        setView={ setView }
        showReferences={ showReferences }
        setShowReferences={ setShowReferences }
        showLandmarks={ showLandmarks }
        setShowLandmarks={ setShowLandmarks }
        showWireframe={ showWireframe }
        setShowWireframe={ setShowWireframe }
        showTeeth={ showTeeth }
        setShowTeeth={ setShowTeeth }
        showPattern={ showPattern }
        setShowPattern={ setShowPattern }
      />
      <RatioStrip />
    </Box>
  );
}

function SceneToolbar({
  view,
  setView,
  showReferences,
  setShowReferences,
  showLandmarks,
  setShowLandmarks,
  showWireframe,
  setShowWireframe,
  showTeeth,
  setShowTeeth,
  showPattern,
  setShowPattern,
}) {
  return (
    <Stack
      direction={{ xs: 'column', lg: 'row' }}
      spacing={ 1 }
      sx={{
        position: 'absolute',
        left: { xs: 12, md: 18 },
        top: { xs: 12, md: 18 },
        right: { xs: 12, lg: 'auto' },
        zIndex: 5,
        alignItems: { xs: 'stretch', lg: 'center' },
      }}
    >
      <Stack
        direction="row"
        spacing={ 1 }
        alignItems="center"
        sx={{
          minHeight: 42,
          px: 1.25,
          py: 0.75,
          borderRadius: 2,
          bgcolor: 'rgba(9, 11, 9, 0.76)',
          border: '1px solid rgba(232, 238, 225, 0.18)',
          backdropFilter: 'blur(14px)',
        }}
      >
        <Fish size={ 18 } strokeWidth={ 1.9 } />
        <Typography
          variant="body2"
          sx={{
            fontWeight: 700,
            letterSpacing: 0,
            whiteSpace: 'nowrap',
            color: 'rgba(245, 246, 238, 0.94)',
          }}
        >
          Galeocerdo cuvier
        </Typography>
      </Stack>

      <ButtonGroup
        size="small"
        variant="outlined"
        sx={{
          bgcolor: 'rgba(9, 11, 9, 0.76)',
          borderRadius: 2,
          backdropFilter: 'blur(14px)',
          '& .MuiButton-root': {
            minWidth: 0,
            px: { xs: 0.9, md: 1.25 },
            color: 'rgba(245,246,238,0.82)',
            borderColor: 'rgba(232,238,225,0.2)',
            textTransform: 'none',
            letterSpacing: 0,
          },
        }}
      >
        { VIEW_OPTIONS.map((option) => (
          <Button
            key={ option.id }
            onClick={() => setView(option.id)}
            startIcon={ option.id === 'inspect' ? <BoxIcon size={ 15 } /> : null }
            sx={{
              bgcolor: view === option.id ? 'rgba(196, 210, 177, 0.2)' : 'transparent',
            }}
          >
            { option.label }
          </Button>
        )) }
      </ButtonGroup>

      <Stack
        direction="row"
        spacing={ 0.5 }
        sx={{
          alignSelf: { xs: 'flex-start', lg: 'auto' },
          p: 0.5,
          borderRadius: 2,
          bgcolor: 'rgba(9, 11, 9, 0.76)',
          border: '1px solid rgba(232, 238, 225, 0.18)',
          backdropFilter: 'blur(14px)',
        }}
      >
        <ToolToggle
          title="Reference planes"
          active={ showReferences }
          onClick={() => setShowReferences((current) => !current)}
          icon={ showReferences ? <Eye size={ 17 } /> : <EyeOff size={ 17 } /> }
        />
        <ToolToggle
          title="Landmarks"
          active={ showLandmarks }
          onClick={() => setShowLandmarks((current) => !current)}
          icon={ <Ruler size={ 17 } /> }
        />
        <ToolToggle
          title="Wireframe"
          active={ showWireframe }
          onClick={() => setShowWireframe((current) => !current)}
          icon={ <Grid3X3 size={ 17 } /> }
        />
        <ToolToggle
          title="Teeth"
          active={ showTeeth }
          onClick={() => setShowTeeth((current) => !current)}
          icon={ <CircleDot size={ 17 } /> }
        />
        <ToolToggle
          title="Adult band guides"
          active={ showPattern }
          onClick={() => setShowPattern((current) => !current)}
          icon={ <Layers size={ 17 } /> }
        />
      </Stack>
    </Stack>
  );
}

function ToolToggle({ title, active, onClick, icon }) {
  return (
    <Tooltip title={ title }>
      <IconButton
        size="small"
        onClick={ onClick }
        aria-label={ title }
        sx={{
          width: 32,
          height: 32,
          borderRadius: 1.5,
          color: active ? '#f3f5e8' : 'rgba(245, 246, 238, 0.58)',
          bgcolor: active ? 'rgba(196, 210, 177, 0.18)' : 'transparent',
          '&:hover': {
            bgcolor: 'rgba(196, 210, 177, 0.24)',
          },
        }}
      >
        { icon }
      </IconButton>
    </Tooltip>
  );
}

function RatioStrip() {
  return (
    <Box
      sx={{
        position: 'absolute',
        left: { md: 18 },
        right: { xs: 12, md: 'auto' },
        bottom: { xs: 12, md: 18 },
        zIndex: 4,
        display: { xs: 'none', md: 'block' },
        width: 420,
        maxWidth: 'calc(100vw - 36px)',
        borderRadius: 2,
        bgcolor: 'rgba(9, 11, 9, 0.68)',
        border: '1px solid rgba(232, 238, 225, 0.16)',
        backdropFilter: 'blur(14px)',
        overflow: 'hidden',
      }}
    >
      <Stack direction="row" alignItems="center" spacing={ 1.1 } sx={{ px: 1.25, py: 1 }}>
        <Ruler size={ 16 } />
        <Typography variant="caption" sx={{ fontWeight: 700, color: 'rgba(245,246,238,0.88)', letterSpacing: 0 }}>
          TL ratio checkpoints
        </Typography>
      </Stack>
      <Divider sx={{ borderColor: 'rgba(232,238,225,0.12)' }} />
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
          gap: 0,
        }}
      >
        { CHECK_RATIOS.map(([label, value]) => (
          <Stack
            key={ label }
            direction="row"
            justifyContent="space-between"
            spacing={ 1 }
            sx={{
              px: 1.25,
              py: 0.75,
              minWidth: 0,
              borderTop: '1px solid rgba(232,238,225,0.08)',
              '&:nth-of-type(odd)': {
                borderRight: '1px solid rgba(232,238,225,0.08)',
              },
            }}
          >
            <Typography variant="caption" sx={{ color: 'rgba(245,246,238,0.58)', letterSpacing: 0 }}>
              { label }
            </Typography>
            <Typography variant="caption" sx={{ color: 'rgba(245,246,238,0.88)', fontWeight: 700, letterSpacing: 0 }}>
              { value }
            </Typography>
          </Stack>
        )) }
      </Box>
    </Box>
  );
}
