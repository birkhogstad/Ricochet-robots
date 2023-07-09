import React, { useEffect, useState } from 'react';

import './Toolbar.style.css';
import Piece from '../util/Piece';


export default function Toolbar({
  moveData,
  buttonClick,
  pieceClick,
  pieces
}) {



  const [m, setM] = useState([]);
  const [b, setB] = useState((<Button value='Start' id={0} click={clicked}/>));
  const [up, setUp] = useState([false, false, false, false, false, true]);


  
  useEffect(() => {
    setM(moveData)

    let foo = up.slice()

    
    if (moveData.freeze) {
      foo[3] = false
      foo[2] = false 
      foo[4] = false
    }
    else {
      if (moveData.count !== null && moveData.count !== 0) {
        foo[3] = true
        if (moveData.live) {
          foo[2] = true
        }
      } else {
        foo[3] = false
        foo[2] = false 
      }
      if (moveData.best !== null) {
        foo[4] = true
        foo[5] = true
      } else {
        foo[4] = false
        foo[5] = false
        if (moveData.count === null) {
          foo[5] = true
  
        }
      }

    }


    setUp(foo)

  }, [moveData]);

  function clicked(id) {

    buttonClick(id)
  }

  function pieceClicked(id) {
    pieceClick(id)
  }


  

  return (
    <div className='Toolbar'>
        <Button value='Game mechanics' id={4} click={clicked}  active={up[0]}/>
        <Button value='Controls' id={5} click={clicked} active={up[1]}/>
        <Button value='Undo move' id={2} click={clicked} active={up[2]}/>
        <Button value='Reset round' id={1} click={clicked} active={up[3]}/>
        <Button value='See best' id={10} click={clicked} active={up[4]}/>
        <Button value='New round' id={0} click={clicked} active={up[5]}/>


      <MoveData data={m}/>

      {
        m.count === null ? <></> : 
        <PieceSelector click={pieceClicked} pieces={pieces}/>
      }
      
    </div>
  )
}


function PieceSelector({
  pieces = 4,
  click,
}) {

  const [p, setP] = useState(null);


  useEffect(() => {
    let foo = []
    for (let i = 0; i < pieces; i++) {
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
      <div className='PieceSelectorPieces'>
        {
          p.map((e) => {
            return (
              <div className='PieceSelectorPiece'>
                <div className='KeyString'>
                  <span style={{margin: 'auto', fontSize : '30px'}}>
                    {e.id + 1}
                  </span>
                </div>
                {e.piece}
              </div>
            )
          })
        }
      </div>
    </div>
  )


}



function MoveData({
  data,
}) {
  
  const [c, setC] = useState([]);
  const [b, setB] = useState([]);

  useEffect(() => {
    if (data === null) {
      return
    }

    let c = null
    if (data.best !== null && data.best < data.count) {
      c = 'red'
    }
    
    setC(setDiv(data.count, 'moves', c))
    setB(setDiv(data.best, 'best'))
    /* 
    setC(setDiv(1, 'moves'))
    setB(setDiv(2, 'best'))
 */

  }, [data]);


  function setDiv(value, str, c = null) {

    if (value === null) {
      return []
    }

    return ([
      (    
        <div className='MoveDataValue' style={{fontSize : '30px'}}>

          <h2 style={{margin : 'auto', fontSize : '30px'}}>{str}</h2>
        </div>
      ),
      
      (
        <div className='MoveDataValue' style={{fontSize : '30px', height : '60%'}}>

          <h2 style={{margin : 'auto', fontSize : '50px', color : c}}>{value}</h2>
        </div>
      ),
    ])
  }





  return (
    <div className='MoveData'>
      <div className='MoveDataDisplay' style={{fontSize : '30px'}}>
        {
          c.map((e) => {return (e)})
        }
      </div>
      <div className='MoveDataDisplay' style={{fontSize : '30px'}}>
        {
          b.map((e) => {return (e)})
        }
      </div>
    </div>
  )
}

function Button({
  value = 'test',
  id,
  click,
  active = false
}) {
  return (

    <div className='ButtonContainer'>
      {
        !active ? <></> :
        <button 
          className='Button'
          type='button'
          onClick={(e) => {click(id)}}
          
          >
          <h2 style={{margin : 'auto', fontSize : '20px'}}>{value}</h2>


        </button>

      }
            
    </div>

  )
}






