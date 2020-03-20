import React from 'react';
import './Node.css';

export type NodeProps = {
  id: string;
};

export function Node({ id }: NodeProps) {
  return (
    <div className="Node">
      <p>{Math.floor(Number(id))}</p>
    </div>
  );
}
