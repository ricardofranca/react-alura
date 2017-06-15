import { Component } from 'react';
import {withRouter} from "react-router-dom";

class Logout extends Component {

    componentWillMount() {
        localStorage.removeItem('auth-token');
        this.props.history.push("/");
    }

    render() {
        return null;
    }
}


export default withRouter(Logout);