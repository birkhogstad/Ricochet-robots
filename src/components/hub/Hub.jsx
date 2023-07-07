import React, { useRef, useEffect, useState } from 'react';
import Board from '../board/Board';


import './Hub.style.css';
import { live, robots, roundMoves, rowLength, toggleLive } from '../../functions.utils';
import Piece from '../util/Piece';
import { gameIsLive, getMoveData, handleDirectionEvent, handleTileClick, initialGameState, initialProps, initiateRound, pieceIdSelected, resetRound, startRound, undoMove } from '../board/functions.Board';
import { initRoundState, roundState } from '../functions.Game';


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

    if (gameIsLive()) {
      setMoves(getMoveData())
      
      
    }

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
      <GameState click={stateEvent} moves={moves} />
      <PieceSelector click={pieceSelectorEvent}/>
      <Board dimensions={dimensions} tileData={tileData} click={tileClickEvent}/>
      <EventListener clicked={keyEvent} />

    </div>
  );
}


function GameState({
  data = null,
  click,
  moves,
}) {

  const [m, setM] = useState(null);

  useEffect(() => {
    setM(moves)
  }, [moves]);

  



  function start() {
    click(0)
  }

  if (m === null) {
    return (
      <div className='GameState'>
        
        <button 
          type='button'
          onClick={(e) => start()}
          style={{
            backgroundColor : 'pink',
            padding : '0',
            border : '0',
            margin : 'auto',
            display : 'flex',
          }}
        >
          <h2 style={{margin : '1rem', fontSize : '30px'}}>Start</h2>


        </button>
      </div>
    )
  }


  return (
    <div className='GameState'>
              
      <button 
        type='button'
        onClick={(e) => click(1)}
        style={{
          backgroundColor : 'pink',
          padding : '0',
          border : '0',
          margin : 'auto',
          display : 'flex',
        }}
      >
        <h2 style={{margin : '1rem', fontSize : '30px'}}>Reset</h2>


      </button>
{/* 
              
      <button 
        type='button'
        onClick={(e) => click(0)}
        style={{
          backgroundColor : 'pink',
          padding : '0',
          border : '0',
          margin : 'auto',
          display : 'flex',
        }}
      >
        <h2 style={{margin : '1rem', fontSize : '30px'}}>{m.count}</h2>


      </button>
 */}

      <MoveDisplay data={m}/>

              
      <button 
        type='button'
        onClick={(e) => click(2)}
        style={{
          backgroundColor : 'pink',
          padding : '0',
          border : '0',
          margin : 'auto',
          display : 'flex',
        }}
      >
        <h2 style={{margin : '1rem', fontSize : '30px'}}>Undo</h2>


      </button>



{/* 
      <h2 style={{margin : 'auto', fontSize : '30px'}}>moves:</h2>
      <h2 style={{margin : 'auto', fontSize : '30px'}}>{moves}</h2>

 */}

    </div>
  )
}



function MoveDisplay({
  data,
}) {



  const [c, setC] = useState([]);
  const [b, setB] = useState([]);

  useEffect(() => {
    if (data === null) {
      return
    }
    setC(setDiv(data.count, 'moves'))
    setB(setDiv(data.best, 'best'))
  }, [data]);


  function setDiv(value, str) {

    if (value === null) {
      return []
    }

    return ([
      (    
        <div className='MoveDataValue' style={{backgroundColor : 'orange', fontSize : '30px'}}>

          <h2 style={{margin : 'auto', fontSize : '15px'}}>{str}</h2>
        </div>
      ),
      
      (
        <div className='MoveDataValue' style={{backgroundColor : 'yellow', fontSize : '30px', height : '60%'}}>

          <h2 style={{margin : 'auto', fontSize : '30px'}}>{value}</h2>
        </div>
      ),
    ])
  }





  return (
    <div className='MoveDisplay'>
      <div className='MoveDataDisplay' style={{backgroundColor : 'pink', fontSize : '30px'}}>
        {
          c.map((e) => {return (e)})
        }
      </div>
      <div className='MoveDataDisplay' style={{backgroundColor : 'pink', fontSize : '30px'}}>
        {
          b.map((e) => {return (e)})
        }
      </div>
    </div>
  )
/* 

  return (
    <div className='MoveDisplay'>
      <div className='MoveDataDisplay' style={{backgroundColor : 'pink', fontSize : '30px'}}>

        <div className='MoveDataValue' style={{backgroundColor : 'orange', fontSize : '30px'}}>

          <h2 style={{margin : 'auto', fontSize : '15px'}}>moves</h2>
        </div>
        <div className='MoveDataValue' style={{backgroundColor : 'yellow', fontSize : '30px', height : '60%'}}>

          <h2 style={{margin : 'auto', fontSize : '30px'}}>{c}</h2>
        </div>

      </div>



    </div>
  )
 */

  
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

