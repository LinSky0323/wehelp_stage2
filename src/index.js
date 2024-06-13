import React from 'react';
import ReactDOM from 'react-dom/client';
// import App from './App';
//導入
import { Provider } from 'react-redux';
import store from "./store"
import { RouterProvider } from 'react-router-dom';
import router from './router';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Provider store={store}>
    <RouterProvider router={router}/>
  </Provider>
);


