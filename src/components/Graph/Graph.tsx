import React from 'react';
import './Graph.css';
import { useDispatch, useSelector } from 'react-redux';
import { Graph as ReactD3Graph } from 'react-d3-graph';

import { Node } from '../Node';
import { RootState } from '../../redux/store';
import { addEdge, createGraph } from '../../redux/actions/graph';

export function Graph() {
  const graph = useSelector((state: RootState) => state.graph);
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
    linkHighlightBehavior: true,
    staticGraph: true,
    width: 500,
    height: 500,
  };

  const onClickLink = function(source: string, target: string) {
    dispatch(addEdge(source, target));
  };

  return (
    <div className="Graph">
      <p>{graph.nodes.length}</p>
      <input
        type="range"
        value={graph.nodes.length}
        onChange={e => dispatch(createGraph(Number(e.target.value)))}
        min="5"
        max="15"
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
