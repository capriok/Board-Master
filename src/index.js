import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './App.scss';
import './Index.scss';

function Index() {
  return <App />
}


ReactDOM.render(<Index />, document.getElementById('root'))