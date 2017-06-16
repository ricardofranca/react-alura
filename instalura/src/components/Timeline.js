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

        Pubsub.subscribe('atualiza-liker', (topico, infoLiker) => {
            const fotoAchada = this.state.fotos.find(foto => foto.id === infoLiker.fotoId)
            fotoAchada.likeada = !fotoAchada.likeada;
            const possivelLiker = fotoAchada.likers.find(liker => liker.login === infoLiker.liker.login);

            if (possivelLiker === undefined) {
                fotoAchada.likers.push(infoLiker.liker);
            } else {
                const novosLikers = fotoAchada.likers.filter(liker => liker.login !== infoLiker.liker.login);
                fotoAchada.likers = novosLikers;
            }

            this.setState({ fotos: this.state.fotos });
        });

        Pubsub.subscribe('novos-comentarios', (topico, infoComentario) => {
            const fotoAchada = this.state.fotos.find(foto => foto.id === infoComentario.fotoId)
            const novosComentarios = fotoAchada.comentarios.push(infoComentario.novoComentario)
            this.setState({ fotos: this.state.fotos });
        });
    }

    comenta(fotoId, textoComentario) {
        let token = localStorage.getItem('auth-token');

        const requestInfo = {
            method: 'POST',
            body: JSON.stringify({ texto: textoComentario }),
            headers: new Headers({ 'Content-type': 'application/json' })
        };

        fetch(`http://localhost:8080/api/fotos/${fotoId}/comment?X-AUTH-TOKEN=${token}`, requestInfo)
            .then(response => {
                if (response.ok)
                    return response.json();
                throw new Error("Não foi possível comentar");
            })
            .then(novoComentario => {
                Pubsub.publish('novos-comentarios', { fotoId: fotoId, novoComentario });
            });
    }

    like(fotoId) {
        let token = localStorage.getItem('auth-token');
        let data = {
            method: 'POST'
        };

        fetch(`http://localhost:8080/api/fotos/${fotoId}/like?X-AUTH-TOKEN=${token}`, data)
            .then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error("não foi possível realizar o like da foto");
                }
            })
            .then(liker => {
                Pubsub.publish('atualiza-liker', { fotoId: fotoId, liker });
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
                        this.state.fotos.map(foto => <FotoItem key={foto.id} foto={foto} comenta={this.comenta} like={this.like} />)
                    }
                </ReactCSSTransitionGroup>
            </div>
        );
    }
}