import { createTheme } from '@mui/material/styles';

export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#1976d2' }, // Синий
    secondary: { main: '#ffa726' }, // Оранжевый
    background: {
      default: '#121212',
      paper: '#1e1e1e',
    },
  },
});
