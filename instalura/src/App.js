import React, { Component } from 'react';
import Header from './components/Header';
import Timeline from './components/Timeline';
import thunkMiddleware from 'redux-thunk';
import { createStore, applyMiddleware, combineReducers } from 'redux';
import { timeline } from './reducers/timeline';
import { notificacao } from './reducers/notificacao';

const reducers = combineReducers({ timeline, notificacao });
const store = createStore(reducers, applyMiddleware(thunkMiddleware));

class App extends Component {
  render() {

    return (
      <div id="root">
        <div className="main">
          <Header store={store} />
          <Timeline {...this.props} store={store} />
        </div>
      </div>
    );
  }
}

export default App;