import React, { useEffect, useState } from 'react'

import './StateDisplay.style.css';
import { colors, getGlobalColors } from '../functions';
import { hover } from '@testing-library/user-event/dist/hover';
import ButtonReference from './util/KeyReference';


export default function StateDisplay(
  currentPiece = 0,
) {

  const c = getGlobalColors()


  const [data, setData] = useState(null)


  useEffect(() => {
    let foo = []
    getGlobalColors().map((col) => {
      let p = {
        c : col,
        index : foo.length,
        active : false,
        hoover : false,
      }
      foo.push(p)
    })
    foo[0].active = true
    foo[0].hoover = true
    setData(foo)
  }, [])

  useEffect(() => {
    console.log("currentPiece");
    console.log(currentPiece);
    updateCurrentPiece(currentPiece.currentPiece, currentPiece.pieceIsSelected)
  }, [currentPiece])


  function updateCurrentPiece(id, active) {
    if (data === null) {
      return
    }
    let foo = []
    data.map((p) => {
      foo.push({
        c : p.c,
        index : p.index,
        active : false,
        hoover : false,
      })
    })
    foo[id].active = true
    foo[id].hoover = active

    setData(foo)
    console.log(foo)
  }






  if (data === null) {
    return <></>
  }

  return (
    <div className='ActivePieceColors'>
      {
        data.map((piece) => {
          return (
            <PieceColor
              data={piece}
            />
          )
        })
      }
    </div>
  )
}

function PieceColor({
  data = null,
}) {

  const [d, setD] = useState(null)



  
  useEffect(() => {
    setD(data)
  }, [])
  
  useEffect(() => {
    setD(data)
  }, [data])


/* 
  
  useEffect(() => {
    if (data === null) {
      return
    }
    setColor(data.c)
    setActive(data.active)
  }, [])
 */
  if (d === null) {
    return <></>
  }

  console.log(d);
  console.log(d.index);

  if (!d.active) {
    return (
      <div className='ActivePieceContainer'>
        <svg width="70" height="70">
          <circle cx="35" cy="35" r="24" fill={"black"} />
          <svg width="70" height="70">
            <circle cx="35" cy="35" r="22" fill={d.c} />
          </svg>
        </svg>
        <ButtonReference v={d.index} />

      </div>
    )
  }


  return (
    <div className='ActivePieceContainer'>
        <svg width="70" height="70">

          <circle cx="35" cy="35" r="34" fill={"black"} />
          <circle cx="35" cy="35" r="32" fill={d.hoover ? d.c : "black"} />
          <svg width="70" height="70">
            <circle cx="35" cy="35" r="28" fill={d.c} />
          </svg>
      </svg>
      <ButtonReference v={d.index} />

    </div>
  )




}



