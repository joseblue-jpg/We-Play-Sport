import React from 'react'
import { useNavigate } from 'react-router-dom'
import './confirmEmailNewPass.css'
import { Button } from 'react-bootstrap';

export const ConfirmEmailNewPass = () => {
  const navigate = useNavigate();


  const onSubmit = async () =>{
    try{
      navigate('/');
    }catch (error){
      console.log(error);
    }
  }
  
  return (
    <div className='confirm-newPass-main'>
      <div className='verified-msg'>
        <h2 className='fs-3'>LINK DE CONFIRMACIÓN ENVIADO</h2>
        <p>Consulta tu email, revisa la carpeta de spam</p>
        <Button onClick={onSubmit}>HOME</Button>
      </div>
    </div>
  )
}
