import React, { useEffect, useState } from 'react'

import './Util.style.css';

export default function ButtonReference({

  v
}) {

  const [k, setK] = useState(null)




  useEffect(() => {
    setK(v)

  }, [v])
  
  
  if (k === null) {
    return <></>
  }


  return (
    <div className='ButtonReference'>
      <span className='ButtonString'>
        {k}
      </span>
    </div>
  )




}
 