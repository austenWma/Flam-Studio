import React from 'react'
import {render} from 'react-dom'
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import promise from 'redux-promise';

import App from './components/App.jsx'

render(
    <div>
        <App />
    </div>, document.getElementById('app')
);