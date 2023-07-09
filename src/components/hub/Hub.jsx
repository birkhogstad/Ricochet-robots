import React, { useRef, useEffect, useState } from 'react';
import Board from '../board/Board';


import './Hub.style.css';
import { live, robots, roundMoves, rowLength, toggleLive } from '../../functions.utils';
import Piece from '../util/Piece';
import { gameIsLive, getMoveData, handleDirectionEvent, handleTileClick, initialGameState, initialProps, initiateRound, liveRound, pieceIdSelected, resetRound, startRound, undoMove } from '../board/functions.Board';
import { initRoundState, roundState } from '../functions.Game';
import Toolbar from '../toolbar/Toolbar';


export default function Hub({
  robots = 4,
}) {


  const hubRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: null, height: null });
  const [moves, setMoves] = useState(null);
  const [tileData, setTileData] = useState(null);


  useEffect(() => {
    handleResponse(initialProps(false))
  }, []);

  useEffect(() => {
    // Update the dimensions when the Hub component changes
    if (hubRef.current) {
      const { offsetWidth, offsetHeight } = hubRef.current;
      setDimensions({ width: offsetWidth, height: offsetHeight });
    }
  }, []);


  function handleResponse(resp) {
    console.log(resp);
    if (resp === null) {
      return
    }
    if (resp.length === rowLength * rowLength) {
      setTileData(resp)
    }

    setMoves(getMoveData())
  

  }



  function stateEvent(id) {
    console.log(id);
    switch (id) {
      case 0:
        handleResponse(initiateRound())
        break;
    
      case 1:
        handleResponse(resetRound())
        break;
    
      case 2:
        handleResponse(undoMove())
        break;
    
      default:
        break;
    }
  }

  function tileClickEvent(id) {
    if (gameIsLive()) {
      handleResponse(handleTileClick(id))
    }
  }

  function pieceSelectorEvent(id) {
    console.log(id);
    if (gameIsLive()) {
      handleResponse(pieceIdSelected(id))
    }
  }

  function directionMoveEvent(index) {
    if (gameIsLive()) {
      handleResponse(handleDirectionEvent(index))
    }
  }




  function keyEvent(e) {
    /* 
    console.log(e.key);
    console.log(e.keyCode);
    */
    console.log(e.key);
    console.log(e.keyCode);

    if (!gameIsLive()) {
      if (e.keyCode === 13 || e.keyCode === 32) {
        stateEvent(0)
      } 
      if (e.keyCode === 82 && liveRound()) {
        stateEvent(1)
      }
      return
    }

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
      case 82:
        stateEvent(1)
        return;
      case 8:
        stateEvent(2)
        return;
      case 13:
      case 32:
        if (getMoveData().best !== null) {
          stateEvent(0)
        }
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
      <Toolbar click={stateEvent} moveData={moves}/>
      <div className='Body'>
        <PieceSelector click={pieceSelectorEvent}/>
        <Board dimensions={dimensions} tileData={tileData} click={tileClickEvent}/>
        <EventListener clicked={keyEvent} />
      </div>
    </div>
  );
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

