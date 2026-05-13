import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

import { defaultTheme as theme } from './styles/themes';
import { LocaleProvider } from './i18n';
import { LandingPage } from './components/templates/LandingPage.jsx';
import worksData from './data/hirst/hirst_works.json';
import eventsData from './data/hirst/hirst_events.json';
import bioData from './data/hirst/hirst-bio-specimen-data.js';
import trendData from '../data/hirst-trend-data.json';

function App() {
  return (
    <LocaleProvider>
      <ThemeProvider theme={ theme }>
        <CssBaseline />
        <LandingPage
          worksData={ worksData }
          eventsData={ eventsData }
          bioData={ bioData }
          trendData={ trendData }
        />
      </ThemeProvider>
    </LocaleProvider>
  );
}

export default App;
