import { ADD_EDGE, CREATE_GRAPH } from '../../constants/actions';
import { TAddEdge, TCreateGraph } from '../actions/graph';

export type TNode = {
  id: string;
  x: number;
  y: number;
};

export type TLink = {
  source: string;
  target: string;
  color: string;
};

export type TGraphState = {
  nodes: Array<TNode>;
  links: Array<TLink>;
};

export type TGraphAction = TCreateGraph | TAddEdge;

const initialState: TGraphState = {
  ...createGraph(7),
};

export function graph(state = initialState, action: TGraphAction): TGraphState {
  switch (action.type) {
    case CREATE_GRAPH:
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
            color: 'green',
          },
        ],
      };
    default:
      return state;
  }
}

function createGraph(size: number) {
  const r = 200;

  const nodes: Array<TNode> = [];
  const links: Array<TLink> = [];

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
