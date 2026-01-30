import { CLOSE } from '@hebrew';
import CssBaseline from '@mui/material/CssBaseline';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { memo, type PropsWithChildren } from 'react';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#4560BA' },
    secondary: { main: '#BA9F45' },
    text: { primary: '#FFFFFF' },
  },
  typography: { fontFamily: 'Heebo' },
  direction: 'rtl',
  components: {
    MuiAlert: { defaultProps: { closeText: CLOSE } },
    MuiButton: {
      defaultProps: { variant: 'contained', color: 'secondary', style: { borderRadius: '2em', textTransform: 'none' } },
    },
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
