import React from 'react';
import './styles.css';

export type TNodeProps = {
  id: number;
};

export const Node = ({ id }: TNodeProps) => {
  return (
    <div className="node">
      <p>{id + 1}</p>
    </div>
  );
};
