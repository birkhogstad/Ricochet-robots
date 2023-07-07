


let game = {
  live : false,
  moves : null,
}



export function gameIsLive() {
  return game.live
}


export function initRoundState() {
  game.live = true
  game.moves = 0
}

export function roundState() {
  return game
}

export function setMoves( v = -1) {
  if (v === -1) {
    game.moves++
  }
}