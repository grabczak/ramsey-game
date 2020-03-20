import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Graph as ReactD3Graph } from 'react-d3-graph';

import { RootState } from '../../redux/store';
import { addEdge, createGraph } from '../../redux/actions/graph';

export function Graph() {
  const graph = useSelector((state: RootState) => state.graph);
  const dispatch = useDispatch();

  const config = {
    node: {
      color: 'black',
      size: 100,
      // viewGenerator:
    },
    link: {
      highlightColor: 'green',
      strokeWidth: 2,
    },
    linkHighlightBehavior: true,
    staticGraph: true,
    width: 500,
    height: 500,
    collapsible: true,
  };

  const onClickLink = function(source: string, target: string) {
    dispatch(addEdge(source, target));
  };

  return (
    <>
      <input
        type="range"
        value={graph.nodes.length}
        onChange={e => dispatch(createGraph(Number(e.target.value)))}
        min="5"
        max="10"
      />
      <ReactD3Graph
        id="graph"
        data={graph}
        config={config}
        onClickLink={onClickLink}
      />
    </>
  );
}
