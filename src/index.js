import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';
import Console from './components/Console';
import allReducers from './reducers';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import './styles/index.css';
import * as serviceWorker from './serviceWorker';

const version = '0.1';
const devMode = true;

const store = createStore(
  allReducers,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

ReactDOM.render(
  <Provider store={ store }>
    <React.StrictMode>
      <App />
      <Console version={ version } devMode={ devMode } />
    </React.StrictMode>
  </Provider>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
