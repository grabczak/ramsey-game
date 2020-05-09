export type TNode = {
  id: number;
};

export type TEdge = {
  source: number;
  target: number;
  team: 'player' | 'computer' | null;
};

export type TGameState = {
  nodes: TNode[];
  edges: TEdge[];
  targetCliqueSize: number;
  isGameRunning: boolean;
  whoIsMoving: 'player' | 'computer';
  winner: 'player' | 'computer' | 'draw' | null;
};

export type TRootState = {
  game: TGameState;
};
