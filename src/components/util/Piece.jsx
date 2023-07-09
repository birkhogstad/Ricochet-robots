import React, { useEffect, useState } from 'react';
import {getRobotColor } from '../../colors';

function Piece({
  id,
  click = null,
  multiplier = 0.8,
}) {

  const [m, setM] = useState(null)
  const [c, setC] = useState(null)




  useEffect(() => {
    setC(getRobotColor(id))
  }, [id]);

  useEffect(() => {
    setM(multiplier)
  }, [multiplier]);


  if (c === null || m === null) {
    return <></>
  }

  if (click === null) {
    return (
      <svg width={(40 * m) + ''} height={(40 * m) + ''}>
        <circle cx={(20 * m) + ''} cy={(20 * m) + ''} r={(2 + (14 * m)) + ''} fill={'black'} />
        <circle cx={(20 * m) + ''} cy={(20 * m) + ''} r={(14 * m) + ''} fill={c} />
      </svg>
    )

  }

  return (

    <button 
      type='button'
      onClick={(e) => click(id)}
      style={{
        backgroundColor : 'inherit',
        padding : '0',
        border : '0',
        margin : 'auto',
        display : 'flex',
      }}
    >
      <svg width={(40 * m) + ''} height={(40 * m) + ''}>
        <circle cx={(20 * m) + ''} cy={(20 * m) + ''} r={(2 + (14 * m)) + ''} fill={'black'} />
        <circle cx={(20 * m) + ''} cy={(20 * m) + ''} r={(14 * m) + ''} fill={c} />
      </svg>


    </button>

  )
}

export default Piece
