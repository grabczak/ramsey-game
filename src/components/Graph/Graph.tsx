import React from 'react';
import { Graph as ReactD3Graph } from 'react-d3-graph';

export function Graph() {
  const data = {
    nodes: [{ id: 'Harry' }, { id: 'Sally' }, { id: 'Alice' }],
    links: [
      { source: 'Harry', target: 'Sally' },
      { source: 'Harry', target: 'Alice' },
    ],
  };

  const config = {
    linkHighlightBehavior: true,
    node: {
      color: 'black',
      size: 350,
      // viewGenerator:
    },
    link: {
      highlightColor: 'green',
      strokeWidth: 5,
    },
    // staticGraph: true,
    // width: 500,
    // height: 500
  };

  const onClickLink = function(source: any, target: any) {
    console.log(`Clicked link between ${source} and ${target}`);
  };

  const onMouseOverLink = function(source: any, target: any) {
    console.log(`Mouse over in link between ${source} and ${target}`);
  };

  const onMouseOutLink = function(source: any, target: any) {
    console.log(`Mouse out link between ${source} and ${target}`);
  };

  return (
    <ReactD3Graph
      id="graph"
      data={data}
      config={config}
      onClickLink={onClickLink}
      onMouseOverLink={onMouseOverLink}
      onMouseOutLink={onMouseOutLink}
    />
  );
}
