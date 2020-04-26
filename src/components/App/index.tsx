import React from 'react';
import './styles.css';
import { Provider } from 'react-redux';

import { store } from '../../redux/store';
import { Graph } from '../Graph';
import { Form } from '../Form';

export const App = () => {
  return (
    <Provider store={store}>
      <div className="app">
        <h1>Gra Ramseya</h1>
        <Form />
        <Graph />
      </div>
    </Provider>
  );
};
