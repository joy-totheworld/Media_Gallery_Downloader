import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createTheme, ThemeProvider } from '@mui/material/styles';
import App from '@/app/index'
import { VideoProvider } from "@/context/VideoContext.tsx";
import ResponsiveSpacer from "@/components/ResponsiveSpacer";

const theme = createTheme({
  palette: {
    primary: {
      main: '#4E8098',
    },
    secondary: {
      main: '#90C2E7',
    },
    background: {
      default: '#FCF7F8',
      paper: '#E9E4E4',
    }
  },
});

createRoot(document.getElementById('root')!).render(
  <ThemeProvider theme={theme}>
    <StrictMode>
      <VideoProvider>
        <ResponsiveSpacer smaller='55px' larger='70px' />
        <App />
        <ResponsiveSpacer smaller='45px' larger='50px' />
      </VideoProvider>
    </StrictMode>
  </ThemeProvider>
)
