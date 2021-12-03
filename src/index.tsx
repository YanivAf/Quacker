import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import reportWebVitals from './reportWebVitals';
import './index.css';

import Quacker from './Quacker';
import FirebaseProvider from './utilities/firebase';

import axios from 'axios';
import swal from 'sweetalert';

axios.interceptors.response.use(
  response => response,
  (error) => {
    let text: string = '';
    if ((error.config.method === 'get') || (!error.response.status)) text = error.message;
    else text = error.response.data.error;
    swal({
      title: 'Oops!',
      text,
      icon: "warning"
    });
    return Promise.reject(error);
});

ReactDOM.render(
  <React.StrictMode>
    <FirebaseProvider>
      <Router>
        <Quacker />
      </Router>
    </FirebaseProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
reportWebVitals();
