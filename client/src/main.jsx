import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { Provider } from 'react-redux';
import { Toaster } from 'react-hot-toast';
import { persistor, store } from './store.js';
import { PersistGate } from 'redux-persist/integration/react';
import LoadingSpinner from './components/UI/LoadingSpinner.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <PersistGate loading={<LoadingSpinner />} persistor={persistor}>
        <Toaster position="top-right" />
        <App />
      </PersistGate>
    </Provider>
  </StrictMode>
);
