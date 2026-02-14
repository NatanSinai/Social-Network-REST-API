import { GoogleOAuthProvider } from '@react-oauth/google';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.tsx';
import { GOOGLE_CLIENT_ID } from './config.ts';
import './index.css';
import ThemeWrapper from './utils/theme.tsx';

const rootElement = document.getElementById('root');

if (!rootElement) throw Error('There is no root element!');

const reactRoot = createRoot(rootElement);
const googleClientId = `${GOOGLE_CLIENT_ID}.apps.googleusercontent.com`;

reactRoot.render(
  <BrowserRouter>
    <ThemeWrapper>
      <GoogleOAuthProvider clientId={googleClientId}>
        <App />
      </GoogleOAuthProvider>
    </ThemeWrapper>
  </BrowserRouter>,
);
