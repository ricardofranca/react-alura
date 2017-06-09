import React, { Component } from 'react';


export default class Login extends Component {

    constructor() {
        super();

        this.state = { msg: '' };
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
                console.log(token); 
                //browserHistory.push();
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