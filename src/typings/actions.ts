import { Action } from 'redux';
import { ThunkAction } from 'redux-thunk';

import {
  SET_GRAPH_SIZE,
  SET_TARGET_CLIQUE_SIZE,
  START_GAME,
  END_GAME,
  NEXT_MOVE,
} from '../constants/actions';
import { TEdge, TRootState } from './state';

export type TThunkResult<R> = ThunkAction<R, TRootState, null, Action>;

export type TSetGraphSize = {
  type: typeof SET_GRAPH_SIZE;
  payload: {
    size: number;
  };
};

export type TSetTargetCliqueSize = {
  type: typeof SET_TARGET_CLIQUE_SIZE;
  payload: {
    size: number;
  };
};

export type TStartGame = {
  type: typeof START_GAME;
};

export type TEndGame = {
  type: typeof END_GAME;
  payload: {
    winner: 'player' | 'computer' | 'draw' | null;
  };
};

export type TNextMove = {
  type: typeof NEXT_MOVE;
  payload: {
    edge: TEdge;
  };
};

export type TGameAction =
  | TSetGraphSize
  | TSetTargetCliqueSize
  | TStartGame
  | TEndGame
  | TNextMove;
