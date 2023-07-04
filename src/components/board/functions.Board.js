import { centerTileIds, getNextOffset, rowLength } from "../../functions.utils"




let tiles = []
let pieces = []
let goals = []



export function initiateTiles() {
  tiles = []

  let nextOffset = getNextOffset()
  let id = 0
  for(let i = 0; i < rowLength; i++) {
    for (let j = 0; j < rowLength; j++) {
      
      let t = {
        id : id,
        next : nextOffset.map((offset) => id + offset),
        wall : [
          j,
          (rowLength - 1) + (i * rowLength),
          rowLength * (rowLength) + j,
          i * rowLength,
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

      if (t.next[3] % rowLength === (rowLength - 1)) {
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

  initiateGoals()
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

function wallBetween(a, b) {
  console.log(a, b);
  if (a === null || b === null) {
    return
  }
  for (let i = 0; i < 4; i++) {
    if (tiles[a].next[i] === b) {
      setWall(a, i)
      setWall(b, (i + 2) % 4)
      return
    }
  }
}


function initiateGoals() {




  goals = []
  let g = [
    {
      id : 99,
      walls : [
        3, 2
      ]
    },
    {
      id : 20,
      walls : [
        0, 3
      ]
    },
    {
      id : 33,
      walls : [
        0, 1
      ]
    },
    {
      id : 54,
      walls : [
        1, 2
      ]
    },


    {
      id : 41,
      walls : [
        1, 2
      ]
    },
    {
      id : 29,
      walls : [
        0, 3
      ]
    },
    {
      id : 94,
      walls : [
        2, 3
      ]
    },
    {
      id : 107,
      walls : [
        0, 1
      ]
    },


    {
      id : 145,
      walls : [
        1, 2
      ]
    },
    {
      id : 213,
      walls : [
        0, 1
      ]
    },
    {
      id : 164,
      walls : [
        2, 3
      ]
    },
    {
      id : 227,
      walls : [
        0, 3
      ]
    },


    {
      id : 218,
      walls : [
        0, 3
      ]
    },
    {
      id : 168,
      walls : [
        0, 1
      ]
    },
    {
      id : 189,
      walls : [
        2, 3
      ]
    },
    {
      id : 158,
      walls : [
        1, 2
      ]
    },
  ]

  let walls = [
    [1,2],
    [80, 96],

    [11, 12],
    [63, 79],

    [176, 192],
    [246, 247],

    [175, 191],
    [251, 252]
  ]

  g.map((e) => {
    goals.push(e.id)
    e.walls.map((i) => {
      wallBetween(e.id, tiles[e.id].next[i])
    })    
  })


  console.log(goals);

  walls.map((w) => {
    wallBetween(w[0], w[1])
  })

}


export function setPiecesLocation() {

  pieces = [68]
  return pieces
}


