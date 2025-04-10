import React from 'react'
import './confirmEmailSent.css'
import { Button } from 'react-bootstrap'
import { useNavigate } from "react-router-dom";

export const ConfirmEmailSent = () => {
  const navigate = useNavigate();

  return (
    <div className='confirm-email-sent'>
      <div className='message-div'>
        <img src="" alt="" />
        <h2>¡REGISTRO CONFIRMADO!</h2>
        <p className='text-white'>Revisa tu correo electrónico para verificar tu cuenta</p>
        <Button
          onClick={() => navigate("/login")}>
          VOLVER
        </Button>
      </div>
    </div>
  )
}
