import {
  ADD_EDGE,
  SET_GRAPH_SIZE,
  SET_TARGET_CLIQUE_SIZE,
  START_GAME,
  END_GAME,
} from '../constants/actions';

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

export type TAddEdge = {
  type: typeof ADD_EDGE;
  payload: {
    source: string;
    target: string;
    affiliation: 'player' | 'computer';
  };
};

export type TStartGame = {
  type: typeof START_GAME;
};

export type TEndGame = {
  type: typeof END_GAME;
};

export type TGameAction = TStartGame | TEndGame | TAddEdge;
export type TGraphAction = TSetGraphSize | TAddEdge | TEndGame;
export type TOptionsAction = TSetGraphSize | TSetTargetCliqueSize;
