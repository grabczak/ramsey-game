import { START_GAME, END_GAME, ADD_EDGE } from '../../constants/actions';
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
        isGameRunning: action.payload.winner !== null,
        isComputerTurn: false,
        winner: action.payload.winner,
      };
    case ADD_EDGE:
      return {
        ...state,
        isComputerTurn: action.payload.affiliation === 'player',
      };
    default:
      return state;
  }
};
