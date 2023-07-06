import { centerTileIds, colors, getColorStrength, getNextOffset, lightColors, rowLength } from "../../functions.utils"




let tiles = []
let pieces = []
let goals = []
let tileId = null
let moveEndPoints = []

let tileProps = []
let moveHistory = []



function initiateBoard() {
  
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
  
    let id = 0
    g.map((e) => {
      goals.push({
        pieceId : id,
        tileId : e.id,
      })
      id = (1 + id) % 4
      e.walls.map((i) => {
        wallBetween(e.id, tiles[e.id].next[i])
      })    
    })
  
  
    walls.map((w) => {
      wallBetween(w[0], w[1])
    })
  
  }


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

  initiateGoals()

  console.log(goals);
  let invalidIds = goals.concat(centerIds)


  pieces = []
  while (pieces.length !== colors.length) {
    let id = Math.floor((Math.random()*tiles.length))
    if (! invalidIds.includes(id)) {
      invalidIds.push(id)
      pieces.push(id)
    }
  }
  
  findPieceMoves(1);

}



export function handleTileClick(id) {

  if (pieces.includes(id)) {
    tileId = id

    

    return getPieceMovementProps(pieces.indexOf(id))
  }
  if (moveEndPoints.includes(id) && tileId !== null) {
    pieces[pieces.indexOf(tileId)] = id
    tileId = null
    moveEndPoints = []

    return addPiecesToProps(getCleanTileProps())
  }
  return tileProps

}

export function initialGameState() {
  moveHistory = []
  return getTileProps()
}



function getCleanTileProps() {
  let foo = []
  tiles.map((t) => {
    let p = {
      id : t.id,
      center : 'inherit',
      sides : [],
      event : null,
    }
    t.next.map((n) => {
      p.sides.push(n === null ? 'black' : 'inherit')
    })
    foo.push(p)
  })

  return addPiecesToProps(foo)
}





export function getTileProps() {

  function setTileProps() {
    if (tiles.length === 0) {
      initiateBoard()
    }

    tiles.map((t) => {
      let p = {
        id : t.id,
        center : 'inherit',
        sides : [],
        event : null,
      }
      t.next.map((n) => {
        p.sides.push(n === null ? 'black' : 'inherit')
      })
      tileProps.push(p)
    })


  }
  if (tileProps.length === 0) {
    setTileProps()
  }
  console.log(tileProps);
  return addPiecesToProps(tileProps)
}


export function getTileCorners() {

  if (tiles.length === 0) {
    initiateBoard()
  }

  let foo = []
  

  tiles.map((t) => {

    let c = ['inherit', 'inherit', 'inherit', 'inherit']
    for (let i = 0; i < 4; i++) {

      if (t.next[i] === null) {
        c[i] = 'black'
        c[(i + 1) % 4] = 'black'
      }

  /*     
      let bar = 'inherit'
      let index = [i, 3 - i]
      let ids = [t.next[index[0]], t.next[index[1]]]
      if (ids[0] === null || ids[1] === null) {
        bar = 'black'
      } else if (tiles[ids[0]].next[index[1]] === null && tiles[ids[1]].next[index[0]] === null){
        bar = 'black'
      }
      c.push(bar)
 */
    }
    loop:
    for (let i = 0; i < 4; i++) {
      if (c[i] === 'inherit') {

        let indexes = [(4 - (1 - i)) % 4, i]

        for (let j = 0; j < 2; j++) {
          let x = indexes[j]
          let y = indexes[1 - j]

          let nextId = t.next[x]
          let nextTile = tiles[nextId]
          if (nextTile.next[y] !== null) {
            continue loop
          }
        }
        c[i] = 'black'

      }


    }


    foo.push(c)
  })
  return foo

}


function addPiecesToProps(props = null, p = null) {
  if (props === null) {
    props = getTileProps()
  }
  let data = props.slice()

  if (p === null) {
    p = pieces.slice()
  }

  p.map((id) => {
    data[id].event = p.indexOf(id)
  })

  return data
}

function getPieceMovementProps(pieceId) {

  let id = pieces[pieceId]
  let moves = findPieceMoves(pieceId)


  let props = getCleanTileProps()

  props[id].center = getColorStrength(pieceId, 6)
  console.log(moves);
  moveEndPoints = []
  for (let i = 0; i < 4; i++) {
    let p = moves[i]
    if (p.length ===  0) {
      continue
    }
    moveEndPoints.push(p[p.length - 1])
    let tile = id
    for (let j = 0; j < p.length; j++) {
      props[tile].sides[i] = getColorStrength(pieceId, 6)
      tile = p[j]
      props[tile].sides[(i + 2) % 4] = getColorStrength(pieceId, 6)
      props[tile].center = getColorStrength(pieceId, 6)
    }
    props[tile].center = getColorStrength(pieceId, 3)

  }
  console.log(moveEndPoints);
  return props
}


export function pieceSelected(pieceId) {
  if (tiles.length === 0) {
    initiateBoard()
  }

  let id = pieces[pieceId]
  let moves = findPieceMoves(pieceId)


  let props = getCleanTileProps()

  props[id].center = lightColors[pieceId]
  console.log(moves);
  for (let i = 0; i < 4; i++) {
    let p = moves[i]
    if (p.length ===  0) {
      continue
    }
    let tile = id
    for (let j = 0; j < p.length; j++) {
      props[tile].sides[i] = lightColors[pieceId]
      tile = p[j]
      props[tile].sides[(i + 2) % 4] = lightColors[pieceId]
      props[tile].center = lightColors[pieceId]
    }
    props[tile].center = colors[pieceId]

  }
  return props
}


function findPieceMoves(pieceId, piecesLocation = pieces) {
  let id = piecesLocation[pieceId]
  let t = tiles[id]
  let moves = getTileRoute(id).slice()
  console.log(moves);
  console.log(piecesLocation);


  for (let i = 0; i < piecesLocation.length; i++) {
    if (i === pieceId) {
      continue
    }
    let pId = piecesLocation[i]
    moves.map((d) => {
      if (d.includes(pId)) {
        let foo = []
        let found = false
        d.map((tile) => {
          if (!found) {
            if (tile === pId) {
              found = true
            } else {
              foo.push(tile)
            }
          }
        })
        moves[moves.indexOf(d)] = foo.slice()
      }
    })
    
    
  }
  return moves
}


function getTileRoute(id) {
  console.log(id);
  
  let moves = []
  let t = tiles[id]

  for (let i = 0; i < t.next.length; i++) {
    let dir = []
    let n = t.next[i]
    while (n !== null) {
      dir.push(n)
      n = tiles[n].next[i]
    }
    moves.push(dir)
  }
  return moves

}





