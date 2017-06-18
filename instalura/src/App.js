import React, { Component } from 'react';
import Header from './components/Header';
import Timeline from './components/Timeline';




class App extends Component {

  render() {
    let login;
    if (this.props !== undefined && this.props.match !== undefined && this.props.match.params !== undefined && this.props.match.params.login !== undefined)
      login = this.props.match.params.login;

    return (
      <div id="root">
        <div className="main">
          <Header store={this.context.store} />
          <Timeline login={login} />
        </div>
      </div>
    );
  }
}

App.contextTypes = {
  store: React.PropTypes.object.isRequired
}

export default App;