import React from 'react';
import './styles.css';
import { Provider } from 'react-redux';

import { store } from '../../redux/store';
import { Graph } from '../Graph';

export function App() {
  return (
    <Provider store={store}>
      <div className="App">
        <Graph />
      </div>
    </Provider>
  );
}
