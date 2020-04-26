import React from 'react';
import './styles.css';
import { useDispatch, useSelector } from 'react-redux';

import { TRootState } from '../../typings/state';
import { setGraphSize, setTargetCliqueSize } from '../../redux/actions/options';
import { startGame, endGame } from '../../redux/actions/game';

export const Form = () => {
  const graphSize = useSelector((state: TRootState) => state.options.graphSize);

  const targetCliqueSize = useSelector(
    (state: TRootState) => state.options.targetCliqueSize,
  );

  const isGameRunning = useSelector(
    (state: TRootState) => state.game.isGameRunning,
  );

  const dispatch = useDispatch();

  const handleGraphSizeChange = (e: any) => {
    dispatch(setGraphSize(Number(e.target.value)));
  };

  const handleTargetCliqueSizeChange = (e: any) => {
    dispatch(setTargetCliqueSize(Number(e.target.value)));
  };

  const handleGameStart = () => {
    dispatch(startGame());
  };

  const handleGameEnd = () => {
    dispatch(endGame());
  };

  return (
    <div className="form">
      <div className="row">
        <p>Rozmiar grafu:</p>
        <p>{graphSize}</p>
        <input
          type="range"
          value={graphSize}
          onChange={handleGraphSizeChange}
          disabled={isGameRunning}
          min={4}
          max={10}
        />
      </div>
      <div className="row">
        <p>Rozmiar szukanej kliki:</p>
        <p>{targetCliqueSize}</p>
        <input
          type="range"
          value={targetCliqueSize}
          onChange={handleTargetCliqueSizeChange}
          disabled={isGameRunning}
          min={3}
          max={graphSize}
        />
      </div>
      <div className="buttonsContainer">
        <button onClick={handleGameStart} disabled={isGameRunning}>
          Rozpocznij grę
        </button>
        <button onClick={handleGameEnd} disabled={!isGameRunning}>
          Zakończ grę
        </button>
      </div>
    </div>
  );
};
