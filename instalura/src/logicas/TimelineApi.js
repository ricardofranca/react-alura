import Pubsub from 'pubsub-js';

export default class TimelineApi {

    constructor(fotos) {
        this.fotos = fotos;
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
                const fotoAchada = this.fotos.find(foto => foto.id === fotoId)
                fotoAchada.likeada = !fotoAchada.likeada;
                const possivelLiker = fotoAchada.likers.find(likerAtual => likerAtual.login === liker.login);

                if (possivelLiker === undefined) {
                    fotoAchada.likers.push(liker);
                } else {
                    const novosLikers = fotoAchada.likers.filter(likerAtual => likerAtual.login !== liker.login);
                    fotoAchada.likers = novosLikers;
                }

                Pubsub.publish('timeline', this.fotos);
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
                const fotoAchada = this.fotos.find(foto => foto.id === fotoId)
                const novosComentarios = fotoAchada.comentarios.push(novoComentario)
                Pubsub.publish('timeline', this.fotos);
            });
    }

    static lista(urlPerfil, store) {
        fetch(urlPerfil)
            .then(response => response.json())
            .then(fotos => {
                store.dispatch({ type: 'LISTAGEM', fotos });
            });
    }

    subscribe(callback) {
        Pubsub.subscribe('timeline', (topico, fotos) => {
            callback(fotos);
        });
    }
}