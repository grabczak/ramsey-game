import {
  SET_GRAPH_SIZE,
  SET_TARGET_CLIQUE_SIZE,
} from '../../constants/actions';
import { TOptionsAction } from '../../typings/actions';
import { TOptionsState } from '../../typings/state';

const initialState = {
  graphSize: 6,
  targetCliqueSize: 3,
};

export function options(
  state: TOptionsState = initialState,
  action: TOptionsAction,
) {
  switch (action.type) {
    case SET_GRAPH_SIZE:
      return {
        ...state,
        graphSize: action.payload.size,
        targetCliqueSize: Math.min(state.targetCliqueSize, action.payload.size),
      };
    case SET_TARGET_CLIQUE_SIZE:
      return {
        ...state,
        targetCliqueSize: action.payload.size,
      };
    default:
      return state;
  }
}
