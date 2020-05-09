import { combineReducers, createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { createLogger } from 'redux-logger';

import { game } from './reducers/game';

const rootReducer = combineReducers({ game });

const logger = createLogger({
  collapsed: true,
});

export const store = createStore(rootReducer, applyMiddleware(thunk, logger));
