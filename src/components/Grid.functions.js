import { colors, enums } from "../functions"



export function addToPath(tiles = null, move = null, pieceIndex = 0) {
  if (tiles === null) {
    tiles = []
    for (let i = 0; i < enums.tiles; i++) {
      tiles.push([])
    }
  }

  
  if (move !== null) {
    let c = colors[pieceIndex]
    
    let move = math.sort().reverse()
    let multiplier = (move[1] - move[0]) % 16 === 0 ? 16 : 1
    let ids = []

    let cur = move[0]
    let d = []
    while (cur <= move[1]) {
      let p = {
        c : c,
        o : 60,
        i : d,
      }
      d.push(multiplier % 16)

    }






  }


  return tiles
  
}