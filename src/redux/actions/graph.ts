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

    // This code needs some serious refactor
    const findNewEdge = (): any => {
      return new Promise((resolve) => {
        const nodes = playerGraph.nodes();

        for (const a of nodes) {
          for (const b of nodes) {
            if (a >= b) {
              continue;
            }

            const newPlayerGraph = new jsnx.Graph();

            newPlayerGraph.addNodesFrom(
              getState().graph.nodes.map((node: TNode) =>
                Math.floor(Number(node.id)),
              ),
            );

            newPlayerGraph.addEdgesFrom(
              getState()
                .graph.links.filter((link: TLink) => link.color === 'green')
                .map((link: TLink) => [
                  Math.floor(Number(link.source)),
                  Math.floor(Number(link.target)),
                ]),
            );

            newPlayerGraph.addEdge(a, b);

            const computerEdges = getState().graph.links.filter(
              (link: TLink) => link.color === 'red',
            );

            if (
              jsnx.graphCliqueNumber(newPlayerGraph) ===
                getState().options.targetCliqueSize &&
              !computerEdges.some(
                (link: TLink) =>
                  Math.floor(Number(link.source)) === a &&
                  Math.floor(Number(link.target)) === b,
              )
            ) {
              const newEdge = {
                source: getState().graph.nodes.find(
                  (node: TNode) => Math.floor(Number(node.id)) === a,
                )?.id,
                target: getState().graph.nodes.find(
                  (node: TNode) => Math.floor(Number(node.id)) === b,
                )?.id,
              };

              resolve(newEdge);
            }
          }
        }
        resolve(
          possibleEdges[Math.floor(Math.random() * possibleEdges.length)],
        );
      });
    };

    const newEdge = await findNewEdge();

    console.log(newEdge);

    if (newEdge) {
      await wait(2);
      dispatch(addEdge(newEdge.source, newEdge.target, 'computer'));
    } else {
      dispatch(endGame('draw'));
      return;
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

    const remainingEdges = getState().graph.links.filter(
      (link: TLink) => link.color === '#CCCCCC',
    );

    if (remainingEdges.length === 0) {
      dispatch(endGame('draw'));
    }
  };
};
