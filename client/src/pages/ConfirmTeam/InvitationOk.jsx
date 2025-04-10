import React from 'react';
import "./confirmTeam.css";
import { Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

export const InvitationOk = () => {

  const navigate = useNavigate();

  return (
    <section className='confirm-team-main'>
      <div className='verified-msg-confirm-team'>
        <h2 className='fs-2 fw-bold'>¡Todo correcto!</h2>
        <p className='fs-4'>Te has registrado correctamente al evento con tu equipo</p>
        <Button className='button-confirm-team' onClick={()=>navigate("/")}>Ir a home</Button>
      </div>
    </section>
  )
}
