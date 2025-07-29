import { createRoot } from 'react-dom/client';
import { ThemeProvider } from '@mui/material/styles';
import { darkTheme } from './styles/theme';
import App from './App';

// Безопасное получение корневого элемента
const container = document.getElementById('root');
if (!container) throw new Error('Failed to find the root element');

createRoot(container).render(
  <ThemeProvider theme={darkTheme}>
    <App />
  </ThemeProvider>
);
