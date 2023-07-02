import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { addInterceptors } from './axios';
import { persistor, store } from './app/store';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import DialogsProvider from './components/Dialogs/DialogsProvider';
import { CustomProvider } from 'rsuite';
import ruRU from 'rsuite/locales/ru_RU';

addInterceptors(store);

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <Provider store={store}>
    <PersistGate persistor={persistor}>
      <BrowserRouter>
        <DialogsProvider>
          <CustomProvider locale={ruRU}>
            <App />
          </CustomProvider>
        </DialogsProvider>
      </BrowserRouter>
    </PersistGate>
  </Provider>,
);
