import React, { useRef, useEffect, useState } from 'react';
import Board from '../board/Board';


import './Hub.style.css';
import { robots } from '../../functions.utils';
import Piece from '../util/Piece';
import { handleDirectionEvent, initialGameState, initialProps, pieceIdSelected } from '../board/functions.Board';


export default function Hub({
  robots = 4,
}) {


  const hubRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: null, height: null });
  const [moves, setMoves] = useState(null);
  const [tileData, setTileData] = useState(null);


  useEffect(() => {
    setTileData(initialProps())
  }, []);

/* 

  const [m, setM] = useState(null)
  const [c, setC] = useState(null)




  useEffect(() => {
    setC(getHubColor(id))
  }, [id]);

  useEffect(() => {
    setM(multiplier)
  }, [multiplier]);


  if (c === null || m === null) {
    return <></>
  }

 */

  useEffect(() => {
    // Update the dimensions when the Hub component changes
    if (hubRef.current) {
      const { offsetWidth, offsetHeight } = hubRef.current;
      setDimensions({ width: offsetWidth, height: offsetHeight });
    }
  }, []);



  function stateEvent(id) {
    console.log(id);

  }

  function pieceSelectorEvent(id) {
    console.log(id);
    setTileData(pieceIdSelected(id))
  }

  function directionMoveEvent(index) {
    console.log(index);
    let resp = handleDirectionEvent(index)
    if (resp !== null) {
      setTileData(resp)
    }
  }



  function keyEvent(e) {
    /* 
    console.log(e.key);
    console.log(e.keyCode);
    */
    console.log(e.key);
    console.log(e.keyCode);

    let value = 0

    switch (e.keyCode) {
      case 49:
      case 50:
      case 51:
      case 52:
        pieceSelectorEvent(e.keyCode - 49)
        return;
      case 65:
      case 37:
        value++;
      case 83:
      case 40:
        value++;
      case 68:
      case 39:
        value++;
      case 87:
      case 38:
        directionMoveEvent(value)
        return;

    
      default:
        break;
    }
  }

  if ([
    tileData,
  ].includes(null)) {
    return <></>
  }

  return (
    <div className='Hub' ref={hubRef}>
      <GameState click={stateEvent} moves={moves}/>
      <PieceSelector click={pieceSelectorEvent}/>
      <Board dimensions={dimensions} tileData={tileData}/>
      <EventListener clicked={keyEvent} />

    </div>
  );
}


function GameState({
  data = null,
  click,
  moves
}) {

  const [m, setM] = useState(null);

  useEffect(() => {
    setM(moves)
  }, [moves]);

  if (m === null) {
    return (
      <div className='GameState'>
        hallo
      </div>
    )
  }


  return (
    <div className='GameState'>
      hei


    </div>
  )
}



function PieceSelector({
  data = null,
  click,
  active,
}) {

  const [p, setP] = useState(null);

  useEffect(() => {
    let foo = []
    for (let i = 0; i < robots; i++) {
      foo.push({
        id : i,
        piece : <Piece id={i}  click={clicked} multiplier={1.5} />,
      })
    }
    setP(foo)
  }, []);

  function clicked(id) {
    click(id)
  }

  if (p === null) {
    return (
      <></>
    )
  }


  return (
    <div className='PieceSelector'>
      {
        p.map((e) => {
          return (
            <div className='PieceSelectorPiece'>
              <div className='KeyString'>
                <span style={{margin: 'auto'}}>
                  {e.id + 1}
                </span>
              </div>
              {e.piece}
            </div>
          )
        })
      }
    </div>
  )
}



function EventListener({
  clicked,
}) {




  useEffect(() => {
    const handleKeyDown = (e) => {
      clicked(e)
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    }
  }, []);

  return (
    <div>
      
    </div>
  )
}

