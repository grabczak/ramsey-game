import React, { useEffect } from 'react';
import './styles.css';
import { useDispatch, useSelector } from 'react-redux';

import { TRootState } from '../../typings/state';
import { setGraphSize, setTargetCliqueSize } from '../../redux/actions/game';
import { startGame, endGame } from '../../redux/actions/game';

export const Form = () => {
  const graphSize = useSelector((state: TRootState) => state.game.nodes.length);

  const targetCliqueSize = useSelector(
    (state: TRootState) => state.game.targetCliqueSize,
  );

  const isGameRunning = useSelector(
    (state: TRootState) => state.game.isGameRunning,
  );

  const whoIsMoving = useSelector(
    (state: TRootState) => state.game.whoIsMoving,
  );

  const winner = useSelector((state: TRootState) => state.game.winner);

  const dispatch = useDispatch();

  useEffect(() => {
    const loading = document.getElementById('loading');

    const interval = setInterval(() => {
      if (loading) {
        if (loading.innerHTML.length <= 2) {
          loading.innerHTML += '.';
        } else {
          loading.innerHTML = '';
        }
      }
    }, 500);

    return () => {
      clearInterval(interval);
    };
  }, [whoIsMoving]);

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
        <p className="field">Rozmiar grafu:</p>
        <p className="value">{graphSize}</p>
        <input
          className="field"
          type="range"
          value={graphSize}
          onChange={handleGraphSizeChange}
          disabled={isGameRunning}
          min={4}
          max={10}
        />
      </div>
      <div className="row">
        <p className="field">Rozmiar szukanej kliki:</p>
        <p className="value">{targetCliqueSize}</p>
        <input
          className="field"
          type="range"
          value={targetCliqueSize}
          onChange={handleTargetCliqueSizeChange}
          disabled={isGameRunning}
          min={3}
          max={graphSize}
        />
      </div>
      <div className="buttonsContainer">
        <button
          className="button"
          onClick={handleGameStart}
          disabled={isGameRunning}
        >
          Rozpocznij grę
        </button>
        <button
          className="button"
          onClick={handleGameEnd}
          disabled={!isGameRunning}
        >
          Zakończ grę
        </button>
      </div>
      {winner ? (
        <p
          className="loading"
          style={{
            color:
              winner === 'player'
                ? 'green'
                : winner === 'computer'
                ? 'red'
                : 'blue',
          }}
        >
          {winner === 'player'
            ? 'Człowiek wygrywa'
            : winner === 'computer'
            ? 'Komputer wygrywa'
            : 'Remis'}
        </p>
      ) : isGameRunning ? (
        <p className="loading">
          {whoIsMoving === 'computer' ? 'Komputer myśli' : 'Twoja kolej'}
          {whoIsMoving === 'computer' && <span id="loading" />}
        </p>
      ) : null}
    </div>
  );
};
