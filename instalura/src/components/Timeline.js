import React, { Component } from 'react';
import FotoItem from './FotoItem';
import ReactCSSTransitionGroup from 'react/lib/ReactCSSTransitionGroup';
import TimelineApi from '../logicas/TimelineApi';
import { connect } from 'react-redux';

class Timeline extends Component {

    constructor(props) {
        super(props);
        this.login = this.props.login;
        console.log('const',this.props.login);
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

        this.props.lista(urlPerfil);
    }

    componentDidMount() {
        this.carregarFotos(this.props);
    }

    componentWillReceiveProps(nextProps) {

        console.log('componentWillReceiveProps', nextProps.login, '. atual: ', this.login);
        
        if (nextProps.login !== this.login) {
            console.log('novo usuario');
            this.login = nextProps.login;
            this.carregarFotos();
        }
    }

    render() {
        console.log('render', this.login);

        return (
            <div className="fotos container">
                <ReactCSSTransitionGroup
                    transitionName="timeline"
                    transitionEnterTimeout={500}
                    transitionLeaveTimeout={300}>
                    {
                        this.props.fotos.map(foto => <FotoItem key={foto.id} foto={foto} comenta={this.props.comenta} like={this.props.like} />)
                    }
                </ReactCSSTransitionGroup>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        fotos: state.timeline
    }
}

const mapDispatchToProps = dispatch => {
    return {
        like: (fotoId) => {
            dispatch(TimelineApi.like(fotoId))
        },
        comenta: (fotoId, textoComentario) => {
            dispatch(TimelineApi.comenta(fotoId, textoComentario))
        },
        lista: (urlPerfil) => {
            dispatch(TimelineApi.lista(urlPerfil))
        }
    }
}

const TimeLineContainer = connect(mapStateToProps, mapDispatchToProps)(Timeline);

export default TimeLineContainer;