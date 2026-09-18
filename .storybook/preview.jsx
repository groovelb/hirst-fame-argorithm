import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import { themes } from 'storybook/theming';

import { defaultTheme } from '../src/styles/themes';
import { LocaleProvider } from '../src/i18n/LocaleProvider';

// Google Fonts 로드 (Material Symbols + 기본 폰트)
const googleFonts = [
  // Material Symbols
  'Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200',
  'Material+Symbols+Rounded:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200',
  'Material+Symbols+Sharp:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200',
  // Default Theme Font
  'Outfit:wght@300;400;500;600;700;800;900',
];

googleFonts.forEach((font) => {
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = `https://fonts.googleapis.com/css2?family=${font}&display=swap`;
  document.head.appendChild(link);
});

/** @type { import('@storybook/react-vite').Preview } */
const preview = {
  parameters: {
    // 제품 테마가 다크(흰 글자)라 문서 페이지도 다크로 맞춘다. 밝은 docs 테마 위에서는 흰 글자가 묻힌다
    docs: { theme: themes.dark },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    a11y: {
      test: 'todo',
    },
    options: {
      storySort: {
        order: [
          'Overview',
          'Style',
          ['Overview', 'Colors', 'Typography', 'Icons', 'Spacing', 'Component Tokens'],
          'Component',
          [
            '1. Typography',
            '2. Container',
            '3. Card',
            '4. Media',
            '5. Data Display',
            '6. In-page Navigation',
            '7. Input & Control',
            '8. Layout',
            '9. Overlay & Feedback',
            '10. Navigation',
          ],
          'Interactive',
          ['12. Scroll'],
          'Common',
          'Template',
          'Test Data',
        ],
        method: 'alphabetical',
      },
    },
  },
  decorators: [
    (Story, context) => {
      const isFullscreen = context.parameters?.layout === 'fullscreen';
      return (
        <ThemeProvider theme={defaultTheme}>
          <CssBaseline />
          {/* 타임라인·브리지 컴포넌트가 useLocale 을 쓰므로 스토리 전역에 로케일을 공급한다 */}
          <LocaleProvider>
            {/* 테마 background.default 는 영상 매칭용 흰색이라 흰 글자와 충돌한다. 캔버스 표면은 paper(#141414) */}
            <Box sx={ { bgcolor: 'background.paper', color: 'text.primary', minHeight: '100vh', width: '100%', pt: isFullscreen ? 0 : 5 } }>
              <Story />
            </Box>
          </LocaleProvider>
        </ThemeProvider>
      );
    },
  ],
};

export default preview;
