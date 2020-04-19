import React from 'react';
import './styles.css';
import { useDispatch, useSelector } from 'react-redux';
import { Graph as ReactD3Graph } from 'react-d3-graph';

import { Node } from '../Node';
import { TRootState } from '../../typings/state';
import { nextMove } from '../../redux/actions/graph';

import { setGraphSize, setTargetCliqueSize } from '../../redux/actions/options';

export function Graph() {
  const { graphSize, targetCliqueSize } = useSelector(
    (state: TRootState) => state.options,
  );

  const { graph } = useSelector((state: TRootState) => state);

  const dispatch = useDispatch();

  const config = {
    node: {
      renderLabel: false,
      viewGenerator: (node: any) => <Node id={node.id} />,
    },
    link: {
      highlightColor: 'green',
      strokeWidth: 2,
    },
    // linkHighlightBehavior: true,
    staticGraph: true,
    width: 500,
    height: 500,
  };

  const onClickLink = (source: string, target: string) => {
    dispatch(nextMove(source, target));
  };

  return (
    <div className="Graph">
      <p>{graphSize}</p>
      <input
        type="range"
        value={graphSize}
        onChange={(e) => dispatch(setGraphSize(Number(e.target.value)))}
        min={4}
        max={10}
      />
      <p>{targetCliqueSize}</p>
      <input
        type="range"
        value={targetCliqueSize}
        onChange={(e) => dispatch(setTargetCliqueSize(Number(e.target.value)))}
        min={3}
        max={graphSize}
      />
      <ReactD3Graph
        id="graph"
        data={graph}
        config={config}
        onClickLink={onClickLink}
      />
    </div>
  );
}
