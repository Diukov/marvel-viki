import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/app/App';
import './style/style.scss';

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root'),
);

//todo:
//if description is empty, show message 'There is no description for this character'
//if description is too long, show only first 210 symbols and add '...'
