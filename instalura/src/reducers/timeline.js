/* 
  action => contém o payload
  state = vem o último estado
*/

export function timeline(state = [], action) {
  if (action.type === 'LISTAGEM') {
    return action.fotos;
  }

  if (action.type === 'COMENTARIO') {
    const fotoAchada = state.find(foto => foto.id === action.fotoId);
    fotoAchada.comentarios.push(action.novoComentario);
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

