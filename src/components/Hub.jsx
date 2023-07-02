import React, { useRef, useEffect, useState } from 'react';
import { getGlobalColors } from '../functions';
import StateDisplay from './StateDisplay';
import Grid from './Grid';
import { getPieceData, handleDirectionEvent, handleSelectedEvent, setInitialData, setPieceData } from './Hub.functions';
import EventListener from './EventListener';

function Hub() {



  const [data, setData] = useState(null)
  const [piece, setPiece] = useState(null)


  
  useEffect(() => {
    
    setData(setInitialData())
    setPiece(getPieceData())

    console.log([14, 122].sort());
    
  }, [])


  function clicked(e) {
    console.log(e);
    let value = 0
      let type = null
      switch (e.code) {
        case 'KeyA':
          value++
        case 'KeyS':
          value++
        case 'KeyD':
          value++
        case 'KeyW':
          value++
          type = 'direction'
          break;

        case 'Enter':
        case 'Space':
          if (!piece.selected) {
            let resp = handleSelectedEvent()
            if (resp !== null) {
              console.log(resp);
              let o = {
                index : resp.index,
                selected : resp.selected
              }
              setPiece(o)
            }
          }
   
          return

        default:
            return
          break;
      }

      if (type === 'direction') {
        let resp = handleDirectionEvent(value - 1)
        if (resp !== null) {
 
          let p = getPieceData()
          let o = {
            index : p.index,
            selected : p.selected
          }
          setPiece(o)
        }
      }
  }

  if (data === null) {
    return <></>
  }



  return (
    <div
      style={{
        width: "100%",
        height: "100%",
      }}
    >
      <EventListener clicked={clicked} />
      <StateDisplay currentPiece={piece.index} pieceIsSelected={piece.selected}/>
      <Grid />
    </div>
  )
}

export default Hub
