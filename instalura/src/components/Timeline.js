import React, { Component } from 'react';
import FotoItem from './FotoItem';
import ReactCSSTransitionGroup from 'react/lib/ReactCSSTransitionGroup';
import TimelineApi from '../logicas/TimelineApi';

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

        this.props.store.dispatch(TimelineApi.lista(urlPerfil));
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
        this.props.store.subscribe(() => {
            this.setState({ fotos: this.props.store.getState() });
        })
    }

    comenta(fotoId, textoComentario) {
        this.props.store.dispatch(TimelineApi.comenta(fotoId, textoComentario));
    }

    like(fotoId) {
        this.props.store.dispatch(TimelineApi.like(fotoId));
    }

    render() {
        return (
            <div className="fotos container">
                <ReactCSSTransitionGroup
                    transitionName="timeline"
                    transitionEnterTimeout={500}
                    transitionLeaveTimeout={300}>
                    {
                        this.state.fotos.map(foto => <FotoItem key={foto.id} foto={foto} comenta={this.comenta.bind(this)} like={this.like.bind(this)} />)
                    }
                </ReactCSSTransitionGroup>
            </div>
        );
    }
}