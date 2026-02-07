import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.tsx';
import './index.css';
import { AuthProvider } from './utils/auth/AuthProvider.ts';
import ThemeWrapper from './utils/theme.tsx';

const rootElement = document.getElementById('root');

if (!rootElement) throw Error('There is no root element!');

const reactRoot = createRoot(rootElement);

reactRoot.render(
  <BrowserRouter>
    <ThemeWrapper>
      <AuthProvider>
        <App />
      </AuthProvider>
    </ThemeWrapper>
  </BrowserRouter>,
);
