import React, { Component } from 'react';
import Header from './components/Header';
import Timeline from './components/Timeline';
import { createStore } from 'redux';
import { timeline } from './reducers/timeline';

const store = createStore(timeline);

class App extends Component {
  render() {

    return (
      <div id="root">
        <div className="main">
          <Header />
          <Timeline {...this.props} store={store} />
        </div>
      </div>
    );
  }
}

export default App;