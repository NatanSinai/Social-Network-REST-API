import { CLOSE } from '@hebrew';
import CssBaseline from '@mui/material/CssBaseline';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { memo, type PropsWithChildren } from 'react';

const secondaryMainColor = '#BA9F45';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#4560BA' },
    secondary: { main: secondaryMainColor },
    text: { primary: '#FFFFFF' },
  },
  typography: { fontFamily: 'Heebo' },
  direction: 'rtl',
  components: {
    MuiAlert: { defaultProps: { closeText: CLOSE } },
    MuiButton: {
      defaultProps: { variant: 'contained', color: 'secondary', style: { borderRadius: '2em', textTransform: 'none' } },
    },
    MuiIconButton: { defaultProps: { style: { color: secondaryMainColor } } },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          backgroundColor: '#FFFFFF',
          color: '#000000',
          '&.Mui-focused': {
            '& .MuiOutlinedInput-notchedOutline': { borderColor: secondaryMainColor },
          },
          '&:hover:not(.Mui-focused)': {
            '& .MuiOutlinedInput-notchedOutline': { border: `1.5px solid ${secondaryMainColor}` },
          },
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          '&.Mui-focused': { color: secondaryMainColor },
          '&.MuiInputLabel-shrink': { top: -5 },
          '&.MuiInputLabel-shrink:not(.Mui-focused)': { color: 'white' },
        },
      },
    },
    MuiDialog: { defaultProps: { disableRestoreFocus: true } },
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
