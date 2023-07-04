import React, { useRef, useEffect, useState } from 'react';
import { initiateTiles } from './functions.Board';
import { centerTileIds, colors, rowLength } from '../../functions.utils';


import './Board.style.css';


export default function Board({

}) {


  const [tileWalls, setTileWalls] = useState(null)
  const [tilePaths, setTilePaths] = useState(null)
  const [tileContainer, setTileContainer] = useState(null)
  const [tileIds, setTileIds] = useState(null)

  const [pieces, setPieces] = useState(null)
  const [piecesAtId, setPiecesAtId] = useState(null)


  useEffect(() => {
    let ids = []
    let id = 0
    for(let i = 0; i < rowLength; i++) {
      let r = []
      for (let j = 0; j < rowLength; j++) {
        r.push(id)
        id++
      }
      ids.push(r)
    }
    setTileIds(ids)

    let p = []
    colors.map((c) => {
      p.push((<Piece color={c} />))
    })

    setPieces(p)
    setInitialBoard(p)
  }, [])

 

  function setInitialBoard(pcs = pieces) {

    let classes = [
      'North',
      'East',
      'South',
      'West',
    ]

    let wallData = []
    let pathData = []
    let containerData = []

    initiateTiles().map((t) => {
      let w = []
      let p = []
      for (let i = 0; i < t.next.length; i++) {
        let c = classes[i]
        if (t.next[i] === null) {
          w.push('Wall' + c)
        } else {
          p.push({
            index : i,
            class : 'Path' + c,
            color : 'lightgray',
          })
        }
      }
      containerData.push(null)
      wallData.push(w)
      pathData.push(p)
    }) 
    containerData[17] = pcs[0]
    containerData[174] = pcs[1]
    containerData[212] = pcs[2]
    containerData[203] = pcs[3]
    setTileContainer(containerData)
    setTileWalls(wallData)
    setTilePaths(pathData)
  }


  if (tileIds === null || tileWalls === null || pieces === null || tileContainer === null) {
    return <></>
  }


  console.log(pieces);

  return (
    <div className='Board'>
      {
        tileIds.map((r) => {
          return (
            <div className='Row'>
              {
                r.map((id) => {
                  return (
                    <Tile
                      id={id}
                      walls={tileWalls[id]}
                      paths={tilePaths[id]}
                      contains={tileContainer[id]}

                    />
                  )
                })
              }
            </div>
          )
        })
      }
      
    </div>
  )
}


function Tile({
  walls,
  id,
  paths,
  contains = null,
}) {

  const [p, setP] = useState([])
  const [c, setC] = useState(null)


  useEffect(() => {
    setP(paths)
  },[paths])

  useEffect(() => {
    if (contains === null) {
      setC(id)
      return
    }
    setC(contains)
  },[contains])

  
  if (centerTileIds.includes(id)) {
    return(
      <div className='Tile'
        style={{
          backgroundColor : "darkgreen"
        }}
      ></div>
    )
  }


  return(
    <div className='Tile'>
      {
        walls.map((w) => {
          return (
            <div className={w}></div>
          )
        })
      }
      {
        p.map((v) => {
          return (
            <div 
              className={v.class}
              style={{
                backgroundColor : v.color
              }}
            ></div>
          )
        })
      }


      <div className='TileCenter'>
        <span style={{
          margin: "auto",
        }}>
          {c}
        </span>
      </div>
    
    </div>


  )
  
}




function Piece({
  color = "red",
}) {

  const [c, setC] = useState(null)

  useEffect(() => {
    setC(color)
  }, [])


  return (
    <svg width="40" height="40" className='Piece'>
      <circle cx="20" cy="20" r="16" fill={c} />
    </svg>
  )
  
  
}



