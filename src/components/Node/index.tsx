import React from 'react';
import './styles.css';

export type TNodeProps = {
  id: string;
};

export function Node({ id }: TNodeProps) {
  return (
    <div className="Node">
      <p>{Math.floor(Number(id))}</p>
    </div>
  );
}
