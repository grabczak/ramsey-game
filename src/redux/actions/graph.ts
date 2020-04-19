import { ADD_EDGE, CREATE_GRAPH } from '../../constants/actions';

const jsnx = require('jsnetworkx');

export type TCreateGraph = {
  type: typeof CREATE_GRAPH;
  payload: {
    size: number;
  };
};

export const createGraph = (size: number) => {
  return {
    type: CREATE_GRAPH,
    payload: { size },
  };
};

export type TAddEdge = {
  type: typeof ADD_EDGE;
  payload: {
    source: string;
    target: string;
    affiliation: 'PLAYER' | 'COMPUTER';
  };
};

export const addEdge = (
  source: string,
  target: string,
  affiliation: 'PLAYER' | 'COMPUTER' = 'PLAYER',
) => {
  return {
    type: ADD_EDGE,
    payload: { source, target, affiliation },
  };
};
