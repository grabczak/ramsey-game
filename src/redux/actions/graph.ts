import { CREATE_GRAPH } from '../../constants/actions';

export type SetSizeAction = {
  type: typeof CREATE_GRAPH;
  payload: {
    size: number;
  };
};

export const setSize = (size: number): SetSizeAction => {
  return {
    type: CREATE_GRAPH,
    payload: { size },
  };
};
