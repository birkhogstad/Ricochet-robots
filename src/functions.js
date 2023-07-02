
export const directions = {
  EAST: 0,
  SOUTH: 1,
  WEST: 2,
  NORTH: 3,
}

export const directionsKeys = [
  "EAST",
  "SOUTH",
  "WEST",
  "NORTH",
]


export const enums = {
  tiles: 16*16,
}

export const colors = [
  "red",
  "blue",
  "orange"
]

const globals = {
  colors :[
    "red",
    "blue",
    "orange"
  ]
}



let data = {
  tiles : [],
  pieces : [],
}


export function getInitialTiles() {

  let tiles = []

  for (let i = 0; i < 16 * 16; i++) {
    let tile = {
      id : i,
      contains: 0
    }
    let foo = [1, 16, -1, -16]

    let next = {}
    Object.keys(directions).map((d) => {
      next[d] = null
      let nextId = i + foo[directions[d]]

      if (nextId >= 0 && nextId < 16*16) {
        if (Math.abs((i % 16) - (nextId % 16)) + Math.abs(Math.floor(i / 16) - Math.floor(nextId / 16)) === 1) {
          next[d] = nextId
        }
      }

    })
    tile.next = next

    tile.end = {
      EAST: 16 * Math.floor(i / 16) + 15,
      SOUTH: 15 * 16 + (i % 16),
      WEST: 16 * Math.floor(i / 16),
      NORTH: (i % 16),
    }
    Object.keys(directions).map((d) => {
      if (tile.next[d] === null) {
        tile.end[d] = null
      } 

    })


    tiles.push(tile)
  }


  data.tiles = tiles.slice()
  console.log(tiles);


}


function additionalWalls(wallLocations = [
  [35, 36],
  [35, 51],
  [5, 6],
  [100, 84],
  [240, 241],
  [73, 74],

]) {

  let tiles = data.tiles.slice()
  
  wallLocations.map((x) => {
    let a = tiles[x[0]]
    let b = tiles[x[1]]
    directionsKeys.map((d) => {
      if (a.next[d] === b.id) {
        let dirs = [d, directionsKeys[(directions[d] + 2) % 4]]
        let blocked = [a, b]

        for (let i = 0; i < dirs.length; i++) {
          let t = blocked[i]
          console.log(t);
          t.next[dirs[i]] = null
          t.end[dirs[i]] = null
          let dir = dirs[1 - i]
          let n = t.next[dir]
          while(n !== null) {
            tiles[n].end[dirs[i]] = t.id
            n = tiles[n].next[dir]
          }
        }

      }
    })

  })
  data.tiles = tiles.slice()

  
}


export function getWalls() {

  if (data.tiles.length === 0) {
    getInitialTiles()
  }

  additionalWalls()

  let tiles = data.tiles.slice()
  console.log(tiles);
  
  let foo = []
  tiles.map((tile) => {
    let t = {
      id : tile.id,
      walls : []
    }
    directionsKeys.map((d) => {
      if (tile.next[d] === null) {
        t.walls.push(d)
      }
    })
    foo.push(t)
  })
  return foo

}







/**
 * 
 * PIECES
 * 
 */




export function initiatePiecesLocation() {
  let foo = [
    70,
    80,
    10,
  ]
  return foo
}





export function getGlobalColors() {
  return globals.colors
}