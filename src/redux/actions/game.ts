import {
  SET_GRAPH_SIZE,
  SET_TARGET_CLIQUE_SIZE,
  START_GAME,
  END_GAME,
  NEXT_MOVE,
} from '../../constants/actions';
import { TNode, TEdge } from '../../typings/state';
import { wait } from '../../utils/wait';

const jsnx = require('jsnetworkx');

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

export const startGame = () => {
  return {
    type: START_GAME,
  };
};

export const endGame = (
  winner: 'player' | 'computer' | 'draw' | null = null,
) => {
  return {
    type: END_GAME,
    payload: { winner },
  };
};

export const nextMove = (edge: TEdge) => {
  return {
    type: NEXT_MOVE,
    payload: { edge },
  };
};

export const playerMove = (source: number, target: number) => {
  return async (dispatch: any, getState: any) => {
    const { targetCliqueSize } = getState().game;

    dispatch(nextMove({ source, target, team: 'player' }));

    const jsnxNodes = getState().game.nodes.map((node: TNode) => node.id);
    const jsnxPlayerEdges = getState()
      .game.edges.filter((edge: TEdge) => edge.team === 'player')
      .map((edge: TEdge) => [edge.source, edge.target]);
    const jsnxComputerEdges = getState()
      .game.edges.filter((edge: TEdge) => edge.team === 'computer')
      .map((edge: TEdge) => [edge.source, edge.target]);

    const possibleEdges = getState().game.edges.filter(
      (edge: TEdge) => edge.team === null,
    );

    const playerGraph = new jsnx.Graph();
    playerGraph.addNodesFrom(jsnxNodes);
    playerGraph.addEdgesFrom(jsnxPlayerEdges);

    if (jsnx.graphCliqueNumber(playerGraph) === targetCliqueSize) {
      dispatch(endGame('player'));
      return;
    }

    const findNewEdge = (): Promise<TEdge & { winningEdge: boolean }> => {
      return new Promise((resolve) => {
        for (const a of jsnxNodes) {
          for (const b of jsnxNodes) {
            if (a >= b) {
              continue;
            }

            const newComputerGraph = new jsnx.Graph();
            newComputerGraph.addNodesFrom(jsnxNodes);
            newComputerGraph.addEdgesFrom(jsnxComputerEdges);
            newComputerGraph.addEdge(a, b);

            if (
              jsnx.graphCliqueNumber(newComputerGraph) === targetCliqueSize &&
              possibleEdges.some(
                (edge: TEdge) => edge.source === a && edge.target === b,
              )
            ) {
              const newEdge = {
                source: a,
                target: b,
                team: 'computer' as const,
                winningEdge: true,
              };

              resolve(newEdge);
            }
          }
        }

        for (const a of jsnxNodes) {
          for (const b of jsnxNodes) {
            if (a >= b) {
              continue;
            }

            const newPlayerGraph = new jsnx.Graph();
            newPlayerGraph.addNodesFrom(jsnxNodes);
            newPlayerGraph.addEdgesFrom(jsnxPlayerEdges);
            newPlayerGraph.addEdge(a, b);

            if (
              jsnx.graphCliqueNumber(newPlayerGraph) === targetCliqueSize &&
              possibleEdges.some(
                (edge: TEdge) => edge.source === a && edge.target === b,
              )
            ) {
              const newEdge = {
                source: a,
                target: b,
                team: 'computer' as const,
                winningEdge: false,
              };

              resolve(newEdge);
            }
          }
        }

        resolve({
          ...possibleEdges[Math.floor(Math.random() * possibleEdges.length)],
          team: 'computer',
          winningEdge: false,
        });
      });
    };

    const newEdge = await findNewEdge();

    if (newEdge.winningEdge) {
      await wait(2);
      dispatch(nextMove(newEdge));
      dispatch(endGame('computer'));
      return;
    } else if (newEdge.source || newEdge.target) {
      await wait(2);
      dispatch(nextMove(newEdge));
    } else {
      dispatch(endGame('draw'));
      return;
    }

    const remainingEdges = getState().game.edges.filter(
      (edge: TEdge) => edge.team === null,
    );

    if (remainingEdges.length === 0) {
      dispatch(endGame('draw'));
    }
  };
};
