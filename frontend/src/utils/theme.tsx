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
          '&.Mui-focused:not(.Mui-error)': {
            '& .MuiOutlinedInput-notchedOutline': { borderColor: secondaryMainColor },
          },
          '&:hover:not(.Mui-focused):not(.Mui-error)': {
            '& .MuiOutlinedInput-notchedOutline': { border: `1.5px solid ${secondaryMainColor}` },
          },
        },
      },
    },
    MuiFormHelperText: {
      styleOverrides: {
        root: { position: 'absolute', bottom: '-1.6em', margin: 0, marginLeft: '1em' },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          '&.Mui-focused:not(.Mui-error)': { color: secondaryMainColor },
          '&.MuiInputLabel-shrink': { top: -5 },
          '&.MuiInputLabel-shrink:not(.Mui-focused):not(.Mui-error)': { color: 'white' },
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
