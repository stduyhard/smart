import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles/global.css';

export function bootstrapApp(container: Element) {
  ReactDOM.createRoot(container).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  );
}

const rootElement = document.getElementById('root');

if (rootElement) {
  bootstrapApp(rootElement);
}
