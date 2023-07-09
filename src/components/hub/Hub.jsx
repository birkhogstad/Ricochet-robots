import React, { useRef, useEffect, useState } from 'react';
import Board from '../board/Board';


import './Hub.style.css';
import { live, robots, roundMoves, rowLength, toggleLive } from '../../functions.utils';
import Piece from '../util/Piece';
import { gameIsLive, getMoveData, handleDirectionEvent, handleTileClick, initialGameState, initialProps, initiateRound, liveRound, pieceIdSelected, resetRound, showBest, startRound, undoMove } from '../board/functions.Board';
import Toolbar from '../toolbar/Toolbar';


export default function Hub({
  robots = 4,
}) {


  const hubRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: null, height: null });
  const [moves, setMoves] = useState(null);
  const [tileData, setTileData] = useState(null);

  useEffect(() => {
    handleResponse(initialProps(false));
  }, []);

  useEffect(() => {
    // Update the dimensions when the Hub component changes
    if (hubRef.current) {
      const { offsetWidth, offsetHeight } = hubRef.current;
      setDimensions({ width: offsetWidth, height: offsetHeight });
    }
  }, []);

  function handleResponse(resp) {
    if (resp === null) {
      return;
    }
    if (resp.length === rowLength * rowLength) {
      setTileData(resp);
    }

    setMoves(getMoveData());
  }

  function showBestRoute() {
    let p = showBest(null);

    const delay = 500; 

    const iterate = () => {
      if (p !== null) {
        setTileData(p);


        setTimeout(() => {
          p = showBest(p);
          setMoves(getMoveData())
          iterate();
        }, delay);
      }
    };

    iterate();
  }






  function stateEvent(id) {
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

      case 10:
        if (getMoveData().best !== null) {
          showBestRoute()
        }

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
    <div 
      className='Hub' 
      ref={hubRef}
      style={{
        backgroundColor: "burlywood",
        position: "fixed",
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
      }}  
    >
      <Toolbar buttonClick={stateEvent} moveData={moves} pieceClick={pieceSelectorEvent} pieces={robots}/>
      <div className='Body'>
        <Board dimensions={dimensions} tileData={tileData} click={tileClickEvent}/>
        <EventListener clicked={keyEvent} />
      </div>
    </div>
  );
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



