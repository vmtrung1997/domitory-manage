import React from 'react';
import ReactDOM from 'react-dom';

import App from './app/App';
import * as serviceWorker from './serviceWorker';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import './app/style.css'
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import rootReducer from './app/reducers/index';
//initialState
const initialState = []
//Create store
const store = createStore(rootReducer, initialState);

ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>
    , document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
