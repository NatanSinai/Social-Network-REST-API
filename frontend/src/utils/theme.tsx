import { CLOSE } from '@hebrew';
import CssBaseline from '@mui/material/CssBaseline';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { memo, type PropsWithChildren } from 'react';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#79C9C5' },
    secondary: { main: '#FFE2AF' },
    text: { primary: '#3F9AAE' },
  },
  typography: { fontFamily: 'Heebo' },
  direction: 'ltr',
  components: {
    MuiAlert: { defaultProps: { closeText: CLOSE } },
    MuiButton: { defaultProps: { variant: 'contained', color: 'secondary', style: { borderRadius: '2em' } } },
    MuiIconButton: { defaultProps: { style: { color: 'secondary.main' } } },
    MuiOutlinedInput: { styleOverrides: { root: { backgroundColor: '#FFFFFF', color: '#000000' } } },
  },
});

export type ThemeWrapperProps = PropsWithChildren;

const ThemeWrapper = memo<ThemeWrapperProps>(({ children }) => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      {children}
    </ThemeProvider>
  );
});

export default ThemeWrapper;
