import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
//import registerServiceWorker from './registerServiceWorker';
import './css/reset.css';
import './css/timeline.css';
import './css/login.css';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'; //browserHistory
import Login from './components/Login';


ReactDOM.render(

    (
        // can't destruct browserHistory from react-router-dom
        // <Router history={browserHistory}>
        <Router>
            <Switch>
                <Route exact path="/" component={Login} />
                <Route path="/timeline" component={App} />
            </Switch>
        </Router>
    )
    ,
    document.getElementById('root')
);
//registerServiceWorker();
