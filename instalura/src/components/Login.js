import React, { Component } from 'react';
import {withRouter} from "react-router-dom";

class Login extends Component {

    constructor(props) {
        super(props);

        const params  = new URLSearchParams(this.props.location.search);
        const msg = params.get('msg');

        this.state = { msg: msg };
        //this.envia = this.envia.bind(this); //can use like this or on the render as below
    }

    envia(event) {
        event.preventDefault();
        
        const requestInfo = {
            method: 'post',
            body: JSON.stringify({ login: this.login.value, senha: this.senha.value }),
            headers: new Headers({
                'Content-type': 'application/json'
            })
        };

        fetch('http://localhost:8080/api/public/login', requestInfo)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Não foi possível fazer login');
                }

                return response.text();
            })
            .then(token => { 
                localStorage.setItem('auth-token', token);
                this.props.history.push("/timeline");
            })
            .catch(mensagem =>  { this.setState({ msg: 'Não foi possível fazer login' }) });
    }

    render() {
        return (
            <div className="login-box">
                <h1 className="header-logo">Instalura</h1>
                <span>{this.state.msg}</span>
                <form onSubmit={this.envia.bind(this)}>
                    <input type="text" ref={(input) => this.login = input} />
                    <input type="password" ref={(input) => this.senha = input} />

                    <input type="submit" value="Login" />
                </form>

            </div>
        );
    }
}

export default withRouter(Login);