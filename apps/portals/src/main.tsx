import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { createMockCredentialEngine } from '@did-workers/credential-engine';
import { CredentialEngineProvider } from './context/CredentialEngineContext';
import './index.css';

const engine = createMockCredentialEngine();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <CredentialEngineProvider engine={engine}>
        <App />
      </CredentialEngineProvider>
    </BrowserRouter>
  </React.StrictMode>
);