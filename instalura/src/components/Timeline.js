import React, { Component } from 'react';
import FotoItem from './FotoItem';

export default class Timeline extends Component {

    constructor() {
        super();
        this.state = { fotos: [] };
    }

    componentDidMount() {
        let urlPerfil;

        if (this.props === undefined || this.props.match === undefined || this.props.match.params === undefined || this.props.match.params.login === undefined) {
            let token = localStorage.getItem('auth-token');
            urlPerfil = `http://localhost:8080/api/fotos?X-AUTH-TOKEN=${token}`;
        }
        else {
            urlPerfil = `http://localhost:8080/api/public/fotos/${this.props.match.params.login}`;
        }


        fetch(urlPerfil)
            .then(response => response.json())
            .then(fotos => {
                this.setState({ fotos: fotos })
            });
    }

    render() {
        return (
            <div className="fotos container">
                {
                    this.state.fotos.map(foto => <FotoItem key={foto.id} foto={foto} />)
                }
            </div>
        );
    }
}