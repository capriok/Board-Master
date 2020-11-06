import React from 'react';
import ReactDOM from 'react-dom';
import App from './app';
import './index.scss';

function Index() {
  return <App />
}

ReactDOM.render(<Index />, document.getElementById('root'))