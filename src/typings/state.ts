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

export type TRootState = {
  graph: TGraphState;
};
