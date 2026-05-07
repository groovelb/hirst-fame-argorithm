import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

import { defaultTheme as theme } from './styles/themes';
import { LocaleProvider } from './i18n';
import { LanguageToggle } from './components/navigation/LanguageToggle';
import { RothkoTimeline as HirstTimeline } from './components/timeline';
import worksData from './data/hirst/hirst_works.json';
import eventsData from './data/hirst/hirst_events.json';
import bioData from './data/hirst/hirst-bio-specimen-data.js';

function App() {
  return (
    <LocaleProvider>
      <ThemeProvider theme={ theme }>
        <CssBaseline />
        <LanguageToggle />
        <HirstTimeline
          worksData={ worksData }
          eventsData={ eventsData }
          bioData={ bioData }
        />
      </ThemeProvider>
    </LocaleProvider>
  );
}

export default App;
