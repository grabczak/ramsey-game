import { START_GAME, END_GAME } from '../../constants/actions';

export const startGame = () => {
  return {
    type: START_GAME,
  };
};

export const endGame = (
  winner: 'player' | 'computer' | 'draw' | null = null,
) => {
  return {
    type: END_GAME,
    payload: { winner },
  };
};
