import { ADD_EDGE, CREATE_GRAPH } from '../../constants/actions';
import { wait } from '../../utils/wait';
import { TRootState, TNode, TLink } from '../../typings/state';

const jsnx = require('jsnetworkx');

export const createGraph = (size: number) => {
  return {
    type: CREATE_GRAPH,
    payload: { size },
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
  return async (dispatch: any, getState: () => TRootState) => {
    dispatch(addEdge(source, target, 'player'));

    const { nodes, links } = getState().graph;

    const playerGraph = new jsnx.Graph();

    playerGraph.addNodesFrom(
      nodes.map((node: TNode) => Math.floor(Number(node.id))),
    );

    playerGraph.addEdgesFrom(
      links
        .filter((link: TLink) => link.color === 'green')
        .map((link: TLink) => [
          Math.floor(Number(link.source)),
          Math.floor(Number(link.target)),
        ]),
    );

    console.log('Max clique size:', jsnx.graphCliqueNumber(playerGraph));

    const possibleEdges = links.filter(
      (link: TLink) => link.color === '#CCCCCC',
    );

    const newEdge =
      possibleEdges[Math.floor(Math.random() * possibleEdges.length)];

    await wait(1);

    if (newEdge) {
      dispatch(addEdge(newEdge.source, newEdge.target, 'computer'));
    }
  };
};
