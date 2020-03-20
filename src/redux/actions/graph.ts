import { ADD_EDGE, CREATE_GRAPH } from '../../constants/actions';

export type CreateGraph = {
  type: typeof CREATE_GRAPH;
  payload: {
    size: number;
  };
};

export const createGraph = (size: number): CreateGraph => {
  return {
    type: CREATE_GRAPH,
    payload: { size },
  };
};

export type AddEdge = {
  type: typeof ADD_EDGE;
  payload: {
    source: string;
    target: string;
  };
};

export const addEdge = (source: string, target: string): AddEdge => {
  return {
    type: ADD_EDGE,
    payload: { source, target },
  };
};
