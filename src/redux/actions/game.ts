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

    if (jsnx.graphCliqueNumber(playerGraph) === targetCliqueSize) {
      dispatch(endGame('player'));
      return;
    }

    const computerGraph = new jsnx.Graph();
    computerGraph.addNodesFrom(jsnxNodes);
    computerGraph.addEdgesFrom(jsnxComputerEdges);

    const isAvailable = (source: number, target: number) => {
      return availableEdges.some(
        (edge: TEdge) => edge.source === source && edge.target === target,
      );
    };

    const findNewEdge = (): TEdge & { winningEdge: boolean } => {
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
            isAvailable(a, b) &&
            jsnx.graphCliqueNumber(newComputerGraph) === targetCliqueSize
          ) {
            return {
              source: a,
              target: b,
              team: 'computer',
              winningEdge: true,
            };
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
            isAvailable(a, b) &&
            jsnx.graphCliqueNumber(newPlayerGraph) === targetCliqueSize
          ) {
            return {
              source: a,
              target: b,
              team: 'computer',
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
            team: 'computer',
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
                team: 'computer',
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
            team: 'computer',
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
                  team: 'computer',
                  winningEdge: false,
                };
              }
            }
          }
        }

        if (jsnxComputerEdges.length === 4) {
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
                isAvailable(a, b) &&
                jsnx.graphCliqueNumber(newComputerGraph) === 3
              ) {
                return {
                  source: a,
                  target: b,
                  team: 'computer',
                  winningEdge: false,
                };
              }
            }
          }
        }

        for (let i = 0; i < computerDegrees.length; i++) {
          for (let j = 0; j < computerDegrees.length; j++) {
            if (i === 0 || j === 0) {
              continue;
            }

            if (isAvailable(computerDegrees[i][0], computerDegrees[j][0])) {
              return {
                source: computerDegrees[i][0],
                target: computerDegrees[j][0],
                team: 'computer',
                winningEdge: false,
              };
            }
          }
        }
      }

      return {
        ...availableEdges[Math.floor(Math.random() * availableEdges.length)],
        team: 'computer',
        winningEdge: false,
      };
    };

    const newEdge = findNewEdge();

    if (newEdge.winningEdge || newEdge.source || newEdge.target) {
      // await wait(2);

      if (!getState().game.isGameRunning) {
        return;
      }

      dispatch(nextMove(newEdge));

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

// function getCycles(graph: any) {
//   let cycles: any = [];

//   function findNewCycles(graph: any, path: any) {
//     const startNode = path[0];
//     let nextNode = null;
//     let sub = [];

//     console.log('e');

//     for (const edge of graph) {
//       const [node1, node2] = edge;
//       if (edge.includes(startNode)) {
//         nextNode = node1 === startNode ? node2 : node1;
//       }
//       if (notVisited(nextNode, path)) {
//         sub = [nextNode].concat(path);
//         findNewCycles(graph, sub);
//       } else if (path.length > 2 && nextNode === path[path.length - 1]) {
//         const p = rotateToSmallest(path);
//         const inv = invert(p);
//         if (isNew(p) && isNew(inv)) {
//           cycles.push(p);
//         }
//       }
//     }
//   }

//   function invert(path: any) {
//     return rotateToSmallest([...path].reverse());
//   }

//   function rotateToSmallest(path: any) {
//     const n = path.indexOf(Math.min(...path));
//     return path.slice(n).concat(path.slice(0, n));
//   }

//   function isNew(path: any) {
//     const p = JSON.stringify(path);

//     for (const cycle of cycles) {
//       if (p === JSON.stringify(cycle)) {
//         return false;
//       }
//     }
//     return true;
//   }

//   function notVisited(node: any, path: any) {
//     const n = JSON.stringify(node);
//     for (const p of path) {
//       if (n === JSON.stringify(p)) {
//         return false;
//       }
//     }
//     return true;
//   }

//   for (const edge of graph) {
//     for (const node of edge) {
//       findNewCycles(graph, [node]);
//     }
//   }

//   return cycles;
// }
