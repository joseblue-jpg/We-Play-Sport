import React from 'react'
import "./controlPanel.css"
import { useNavigate } from 'react-router-dom'

export const ControlPanel = () => {

  const navigate = useNavigate();

  return (
    <>
    <section className='adminControlPanel'>
      <h2>PANEL DE ADMINISTRADOR</h2>

      <div className='options-container'>
        <button onClick={() =>{navigate('/adminPanelEvents')}} className="option">
          <img
            src="/images/admin/eventos.jpg"
            alt="Imagen"
          />
          <h3 className='fs-5 mt-2'>EVENTOS</h3>
        </button>
        
        <button onClick={() =>{navigate('/adminPanelServices')}}                className="option">
          <img
            src="/images/admin/servicios.jpg"
            alt="Imagen"
          />
           <h3 className='fs-5 mt-2'>SERVICIOS</h3>
        </button>
        
        <button onClick={() =>{navigate('/adminPanelUsers')}}  className="option">
          <img
            src="/images/admin/usuarios.jpg"
            alt="Imagen"
          />
           <h3 className='fs-5 mt-2'>USUARIOS</h3>
        </button>
      </div>

      <div className='buttonBack'>
        <button onClick={() =>{navigate('/profile')}}>VOLVER</button>
      </div>

    </section>
    
    </>
  )
}
