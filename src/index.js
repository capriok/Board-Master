/*eslint no-extend-native: "off"*/
import React from 'react';
import ReactDOM from 'react-dom';
import App from './app';
import './index.scss';

function Index() {
  return <App />
}

ReactDOM.render(<Index />, document.getElementById('root'))

String.prototype.capitalize = function () {
  return this.charAt(0).toUpperCase() + this.slice(1);
}