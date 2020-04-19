import { ADD_EDGE, SET_GRAPH_SIZE } from '../../constants/actions';
import { TGraphAction } from '../../typings/actions';

const initialState = {
  ...createGraph(6),
};

export function graph(state = initialState, action: TGraphAction) {
  switch (action.type) {
    case SET_GRAPH_SIZE:
      return {
        ...state,
        ...createGraph(action.payload.size),
      };
    case ADD_EDGE:
      return {
        ...state,
        links: [
          ...state.links.filter(
            (item) =>
              item.source !== action.payload.source ||
              item.target !== action.payload.target,
          ),
          {
            source: action.payload.source,
            target: action.payload.target,
            color: action.payload.affiliation === 'player' ? 'green' : 'red',
          },
        ],
      };
    default:
      return state;
  }
}

function createGraph(size: number) {
  const r = 200;

  const nodes = [];
  const links = [];

  for (let i = 0; i < size; i++) {
    nodes.push({
      id: String(i + 1 + Math.random()),
      x: r * Math.cos((-2 * Math.PI * i) / size + Math.PI / 2) + 250,
      y: -r * Math.sin((-2 * Math.PI * i) / size + Math.PI / 2) + 250,
    });
  }

  for (const a of nodes) {
    for (const b of nodes) {
      if (Number(a.id) < Number(b.id)) {
        links.push({
          source: a.id,
          target: b.id,
          color: '#CCCCCC',
        });
      }
    }
  }

  return {
    nodes,
    links,
  };
}
