import React, { useRef, useEffect, useState } from 'react';
import { centerTileIds, colors, rowLength } from '../../functions.utils';


import './Board.style.css';
import { getTileCorners, getTileProps, handleTileClick, initialGameState, pieceSelected } from './functions.Board';
import Piece from '../util/Piece';


export default function Board({
  dimensions,
  tileData,
  click
}) {
  const [s, setS] = useState(null)

  const [nestedIds, setNestedIds] = useState(null)

  const [tileCorners, setTileCorners] = useState(null)
  const [data, setData] = useState(null)
  
  useEffect(() => {
    let ids = []
    let id = 0
    for (let i = 0; i < 16; i++) {
      let row = []
      for (let j = 0; j < 16; j++) {
        row.push(id)
        id++
      }
      ids.push(row)
    }
    setNestedIds(ids)

    setTileCorners(getTileCorners())
  },[])

  useEffect(() => {
    console.log(tileData);
    setData(tileData)
  },[tileData])

  useEffect(() => {
    let foo = Math.floor(Math.min(dimensions.width, Math.floor(dimensions.height * 0.8)) / rowLength)
    setS(Math.max(foo, 50))
    console.log(foo);
  },[dimensions])


  function clicked(id) {
    click(id)
  }



  if (
    [
      tileCorners,
      data,
    ].includes(null)
  ) { return <></> }

  return (
    <div className='Board'>
      {
        nestedIds.map((r) => {
          return (
            <div className='Row'>
              {
                r.map((id) => {
                  return (
                    <Tile 
                      data={data[id]}
                      corners={tileCorners[id]}
                      click={clicked}
                      sideSize={s}
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
  corners,
  data,
  click,
  sideSize
}) {

  const [d, setD] = useState(null)
  const [active, setActive] = useState(true)
  const [child, setChild] = useState(null)
  const [dimentions, setDimentions] = useState(null)

  
  useEffect(() => {
    setD(data)
    if (centerTileIds.includes(data.id)) {
      setActive(false)
    }

    

    if (data.event === null) {
      setChild ((<span style={{margin : 'auto', fontSize : '10px'}}>{data.id}</span>))
    }
    if (data.event !== null) {
      console.log(data.id);
      setChild ((<Piece id={data.event} />))
    }

  },[data])
  
  useEffect(() => {
    setDimentions(sideSize + 'px')
  },[sideSize])



  if (d === null) {
    return <></>
  }

  if (!active) {
    return(
      <div className='Tile' style={{backgroundColor : 'black', width : dimentions, height : dimentions}}></div>
    )
  }



  return(

    
        <button 
          className='TileButton'
          type='button'
          style={{width : dimentions, height : dimentions}}
          onClick={(e) => click(d.id)}
        >
        <div style={{display : 'flex', width : '100%', height : '10%'}}>
          <div className='TileCorner' style={{backgroundColor : corners[0]}}></div>
          <div style={{backgroundColor : d.sides[0], width : '80%', height : '100%'}}></div>
          <div className='TileCorner' style={{backgroundColor : corners[1]}}></div>
        </div>
        <div style={{display : 'flex', width : '100%', height : '80%'}}>
          <div style={{backgroundColor : d.sides[3], width : '10%', height : '100%'}}></div>
          <div style={{backgroundColor : d.center, width : '80%', height : '100%', display : 'flex'}}>
{/*   
              {child}
 */}
          {
            data.event === null ? (<span style={{margin : 'auto', fontSize : '10px'}}>{data.id}</span>)
            : (<Piece id={data.event} />)

          }
          </div>
          <div style={{backgroundColor : d.sides[1], width : '10%', height : '100%'}}></div>
        </div>
        <div style={{display : 'flex', width : '100%', height : '10%'}}>
          <div className='TileCorner' style={{backgroundColor : corners[3]}}></div>
          <div style={{backgroundColor : d.sides[2], width : '80%', height : '100%'}}></div>
          <div className='TileCorner' style={{backgroundColor : corners[2]}}></div>
        </div>
      </button>


  )
/* 
  return(

    
    <div className='Tile' style={{width : dimentions, height : dimentions}}>
        <button 
          className='TileButton'
          type='button'
          style={{width : dimentions, height : dimentions}}
          onClick={(e) => click(d.id)}
        >
        <div style={{display : 'flex', width : '100%', height : '10%'}}>
          <div className='TileCorner' style={{backgroundColor : corners[0]}}></div>
          <div style={{backgroundColor : d.sides[0], width : '80%', height : '100%'}}></div>
          <div className='TileCorner' style={{backgroundColor : corners[1]}}></div>
        </div>
        <div style={{display : 'flex', width : '100%', height : '80%'}}>
          <div style={{backgroundColor : d.sides[3], width : '10%', height : '100%'}}></div>
          <div style={{backgroundColor : d.center, width : '80%', height : '100%', display : 'flex'}}>
  
              {child}

          </div>
          <div style={{backgroundColor : d.sides[1], width : '10%', height : '100%'}}></div>
        </div>
        <div style={{display : 'flex', width : '100%', height : '10%'}}>
          <div className='TileCorner' style={{backgroundColor : corners[3]}}></div>
            <div style={{backgroundColor : d.sides[2], width : '80%', height : '100%'}}></div>
          <div className='TileCorner' style={{backgroundColor : corners[2]}}></div>
        </div>
      </button>
    </div>


  )
 */

  
}





/* 
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



 */