import React, { useRef, useEffect, useState } from 'react';
import { initiateTiles } from './functions.Board';
import { centerTileIds, rowLength } from '../../functions.utils';


import './Board.style.css';


export default function Board({

}) {


  const [tileWalls, setTileWalls] = useState(null)
  const [tileIds, setTileIds] = useState(null)


  useEffect(() => {

    let ids = []

    let id = 0

    for(let i = 0; i < 16; i++) {
      let r = []
      for (let j = 0; j < 16; j++) {
        r.push(id)
        id++
      }
      ids.push(r)
    }
    setTileIds(ids)
    setInitialBoard()
  }, [])

 

  function setInitialBoard() {
    let wallData = []
    let classes = [
      'WallNorth',
      'WallEast',
      'WallSouth',
      'WallWest',
    ]


    initiateTiles().map((t) => {
      let w = []
      for (let i = 0; i < t.next.length; i++) {
        if (t.next[i] === null) {
          w.push(classes[i])
        }
      }
      wallData.push(w)
    }) 
    setTileWalls(wallData)
  }


  if (tileIds === null || tileWalls === null) {
    return <></>
  }



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
}) {

  useEffect(() => {

  },[])

  if (centerTileIds.includes(id)) {
    return(

      <div className='Tile'
        style={{
          backgroundColor : "darkgreen"
        }}
      >
      </div>

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
      <div className='TileCenter'>
        <span style={{
          margin: "auto"
        }}>
          {id}
        </span>
      </div>
    
    </div>


  )
  
}

