/* 
  action => contém o payload
  state = vem o último estado
*/

import { List } from 'immutable';

export function timeline(state = [], action) {
  if (action.type === 'LISTAGEM') {
    return new List(action.fotos);
  }

  if (action.type === 'COMENTARIO') {
    const fotoEstadoAntigo = state.find(foto => foto.id === action.fotoId);
    const novosComentarios = fotoEstadoAntigo.comentarios.concat(action.novoComentario);

    //criando um objeto novo com a referência para todos os atributos do antigo, depois troca apenas a última propriedade
    const fotosEstadoNovo = Object.assign({}, fotoEstadoAntigo, novosComentarios);
    const indiceDaLista = state.findIndex(foto => foto.id == action.fotoId);
    const novaLista = state.set(indiceDaLista, fotosEstadoNovo);
    return state;
  }

  if (action.type === 'LIKE') {
    const liker = action.liker;
    const fotoAchada = state.find(foto => foto.id === action.fotoId)
    fotoAchada.likeada = !fotoAchada.likeada;
    const possivelLiker = fotoAchada.likers.find(likerAtual => likerAtual.login === liker.login);

    if (possivelLiker === undefined) {
      fotoAchada.likers.push(liker);
    } else {
      const novosLikers = fotoAchada.likers.filter(likerAtual => likerAtual.login !== liker.login);
      fotoAchada.likers = novosLikers;
    }
    return state;
  }

  return state;
}

