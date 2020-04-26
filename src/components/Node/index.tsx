import React from 'react';
import './styles.css';

export type TNodeProps = {
  id: string;
};

export const Node = ({ id }: TNodeProps) => {
  return (
    <div className="node">
      <p>{Math.floor(Number(id))}</p>
    </div>
  );
};
