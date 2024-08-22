import React from 'react';
import ReactDOM from 'react-dom/client';

import './index.css';
import 'react-toastify/dist/ReactToastify.css';
import App from './App';
import {ContextProvider} from './contexts/ContextProvider';
import {ToastContainer} from "react-toastify";
import {Provider} from "react-redux";
import store from "./redux/store";

const root = ReactDOM.createRoot(document.getElementById('root'));

console.error = (message) => {
  if (message.startsWith('WebSocket connection to')) {
    return;
  }
  console.warn(message);
};

root.render(
  <React.StrictMode>
    <ContextProvider>
      <Provider store={store}>
        <App/>
        <ToastContainer/>
      </Provider>
    </ContextProvider>
  </React.StrictMode>
);
