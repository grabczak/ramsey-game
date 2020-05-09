import {
  SET_GRAPH_SIZE,
  SET_TARGET_CLIQUE_SIZE,
  START_GAME,
  END_GAME,
  NEXT_MOVE,
} from '../../constants/actions';
import { TGameAction } from '../../typings/actions';
import { TGameState } from '../../typings/state';

const createGraph = (size: number) => {
  const nodes = [];
  const edges = [];

  for (let i = 0; i < size; i++) {
    nodes.push({ id: i });
  }

  for (let i = 0; i < size; i++) {
    for (let j = i + 1; j < size; j++) {
      edges.push({
        source: nodes[i].id,
        target: nodes[j].id,
        team: null,
      });
    }
  }

  return {
    nodes,
    edges,
  };
};

const initialState = {
  ...createGraph(6),
  targetCliqueSize: 3,
  isGameRunning: false,
  whoIsMoving: 'player' as const,
  winner: null,
};

export const game = (state: TGameState = initialState, action: TGameAction) => {
  switch (action.type) {
    case SET_GRAPH_SIZE:
      return {
        ...state,
        ...createGraph(action.payload.size),
        targetCliqueSize: Math.min(state.targetCliqueSize, action.payload.size),
        whoIsMoving: 'player',
        winner: null,
      };
    case SET_TARGET_CLIQUE_SIZE:
      return {
        ...state,
        targetCliqueSize: action.payload.size,
        whoIsMoving: 'player',
        winner: null,
      };
    case START_GAME:
      return {
        ...state,
        edges: state.edges.map((edge) => ({
          ...edge,
          team: null,
        })),
        isGameRunning: true,
        whoIsMoving: 'player',
        winner: null,
      };
    case END_GAME:
      return {
        ...state,
        edges: action.payload.winner
          ? state.edges
          : state.edges.map((edge) => ({
              ...edge,
              team: null,
            })),
        isGameRunning: false,
        winner: action.payload.winner,
      };
    case NEXT_MOVE:
      return {
        ...state,
        edges: [
          ...state.edges.filter(
            (item) =>
              item.source !== action.payload.edge.source ||
              item.target !== action.payload.edge.target,
          ),
          action.payload.edge,
        ],
        whoIsMoving:
          action.payload.edge.team === 'player' ? 'computer' : 'player',
      };
    default:
      return state;
  }
};
