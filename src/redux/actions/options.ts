import {
  SET_GRAPH_SIZE,
  SET_TARGET_CLIQUE_SIZE,
} from '../../constants/actions';

export const setGraphSize = (size: number) => {
  return {
    type: SET_GRAPH_SIZE,
    payload: { size },
  };
};

export const setTargetCliqueSize = (size: number) => {
  return {
    type: SET_TARGET_CLIQUE_SIZE,
    payload: { size },
  };
};
