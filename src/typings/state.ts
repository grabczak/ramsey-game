export type TNode = {
  id: string;
  x: number;
  y: number;
};

export type TLink = {
  source: string;
  target: string;
  color: string;
};

export type TGraphState = {
  nodes: Array<TNode>;
  links: Array<TLink>;
};

export type TOptionsState = {
  graphSize: number;
  targetCliqueSize: number;
};

export type TGameState = {
  isGameRunning: boolean;
  isComputerTurn: boolean;
  winner: 'player' | 'computer' | null;
};

export type TRootState = {
  game: TGameState;
  graph: TGraphState;
  options: TOptionsState;
};
