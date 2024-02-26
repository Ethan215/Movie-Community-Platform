import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import './Sign.css';

import App from './App';
import Sign from './Sign';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
    <Sign />
  </React.StrictMode>
);
