import React, { useEffect, useState } from 'react'

import { colors, enums, getWalls, initiatePieces, initiatePiecesLocation } from '../functions'


import './Grid.style.css';


export default function Grid() {
  const [walls, setWalls] = useState(null)
  const [tiles, setTiles] = useState(null)
  const [pieces, setPieces] = useState(null)



  useEffect(() => {
    let w = getWalls()
    console.log(w);
    setWalls(w)

    let t = []
    for (let i = 0; i < 16; i++) {
      t.push([])
      let k = i * 16
      for (let j = 0; j < 16; j++) {
        t[i].push(k + j)
      }
    }
    setTiles(t)



    let foo = []
    colors.map((c) => {
      foo.push((<Piece color={c} />))
    })




    let bar = []
    let piecesLocation = initiatePiecesLocation()
    for (let i = 0; i < enums.tiles; i++) {
      let p = null
      if (piecesLocation.includes(i)) {
        for (let j = 0; j < piecesLocation.length; j++) {
          if (piecesLocation[j] === i) {
            p = foo[j]
          }
        }
      }
      bar.push(p)
    }


    

    setPieces({
      pieces : foo,
      tiles : bar,
    })

  }, [])

  if (tiles === null || walls === null || pieces === null) {
    return <></>
  }

  return (
    <div className='Grid'>
      {
        tiles.map((r) => {
          return(
            <div className='Row'>
              {
                r.map((id) => {
                  return (
                    <Tile 
                      id={id} 
                      walls={walls[id].walls} 
                      piece={pieces.tiles[id]}
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
  walls = [],
  id = 0,
  event = 0,
  piece = null,
}) {

  const [w, setW] = useState(null)
  const [p, setP] = useState(null)

  useEffect(() => {
    setW(walls)
    setP(piece)
  }, [])

  useEffect(() => {
    setP(piece)
  }, [piece])







  if (w === null) {
    return <></>
  }

  let foo = []

  if (w.includes("NORTH")) {
    foo.push("NorthWall")
  }
  if (w.includes("SOUTH")) {
    foo.push("SouthWall")
  }
  if (w.includes("EAST")) {
    foo.push("EastWall")
  }
  if (w.includes("WEST")) {
    foo.push("WestWall")
  }


  return (
    <div className='TileBorder'>
      <div className='Tile'>
        {
          foo.map((c) => {
            return ( <div className={c}></div>)
          })
        }

        <div className='TileCenter'>
          <span style={{
            margin: "auto"
          }}>
            {
              p === null 
              ? id
              : p
            }

          </span>
        </div>


     
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
    <svg width="40" height="40">
      <circle cx="20" cy="20" r="16" fill={c} />
    </svg>
  )
  
  
}




