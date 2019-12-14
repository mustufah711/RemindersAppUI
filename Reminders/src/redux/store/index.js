import { createStore, compose, applyMiddleware } from 'redux'
import { default as thunk } from 'redux-thunk';
import rootReducer from '../reducers/'
import { createLogger } from 'redux-logger';


export default store = createStore(
    rootReducer,
    compose(
        applyMiddleware(thunk, createLogger())
    )
);