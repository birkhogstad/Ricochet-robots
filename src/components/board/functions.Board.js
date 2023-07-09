import { colorScaleValues, getColor } from "../../colors"
import { centerTileIds, getColorStrength, getNextOffset, getTargetPropSides, robots, rowLength } from "../../functions.utils"




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
  record : [],
  show : [],
  freeze : true
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
    live : gameState.live,
    freeze : moveData.freeze,
  }
}

function backTraceMoves() {
  let foo = moveData.history.reverse()

  foo.map((m) => {
    pieces[m.pieceId] = m.from
  })
  moveData.history = []
  moveData.count = 0
}

export function showBest(props = null) {

  if (props === null) {
    gameState.live = false
    backTraceMoves()
    moveData.freeze = true
  
    let moves = []
    let count = 0
    moveData.record.map((m) => {
      let c = {
        id : moves.length,
        tiles : getTileIdsPath(m.from, m.to),
        dir : getNextIndex(m.from, m.to),
        pieceId : m.pieceId,
      }
      count += c.tiles.length
      moves.push(c)
    })
    colorScaleValues(count, moves)
    moveData.show = moves.slice().reverse()
  
    props = initialProps()
    moveData.history = moveData.record.slice()
    return props
  }

  if (moveData.show.length === 0) {
    moveData.show = null
    moveData.freeze = false
    return null
  }


  let m = moveData.show.pop()


  props[pieces[m.pieceId]].event = null
  pieces[m.pieceId] = m.tiles[m.tiles.length - 1]
  props[pieces[m.pieceId]].event = m.pieceId




  props[m.tiles[0]].center = m.colors[0]
  for (let i = 1; i < m.tiles.length; i++) {
    let t = m.tiles[i]
    let c = m.colors[i]
    props[t].center = c
    props[t].sides[(6 + m.dir) % 4] = c
    props[m.tiles[i - 1]].sides[m.dir] = m.colors[i - 1]
  }
  
  moveData.count++
  return props

  
}


export function setInitialState(id) {

  if (id === 1) { // RESET ROUND
    backTraceMoves()
    gameState.live = true
  }
  else if (id === 0) { // INIT NEW ROUND
    gameState.live = true
    moveData.freeze = false
  
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
    
      target = goals[1]
    } else {
      target = goals[(goals.indexOf(target) + 1) % goals.length]
    }
  }
  gameState.round = true
  if (pieces.length === 0) {
    let invalidIds = centerTileIds.concat(goals.map((g) => g.tileId))  
    pieces = []
    while (pieces.length !== robots) {
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
  return boardEvent(m.from)

}

export function initialProps(includePieces = true, r = null) {
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
    if (r === null) {
      r = pieces
    }
    r.map((id) => {
      foo[id].event = r.indexOf(id)
    })

    addTargetProp(foo)
  }
  return foo
}



export function boardEvent(id, key = 0) {
  if (key === 1) {
    if (moveEndPoints.length === 0 || moveEndPoints[id] === null) {
      return null
    }
    id = moveEndPoints[id]
  }

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
          moveData.record = moveData.history.slice()
          endState = pieces.slice()
        }
        gameState.live = false
        return initialProps()
      }
    }

    // PIECE STILL ACTIVE FOR NEXT MOVE
    return boardEvent(id)
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
  let props = initialProps()
  let c = getColor(pieceId, 220)
  props[tileId].center = c
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
      props[tile].sides[i] = c
      tile = p[j]
      props[tile].sides[(i + 2) % 4] = c
      props[tile].center = c
    }
    props[tile].center = getColor(pieceId, 180)

  }
  addTargetProp(props)
  return props
}


function addTargetProp(props) {
  if (target !== null) {
    props[target.tileId].center = getColorStrength(target.pieceId, 4)
    let foo = [0, 1, 2, 3]
    foo.map((f) => {
      foo[f] = props[target.tileId].sides[f] === 'black' ? 'black' : getTargetPropSides(target.pieceId)
    })
    props[target.tileId].sides = foo
  }
}


function getNextIndex(a,b) {
  let offset = (a % rowLength) === (b % rowLength) ? 2 : 1

  return a < b ? offset : (offset + 2) % 4
}


function getTileIdOffset(a,b) {
  let offset = (a % rowLength) === (b % rowLength) ? rowLength : 1
  return offset * (b < a ? -1 : 1)
}



function getTileIdsPath(a, b) {
  let offset = getTileIdOffset(a, b)
  let arr = [a]
  while (arr[arr.length - 1] !== b) {
    arr.push(arr[arr.length - 1] + offset)
  }
  return arr
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
