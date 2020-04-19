import { ADD_EDGE, CREATE_GRAPH } from '../constants/actions';

export type TAddEdge = {
  type: typeof ADD_EDGE;
  payload: {
    source: string;
    target: string;
    affiliation: 'player' | 'computer';
  };
};

export type TCreateGraph = {
  type: typeof CREATE_GRAPH;
  payload: {
    size: number;
  };
};

export type TGraphAction = TCreateGraph | TAddEdge;
