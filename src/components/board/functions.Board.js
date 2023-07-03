import { centerTileIds, getNextOffset, rowLength } from "../../functions.utils"




let tiles = []



export function initiateTiles() {
  tiles = []

  let nextOffset = getNextOffset()
  let id = 0
  for(let i = 0; i < 16; i++) {
    for (let j = 0; j < 16; j++) {
      
      let t = {
        id : id,
        next : nextOffset.map((offset) => id + offset),
        wall : [
          j,
          15 + (i * 16),
          240 + j,
          i * 16,
        ],
      }

      for (let i = 0; i < t.next.length; i++) {
        if (t.next[i] < 0 || t.next[i] >= rowLength * rowLength) {
          t.next[i] = null
          t.wall[i] = null
        }
      }

      if ((t.next[1]) % rowLength === 0) {
        t.next[1] = null
        t.wall[1] = null
      }

      if (t.next[3] % rowLength === 15) {
        t.next[3] = null
        t.wall[3] = null
      }
      tiles.push(t)
      id++
    }
  }

  let centerIds = centerTileIds


  centerIds.map((t) => {
    let tile = tiles[t]
    for (let i = 0; i < 4; i++) {
      let n = tile.next[i]
      if (n !== null) {
        if (! centerIds.includes(n)) {
          setWall(n, (i + 2) % 4)
          tile.next[i] = null
        }
      }
      tile.wall[i] = null
    }
  })





  console.log(tiles);
  return tiles

}


function setWall(id, index) {


  tiles[id].next[index] = null
  tiles[id].wall[index] = null


  let t = tiles[id].next[(index + 2) % 4]
  while(t !== null) {

    let tile = tiles[t]
    let foo = []
    for (let i = 0; i < tile.wall.length; i++) {
      let bar = tile.wall[i]
      if (i === index) {
        bar = id
      }
      foo.push(bar)
    }
    tile.wall = foo.slice()
    tiles[t] = tile
    t = tiles[t].next[(index + 2) % 4]
  }
}