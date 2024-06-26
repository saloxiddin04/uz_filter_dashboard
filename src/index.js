import React from 'react';
import ReactDOM from 'react-dom';

import './index.css';
import 'react-toastify/dist/ReactToastify.css';
import App from './App';
import {ContextProvider} from './contexts/ContextProvider';
import {ToastContainer} from "react-toastify";
import {Provider} from "react-redux";
import store from "./redux/store";

ReactDOM.render(
  <React.StrictMode>
    <ContextProvider>
      <Provider store={store}>
        <App/>
        <ToastContainer/>
      </Provider>
    </ContextProvider>
  </React.StrictMode>,
  document.getElementById('root'),
);
