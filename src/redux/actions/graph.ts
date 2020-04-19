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
    affiliation: 'player' | 'computer';
  };
};

export const addEdge = (
  source: string,
  target: string,
  affiliation: 'player' | 'computer',
) => {
  return {
    type: ADD_EDGE,
    payload: { source, target, affiliation },
  };
};

export const nextMove = (source: string, target: string) => {
  return (dispatch: any, getState: any) => {
    dispatch(addEdge(source, target, 'player'));

    const { nodes, links } = getState().graph;

    const playerGraph = new jsnx.Graph();

    playerGraph.addNodesFrom(
      nodes.map((node: any) => Math.floor(Number(node.id))),
    );

    playerGraph.addEdgesFrom(
      links
        .filter((link: any) => link.color === 'green')
        .map((link: any) => [
          Math.floor(Number(link.source)),
          Math.floor(Number(link.target)),
        ]),
    );

    console.log('Max clique size:', jsnx.graphCliqueNumber(playerGraph));
  };
};
