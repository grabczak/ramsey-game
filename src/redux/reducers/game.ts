import { START_GAME, END_GAME } from '../../constants/actions';
import { TGameAction } from '../../typings/actions';
import { TGameState } from '../../typings/state';

const initialState = {
  isGameRunning: false,
  isComputerTurn: false,
  winner: null,
};

export const game = (state: TGameState = initialState, action: TGameAction) => {
  switch (action.type) {
    case START_GAME:
      return {
        ...state,
        isGameRunning: true,
        winner: null,
      };
    case END_GAME:
      return {
        ...state,
        isGameRunning: false,
        isComputerTurn: false,
      };
    default:
      return state;
  }
};
