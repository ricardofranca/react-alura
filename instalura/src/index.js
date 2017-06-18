import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
//import registerServiceWorker from './registerServiceWorker';
import './css/reset.css';
import './css/timeline.css';
import './css/login.css';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom'; //browserHistory
import Login from './components/Login';
import Logout from './components/Logout';

import thunkMiddleware from 'redux-thunk';
import { createStore, applyMiddleware, combineReducers } from 'redux';
import { timeline } from './reducers/timeline';
import { notificacao } from './reducers/notificacao';
import { Provider } from 'react-redux';

const reducers = combineReducers({ timeline, notificacao });
const store = createStore(reducers, applyMiddleware(thunkMiddleware));

function verifyAuth(component) {
    if (localStorage.getItem('auth-token') === null) {
        return <Redirect to="/?msg=você precisa estar logado para acessar o endereço" />
    } else {
        return component;
    }
}

ReactDOM.render(
    (
        <Provider store={store}>
            <Router>
                <Switch>
                    <Route exact path="/" component={Login} />
                    <Route path="/timeline/" exact render={() => { return verifyAuth(<App />) }} />
                    <Route path="/timeline/:login" component={App} />
                    {/* example using optional parameters: */}
                    {/*<Route path="/timeline/:login?" component={App} /> */}
                    <Route path="/logout" component={Logout} />
                </Switch>
            </Router>
        </Provider>
    )
    ,
    document.getElementById('root')
);
//registerServiceWorker();
