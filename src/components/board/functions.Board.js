import { centerTileIds, colors, getColorStrength, getNextOffset, getTargetPropSides, lightColors, live, roundMoves, rowLength } from "../../functions.utils"
import { initRoundState, setMoves } from "../functions.Game"




let tiles = []
let pieces = []
let goals = []
let tileId = null
let moveEndPoints = []


let target = null


let gameState = {
  live : false,
  round : false,
}

let moveData = {
  best : null,
  count : null,
  history : [],
}

let endState = null


export function gameIsLive() {
  return gameState.live
}

export function liveRound() {
  return gameState.round
}


export function getMoveData() {
  return {
    count : moveData.count,
    best : moveData.best,

  }
}

export function resetRound() {
  let foo = moveData.history.reverse()

  foo.map((m) => {
    pieces[m.pieceId] = m.from
  })

  moveData.history = []
  moveData.count = 0
  gameState.live = true
  console.log(pieces);
  return startRound()
}

export function initiateRound() {
  gameState.live = true

  if (endState !== null) {
    pieces = endState.slice()
  }

  moveData = {
    best : null,
    count : 0,
    history : [],
  }

  // Infinite rounds

  if (target === null || goals.indexOf(target) === 0) {
    for (let i = goals.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [goals[i], goals[j]] = [goals[j], goals[i]];
    }
    console.log(goals);
    target = goals[1]
  } else {
    target = goals[(goals.indexOf(target) + 1) % goals.length]
  }
  return startRound()
}

export function startRound() {
  gameState.round = true
  if (pieces.length === 0) {
    let invalidIds = centerTileIds.concat(goals.map((g) => g.tileId))  
    pieces = []
    while (pieces.length !== colors.length) {
      let id = Math.floor((Math.random()*tiles.length))
      if (! invalidIds.includes(id)) {
        invalidIds.push(id)
        pieces.push(id)
      }
    }
    
  }


  return initialProps()
}

export function undoMove() {


  if ( moveData.count === null || moveData.count === 0) {
    return null
  }

  gameState.live = true
  moveData.count --
  let m = moveData.history.pop()

  pieces[m.pieceId] = m.from
  return handleTileClick(m.from)

}

export function initialProps(includePieces = true, p = null) {
  if (tiles.length === 0) {
    initiateBoard()
  }
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

  if (includePieces) {
    return finalizeProps(foo)
  }

  return foo

}

function finalizeProps(props, includePieces = true, p = null) {
  if (includePieces) {
    if (p === null) {
      p = pieces
    }
    p.map((id) => {
      props[id].event = p.indexOf(id)
    })
  }

  if (target !== null) {
    props[target.tileId].center = getColorStrength(target.pieceId, 4)
    let foo = [0, 1, 2, 3]
    foo.map((f) => {
      foo[f] = props[target.tileId].sides[f] === 'black' ? 'black' : getTargetPropSides(target.pieceId)
    })
    props[target.tileId].sides = foo
  }
  return props
}






export function handleDirectionEvent(index) {
  if (moveEndPoints.length === 0 || moveEndPoints[index] === null) {
    return null
  }
  return handleTileClick(moveEndPoints[index])
}





export function handleTileClick(id) {
  if (pieces.includes(id)) {
    return pieceIdSelected(pieces.indexOf(id))
  }



  if (moveEndPoints.includes(id) && tileId !== null) {

    let pieceId = pieces.indexOf(tileId)
    moveData.history.push({
      pieceId : pieceId,
      from : tileId,
      to : id,
    })
    moveData.count ++

    pieces[pieceId] = id

    if (target !== null) {
      if (target.pieceId === pieceId && target.tileId === id) {
        if (moveData.best === null || moveData.count < moveData.best) {
          moveData.best = moveData.count
          endState = pieces.slice()
        }
        gameState.live = false
        return initialProps()
      }
    }

    // PIECE STILL ACTIVE FOR NEXT MOVE
    return handleTileClick(id)
    // NO PIECE ACTIVE FOR NEXT MOVE
    /* 
    pieces[pieces.indexOf(tileId)] = id
    tileId = null
    moveEndPoints = []
    return initialProps()
    */
  }
  return null
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



function findPieceMoves(pieceId, piecesLocation = pieces) {
  let id = piecesLocation[pieceId]
  let moves = getTileRoute(id).slice()
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


export function pieceIdSelected(pieceId) {
  tileId = pieces[pieceId]
  let moves = findPieceMoves(pieceId)
  let props = initialProps(false)
  props[tileId].center = getColorStrength(pieceId, 8)
  moveEndPoints = []
  for (let i = 0; i < 4; i++) {
    let p = moves[i]
    if (p.length ===  0) {
      moveEndPoints.push(null)
      continue
    }
    moveEndPoints.push(p[p.length - 1])
    let tile = tileId
    for (let j = 0; j < p.length; j++) {
      props[tile].sides[i] = getColorStrength(pieceId, 8)
      tile = p[j]
      props[tile].sides[(i + 2) % 4] = getColorStrength(pieceId, 8)
      props[tile].center = getColorStrength(pieceId, 8)
    }
    props[tile].center = getColorStrength(pieceId, 6)

  }
  return finalizeProps(props)
}




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

    for (let i = goals.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [goals[i], goals[j]] = [goals[j], goals[i]];
    }

  
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

}
