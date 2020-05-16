import {
  SET_GRAPH_SIZE,
  SET_TARGET_CLIQUE_SIZE,
  START_GAME,
  END_GAME,
  NEXT_MOVE,
} from '../../constants/actions';
import { TNode, TEdge } from '../../typings/state';
import { TThunkResult } from '../../typings/actions';
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

export const playerMove = (
  source: number,
  target: number,
): TThunkResult<Promise<void>> => {
  return async (dispatch, getState) => {
    const { targetCliqueSize } = getState().game;

    dispatch(nextMove({ source, target, team: 'player' }));

    const jsnxNodes = getState().game.nodes.map((node: TNode) => node.id);

    const jsnxPlayerEdges = getState()
      .game.edges.filter((edge: TEdge) => edge.team === 'player')
      .map((edge: TEdge) => [edge.source, edge.target]);

    const jsnxComputerEdges = getState()
      .game.edges.filter((edge: TEdge) => edge.team === 'computer')
      .map((edge: TEdge) => [edge.source, edge.target]);

    const availableEdges = getState().game.edges.filter(
      (edge: TEdge) => edge.team === null,
    );

    const playerGraph = new jsnx.Graph();
    playerGraph.addNodesFrom(jsnxNodes);
    playerGraph.addEdgesFrom(jsnxPlayerEdges);

    const computerGraph = new jsnx.Graph();
    computerGraph.addNodesFrom(jsnxNodes);
    computerGraph.addEdgesFrom(jsnxComputerEdges);

    if (jsnx.graphCliqueNumber(playerGraph) === targetCliqueSize) {
      dispatch(endGame('player'));
      return;
    }

    const isAvailable = (source: number, target: number) => {
      if (source >= target) {
        return false;
      }

      return availableEdges.some(
        (edge: TEdge) => edge.source === source && edge.target === target,
      );
    };

    const findNewEdge = () => {
      for (const a of jsnxNodes) {
        for (const b of jsnxNodes) {
          const newComputerGraph = new jsnx.Graph();
          newComputerGraph.addNodesFrom(jsnxNodes);
          newComputerGraph.addEdgesFrom(jsnxComputerEdges);
          newComputerGraph.addEdge(a, b);

          if (
            isAvailable(a, b) &&
            jsnx.graphCliqueNumber(newComputerGraph) === targetCliqueSize
          ) {
            return {
              source: a,
              target: b,
              winningEdge: true,
            };
          }
        }
      }

      for (const a of jsnxNodes) {
        for (const b of jsnxNodes) {
          const newPlayerGraph = new jsnx.Graph();
          newPlayerGraph.addNodesFrom(jsnxNodes);
          newPlayerGraph.addEdgesFrom(jsnxPlayerEdges);
          newPlayerGraph.addEdge(a, b);

          if (
            isAvailable(a, b) &&
            jsnx.graphCliqueNumber(newPlayerGraph) === targetCliqueSize
          ) {
            return {
              source: a,
              target: b,
              winningEdge: false,
            };
          }
        }
      }

      const jsnxPDegrees: Map<number, number> = jsnx.degree(playerGraph);

      const playerDegrees: number[][] = Array.from(jsnxPDegrees).sort(
        (a: number[], b: number[]) => a[1] - b[1],
      );

      const jsnxCDegrees: Map<number, number> = jsnx.degree(computerGraph);

      const computerDegrees: number[][] = Array.from(jsnxCDegrees).sort(
        (a: number[], b: number[]) => b[1] - a[1],
      );

      if (targetCliqueSize === 3) {
        if (jsnxComputerEdges.length === 0) {
          const [v1, v2] = jsnxPlayerEdges[0];

          const availableEdgesWithPlayerVertex = availableEdges.filter(
            (edge: TEdge) =>
              edge.source === v1 ||
              edge.source === v2 ||
              edge.target === v1 ||
              edge.target === v2,
          );

          const edge =
            availableEdgesWithPlayerVertex[
              Math.floor(Math.random() * availableEdgesWithPlayerVertex.length)
            ];

          return {
            ...edge,
            winningEdge: false,
          };
        }

        for (const computerDegree of computerDegrees) {
          for (const playerDegree of playerDegrees) {
            const [v1, v2] = [computerDegree[0], playerDegree[0]].sort();

            if (isAvailable(v1, v2)) {
              return {
                source: v1,
                target: v2,
                winningEdge: false,
              };
            }
          }
        }
      }

      if (targetCliqueSize === 4) {
        if (jsnxComputerEdges.length === 0) {
          return {
            ...availableEdges[
              Math.floor(Math.random() * availableEdges.length)
            ],
            winningEdge: false,
          };
        }

        if (computerDegrees[0][1] < 4) {
          for (const computerDegree of computerDegrees) {
            for (const playerDegree of playerDegrees) {
              const [v1, v2] = [computerDegree[0], playerDegree[0]].sort();

              if (isAvailable(v1, v2)) {
                return {
                  source: v1,
                  target: v2,
                  winningEdge: false,
                };
              }
            }
          }
        }

        if (jsnxComputerEdges.length === 4) {
          for (const a of jsnxNodes) {
            for (const b of jsnxNodes) {
              const newComputerGraph = new jsnx.Graph();
              newComputerGraph.addNodesFrom(jsnxNodes);
              newComputerGraph.addEdgesFrom(jsnxComputerEdges);
              newComputerGraph.addEdge(a, b);

              if (
                isAvailable(a, b) &&
                jsnx.graphCliqueNumber(newComputerGraph) === 3
              ) {
                return {
                  source: a,
                  target: b,
                  winningEdge: false,
                };
              }
            }
          }
        }

        const maxDegree = computerDegrees[0][1];

        let maxSum = 0;
        let v1 = null;
        let v2 = null;

        for (const a of computerDegrees) {
          for (const b of computerDegrees) {
            const sourceDegree = a[1];
            const targetDegree = b[1];

            if (sourceDegree === maxDegree || targetDegree === maxDegree) {
              continue;
            }

            const sum = a[1] + b[1];

            const source = a[0];
            const target = b[0];

            if (sum >= maxSum && isAvailable(source, target)) {
              maxSum = sum;
              v1 = source;
              v2 = target;
            }
          }
        }

        if (v1 !== null && v2 !== null) {
          return {
            source: v1,
            target: v2,
            winningEdge: false,
          };
        }
      }

      return {
        ...availableEdges[Math.floor(Math.random() * availableEdges.length)],
        winningEdge: false,
      };
    };

    const newEdge = findNewEdge();

    if (newEdge.winningEdge || newEdge.source || newEdge.target) {
      await wait(2);

      if (!getState().game.isGameRunning) {
        return;
      }

      dispatch(
        nextMove({
          source: newEdge.source,
          target: newEdge.target,
          team: 'computer',
        }),
      );

      if (newEdge.winningEdge) {
        dispatch(endGame('computer'));
        return;
      }
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
