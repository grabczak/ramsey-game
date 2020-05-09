import React, { useMemo } from 'react';
import './styles.css';
import { useDispatch, useSelector } from 'react-redux';
import { Graph as ReactD3Graph } from 'react-d3-graph';

import { Node } from '../Node';
import { TRootState, TNode, TEdge } from '../../typings/state';
import { playerMove } from '../../redux/actions/game';

export const Graph = () => {
  const nodes = useSelector((state: TRootState) => state.game.nodes);

  const edges = useSelector((state: TRootState) => state.game.edges);

  const isGameRunning = useSelector(
    (state: TRootState) => state.game.isGameRunning,
  );

  const whoIsMoving = useSelector(
    (state: TRootState) => state.game.whoIsMoving,
  );

  const winner = useSelector((state: TRootState) => state.game.winner);

  const dispatch = useDispatch();

  const onClickLink = (source: string, target: string) => {
    const numberSource = Math.floor(Number(source));
    const numberTarget = Math.floor(Number(target));

    if (whoIsMoving === 'computer' || winner) {
      return;
    }

    const edge = edges.find(
      (edge: TEdge) =>
        edge.source === numberSource && edge.target === numberTarget,
    );

    if (!edge?.team) {
      dispatch(playerMove(numberSource, numberTarget));
    }
  };

  const jsnxNodes = useMemo(() => {
    return nodes.map((node: TNode) => {
      const { length } = nodes;
      const { id } = node;

      return {
        id: String(id + Math.random()),
        x: 200 * Math.cos((-2 * Math.PI * id) / length + Math.PI / 2) + 250,
        y: -200 * Math.sin((-2 * Math.PI * id) / length + Math.PI / 2) + 250,
      };
    });
  }, [nodes]);

  const jsnxEdges = useMemo(() => {
    return edges.map((edge: TEdge) => {
      return {
        source: jsnxNodes.find(
          ({ id }) => Math.floor(Number(id)) === edge.source,
        )?.id,
        target: jsnxNodes.find(
          ({ id }) => Math.floor(Number(id)) === edge.target,
        )?.id,
        color:
          edge.team === 'player'
            ? 'green'
            : edge.team === 'computer'
            ? 'red'
            : 'gray',
      };
    });
  }, [jsnxNodes, edges]);

  const graph = {
    nodes: jsnxNodes,
    links: jsnxEdges,
  };

  return (
    <div className="graph">
      <ReactD3Graph
        id="graph"
        data={graph}
        config={{
          node: {
            viewGenerator: ({ id }: any) => (
              <Node id={Math.floor(Number(id))} />
            ),
            renderLabel: false,
          },
          link: {
            strokeWidth: 3,
          },
          staticGraph: true,
          width: 500,
          height: 500,
        }}
        onClickLink={onClickLink}
      />
      {!isGameRunning && <div className="overlay" />}
    </div>
  );
};
