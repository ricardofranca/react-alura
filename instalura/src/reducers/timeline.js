/* 
  action => contém o payload
  state = vem o último estado
*/

import { List } from 'immutable';

function trocaFoto(lista, fotoId, callbackAtualizaPropriedades) {
  const fotoEstadoAntigo = lista.find(foto => foto.id === fotoId);
  const novasPropriedades = callbackAtualizaPropriedades(fotoEstadoAntigo);
  const fotosEstadoNovo = Object.assign({}, fotoEstadoAntigo, novasPropriedades);
  const indiceDaLista = lista.findIndex(foto => foto.id === fotoId);
  return lista.set(indiceDaLista, fotosEstadoNovo);
}

export function timeline(state = [], action) {
  if (action.type === 'LISTAGEM') {
    return new List(action.fotos);
  }

  if (action.type === 'COMENTARIO') {
    const callback = fotoEstadoAntigo => {
      const novosComentarios = fotoEstadoAntigo.comentarios.concat(action.novoComentario);
      return { comentarios: novosComentarios };
    };

    return trocaFoto(state, action.fotoId, callback);
  }

  if (action.type === 'LIKE') {

    const callback = fotoEstadoAntigo => {
      const likeada = !fotoEstadoAntigo.likeada;
      const liker = action.liker;
      const possivelLiker = fotoEstadoAntigo.likers.find(likerAtual => likerAtual.login === liker.login);

      let novosLikers;
      if (possivelLiker === undefined) {
        novosLikers = fotoEstadoAntigo.likers.concat(liker);
      } else {
        novosLikers = fotoEstadoAntigo.likers.filter(likerAtual => likerAtual.login !== liker.login);
      }

      return { likeada, likers: novosLikers };
    };

    return trocaFoto(state,action.fotoId, callback);
  }

  return state;
}

