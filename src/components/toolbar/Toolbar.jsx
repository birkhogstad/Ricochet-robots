import React, { useRef, useEffect, useState } from 'react';

import './Toolbar.style.css';


export default function Toolbar({
  moveData,
  click,
}) {



  const [m, setM] = useState([]);
  const [b, setB] = useState((<Button value='Start' id={0} click={clicked}/>));

  useEffect(() => {
    setM(moveData)

    if (moveData.best === null && moveData.count !== null) {
      setB(null)
    }
    if (moveData.best !== null) {
      setB((<Button value='Next' id={0} click={clicked}/>))
    }
  }, [moveData]);

  function clicked(id) {

    click(id)
  }


  
  console.log(moveData);

  return (
    <div className='Toolbar'>
      <div className='Section' style={{height : '50%', backgroundColor : 'blue'}}>
      </div>

      <div className='Section' style={{height : '10%', backgroundColor : 'white'}}>
        {b}
      </div>

      <MoveData data={m}/>
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
        <div className='MoveDataValue' style={{backgroundColor : 'orange', fontSize : '30px'}}>

          <h2 style={{margin : 'auto', fontSize : '30px'}}>{str}</h2>
        </div>
      ),
      
      (
        <div className='MoveDataValue' style={{backgroundColor : 'yellow', fontSize : '30px', height : '60%'}}>

          <h2 style={{margin : 'auto', fontSize : '50px', color : c}}>{value}</h2>
        </div>
      ),
    ])
  }





  return (
    <div className='MoveData'>
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
}


function Button({
  value = 'test',
  id,
  click,
}) {
  return (

              
      <button 
        className='Button'
        type='button'
        onClick={(e) => {click(id)}}

      >
        <h2 style={{margin : 'auto', fontSize : '25px'}}>{value}</h2>


      </button>

  )
}

