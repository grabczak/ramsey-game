import { CREATE_GRAPH } from '../../constants/actions';
import { SetSizeAction } from '../actions/graph';

export type Node = {
  id: string;
};

export type Link = {
  source: string;
  target: string;
};

export type GraphState = {
  nodes: Array<Node>;
  links: Array<Link>;
};

export type GraphAction = SetSizeAction;

const initialState: GraphState = {
  ...createGraph(7),
};

export function graph(state = initialState, action: GraphAction): GraphState {
  switch (action.type) {
    case CREATE_GRAPH:
      return {
        ...state,
        ...createGraph(action.payload.size),
      };
    default:
      return state;
  }
}

function createGraph(size: number) {
  const nodes: Array<Node> = [];
  const links: Array<Link> = [];

  for (let i = 0; i < size; i++) {
    nodes.push({
      id: String(i + 1 + Math.random()),
    });
  }

  for (const a of nodes) {
    for (const b of nodes) {
      links.push({
        source: a.id,
        target: b.id,
      });
    }
  }

  return {
    nodes,
    links,
  };
}
