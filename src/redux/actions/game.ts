import {
  SET_GRAPH_SIZE,
  SET_TARGET_CLIQUE_SIZE,
  START_GAME,
  END_GAME,
  NEXT_MOVE,
} from '../../constants/actions';
import { TNode, TEdge, TRootState } from '../../typings/state';
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
  return async (dispatch: any, getState: () => TRootState) => {
    const graphSize = getState().game.nodes.length;
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

    const computerGraph = new jsnx.Graph();
    computerGraph.addNodesFrom(jsnxNodes);
    computerGraph.addEdgesFrom(jsnxComputerEdges);

    const findNewEdge = async (): Promise<TEdge & { winningEdge: boolean }> => {
      if (jsnxPlayerEdges.length === 1) {
        const [v1, v2] = jsnxPlayerEdges[0];

        const v1Edges = [];
        for (let i = 0; i < graphSize; i++) {
          if (i !== v1 && i !== v2) {
            v1Edges.push([v1, i]);
          }
        }

        const edge = v1Edges[Math.floor(Math.random() * v1Edges.length)];

        return {
          source: edge[0],
          target: edge[1],
          team: 'computer',
          winningEdge: false,
        };
      }

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
            possibleEdges.some(
              (edge: TEdge) => edge.source === a && edge.target === b,
            ) &&
            jsnx.graphCliqueNumber(newComputerGraph) === targetCliqueSize
          ) {
            const newEdge = {
              source: a,
              target: b,
              team: 'computer' as const,
              winningEdge: true,
            };

            return newEdge;
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

            return newEdge;
          }
        }
      }

      if (targetCliqueSize === 3) {
        const playerDegrees = Array.from(jsnx.degree(playerGraph)).sort(
          (a: any, b: any) => a[1] - b[1],
        );

        const computerDegrees = Array.from(jsnx.degree(computerGraph)).sort(
          (a: any, b: any) => b[1] - a[1],
        );

        for (const computerDegree of computerDegrees) {
          for (const playerDegree of playerDegrees) {
            // @ts-ignore
            const [v1, v2] = [computerDegree[0], playerDegree[0]].sort();

            if (
              possibleEdges.some(
                (edge: TEdge) => edge.source === v1 && edge.target === v2,
              )
            ) {
              return {
                source: v1,
                target: v2,
                team: 'computer',
                winningEdge: false,
              };
            }
          }
        }
      }

      return {
        ...possibleEdges[Math.floor(Math.random() * possibleEdges.length)],
        team: 'computer',
        winningEdge: false,
      };
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
