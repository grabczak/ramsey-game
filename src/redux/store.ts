import { combineReducers, createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { createLogger } from 'redux-logger';

import { graph } from './reducers/graph';
import { options } from './reducers/options';

const rootReducer = combineReducers({ graph, options });

const logger = createLogger({
  collapsed: true,
});

export type TRootState = ReturnType<typeof rootReducer>;

export const store = createStore(rootReducer, applyMiddleware(thunk, logger));
