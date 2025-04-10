import React, { useEffect, useState } from 'react'
import './error.css'

export const Cargando = () => {

  let [cargando, setCargando] = useState(true)

  useEffect(() => {
    let timer = setTimeout(() => {
      setCargando(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className='error-main'>
      {/* {cargando ? 
      <div className='error-container'>
        <div>
          <p>Cargando...</p>
        </div>
      </div>
      : */}
      <div className='error-container'>
        <img src="/images/background/sad.png" alt="" />
        <div>
          <p>PARECE QUE ALGO HA SALIDO MAL :</p>
        </div>
      </div>
      {/* } */}
    </div>
  )
}
