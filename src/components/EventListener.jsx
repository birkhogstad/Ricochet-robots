import React, { useRef, useEffect, useState } from 'react';

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

export default EventListener
