import React, { Component } from 'react';
import FotoItem from './FotoItem';
import Pubsub from 'pubsub-js';
import ReactCSSTransitionGroup from 'react/lib/ReactCSSTransitionGroup';

export default class Timeline extends Component {

    constructor(props) {
        super(props);
        this.state = { fotos: [] };
        this.login = this.getLoginFromProps(props);
    }

    getLoginFromProps(props) {
        if (props === undefined || props.match === undefined || props.match.params === undefined || props.match.params.login === undefined)
            return undefined;

        return props.match.params.login;
    }

    carregarFotos() {
        let urlPerfil;

        if (this.login === undefined) {
            let token = localStorage.getItem('auth-token');
            urlPerfil = `http://localhost:8080/api/fotos?X-AUTH-TOKEN=${token}`;
        }
        else {
            urlPerfil = `http://localhost:8080/api/public/fotos/${this.login}`;
        }

        fetch(urlPerfil)
            .then(response => response.json())
            .then(fotos => {
                this.setState({ fotos: fotos })
            });
    }

    componentDidMount() {
        this.carregarFotos(this.props);
    }

    componentWillReceiveProps(nextProps) {
        let login = this.getLoginFromProps(nextProps);
        if (login != undefined) {
            this.login = login;
            this.carregarFotos();
        }
    }

    componentWillMount() {
        Pubsub.subscribe('timeline', (topico, fotos) => {
            console.log('pubsub', fotos);
            this.setState({ fotos });
        });
    }

    render() {
        return (
            <div className="fotos container">
                <ReactCSSTransitionGroup
                    transitionName="timeline"
                    transitionEnterTimeout={500}
                    transitionLeaveTimeout={300}>
                    {
                        this.state.fotos.map(foto => <FotoItem key={foto.id} foto={foto} />)
                    }
                </ReactCSSTransitionGroup>
            </div>
        );
    }
}