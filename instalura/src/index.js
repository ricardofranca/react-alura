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

function verifyAuth(component) {
    if (localStorage.getItem('auth-token') === null) {
        return <Redirect to="/?msg=você precisa estar logado para acessar o endereço" />
    } else {
        return component;
    }
}

ReactDOM.render(

    (
        // can't destruct browserHistory from react-router-dom
        // <Router history={browserHistory}>
        <Router>
            <Switch>
                <Route exact path="/" component={Login} />
                <Route path="/timeline" render={() => { return verifyAuth(<App />) }} />
                <Route path="/logout" component={Logout} />
            </Switch>
        </Router>
    )
    ,
    document.getElementById('root')
);
//registerServiceWorker();
