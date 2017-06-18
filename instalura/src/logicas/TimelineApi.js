import { listagem, comentario, like } from '../actions/actionCreator';

export default class TimelineApi {

    static like(fotoId) {
        return dispatch => {
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

                    dispatch(like(fotoId, liker));

                    return liker; //apenas para se alguém quiser utilizar o retorno da promise
                });
        };
    }

    static comenta(fotoId, textoComentario) {
        return dispatch => {
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
                    dispatch(comentario(fotoId, novoComentario));
                    return novoComentario; //apenas para se alguém quiser utilizar o retorno da promise
                });
        }
    }

    static lista(urlPerfil) {
        return dispatch => {
            fetch(urlPerfil)
                .then(response => response.json())
                .then(fotos => {
                    dispatch(listagem(fotos));
                    return fotos;
                });
        };
    }
}