import React from 'react';
import './styles.css';
import { useDispatch, useSelector } from 'react-redux';
import { Graph as ReactD3Graph } from 'react-d3-graph';

import { Node } from '../Node';
import { TRootState, TLink } from '../../typings/state';
import { nextMove } from '../../redux/actions/graph';

export const Graph = () => {
  const config = {
    node: {
      renderLabel: false,
      viewGenerator: (node: any) => <Node id={node.id} />,
    },
    link: {
      strokeWidth: 3,
    },
    staticGraph: true,
    width: 500,
    height: 500,
  };

  const graph = useSelector((state: TRootState) => state.graph);

  const isGameRunning = useSelector(
    (state: TRootState) => state.game.isGameRunning,
  );

  const isComputerTurn = useSelector(
    (state: TRootState) => state.game.isComputerTurn,
  );

  const dispatch = useDispatch();

  const onClickLink = (source: string, target: string) => {
    if (isComputerTurn) {
      return;
    }

    const link = graph.links.find(
      (link: TLink) => link.source === source && link.target === target,
    );

    if (link?.color === '#CCCCCC') {
      dispatch(nextMove(source, target));
    }
  };

  return (
    <div className="graph">
      <ReactD3Graph
        id="graph"
        data={graph}
        config={config}
        onClickLink={onClickLink}
        y
      />
      {!isGameRunning && <div className="overlay" />}
    </div>
  );
};
