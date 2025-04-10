import React from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { fetchData } from '../../helpers/axiosHelper';
import './confirmRegister.css'
import { Button } from 'react-bootstrap';

export const ConfirmRegister = () => {
  const {token} = useParams();
  const navigate = useNavigate();


  const onSubmit = async () =>{
    /* to do: ir a una página/hacer modal que se abra y cierre en 4s -> que te diga si el registro se ha completado o no */
    /* después redirección a login/home (ya hecha) */
    
    try{
      await fetchData('/users/confirmRegister', "PUT", null, {Authorization: `Bearer ${token}` })
      
      navigate('/login')
  
    }catch (error){
      console.log(error);
    }
  }
  
  return (
    <div className='confirm-register-main'>
      <div className='verified-msg'>
        <h2 className='fs-3'>¡CUENTA VERIFICADA!</h2>
        <Button onClick={onSubmit}>INICIA SESIÓN</Button>
      </div>
    </div>
  )
}
