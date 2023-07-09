import React, { useRef, useEffect, useState } from 'react';
import { centerTileIds, colors, rowLength } from '../../functions.utils';


import './Board.style.css';
import { getTileCorners} from './functions.Board';
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
    setData(tileData)
  },[tileData])

  useEffect(() => {
    let foo = Math.floor(Math.min(dimensions.width, Math.floor(dimensions.height * 0.8)) / rowLength)
    setS(Math.max(foo, 50))
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
}