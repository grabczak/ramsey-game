import { ADD_EDGE, CREATE_GRAPH } from '../../constants/actions';
import { wait } from '../../utils/wait';
import { TRootState, TNode, TLink } from '../../typings/state';
import { endGame } from './game';

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

    const playerGraph = new jsnx.Graph();

    playerGraph.addNodesFrom(
      getState().graph.nodes.map((node: TNode) => Math.floor(Number(node.id))),
    );

    playerGraph.addEdgesFrom(
      getState()
        .graph.links.filter((link: TLink) => link.color === 'green')
        .map((link: TLink) => [
          Math.floor(Number(link.source)),
          Math.floor(Number(link.target)),
        ]),
    );

    if (
      jsnx.graphCliqueNumber(playerGraph) ===
      getState().options.targetCliqueSize
    ) {
      dispatch(endGame('player'));
      return;
    }

    const possibleEdges = getState().graph.links.filter(
      (link: TLink) => link.color === '#CCCCCC',
    );

    const newEdge =
      possibleEdges[Math.floor(Math.random() * possibleEdges.length)];

    if (newEdge) {
      dispatch(addEdge(newEdge.source, newEdge.target, 'computer'));
    }

    const computerGraph = new jsnx.Graph();

    computerGraph.addNodesFrom(
      getState().graph.nodes.map((node: TNode) => Math.floor(Number(node.id))),
    );

    computerGraph.addEdgesFrom(
      getState()
        .graph.links.filter((link: TLink) => link.color === 'red')
        .map((link: TLink) => [
          Math.floor(Number(link.source)),
          Math.floor(Number(link.target)),
        ]),
    );

    if (
      jsnx.graphCliqueNumber(computerGraph) ===
      getState().options.targetCliqueSize
    ) {
      dispatch(endGame('computer'));
      return;
    }
  };
};
