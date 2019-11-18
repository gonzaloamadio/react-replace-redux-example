import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';

import './index.css';
import App from './App';
import configureProductsStore from './hooks-store/products-store';
import configureCounterStore from './hooks-store/counter-store';

// This store is ready to use. This will handle the initialization.
configureProductsStore();
configureCounterStore();

ReactDOM.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
  document.getElementById('root')
);
