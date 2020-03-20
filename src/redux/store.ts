import { combineReducers, createStore, applyMiddleware } from 'redux';
import { createLogger } from 'redux-logger';

import { graph } from './reducers/graph';

const rootReducer = combineReducers({ graph });

const logger = createLogger({
  collapsed: true,
});

export type RootState = ReturnType<typeof rootReducer>;

export const store = createStore(rootReducer, applyMiddleware(logger));
