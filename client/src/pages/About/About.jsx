import React from 'react'
import './about.css'

import Card from 'react-bootstrap/Card';
import CardGroup from 'react-bootstrap/CardGroup';

export const About = () => {
  return (
    <>
    <div className="about">
      <div className="background-about">
        <div className="texto">
          <div>
            <h2>
            ¿Quiénes somos?
            </h2>
          </div>
          <div>
            <p>¿Quieres conocer más sobre nosotros?</p>
          </div>
          <div>
            <p>
            Somos una empresa con más de 10 años de experiencia en la organización de eventos y la gestión de experiencias deportivas. Nos apasiona el deporte y el marketing, por eso creamos conexiones auténticas entre marcas y personas a través de experiencias deportivas únicas. Trabajamos con marcas y entidades que buscan acercarse a su público mediante el deporte, diseñando eventos inolvidables que generan impacto y emoción.
            </p>
          </div>
        </div>
      </div>
    <div>
      <h3 className='text-center p-4 text-warning'>¡TOMA NOTA DE NUESTROS EVENTOS!</h3>
    <CardGroup className='p-3'>
      <Card>
        <Card.Img variant="top" src="/images/about/padel.jpg" />
        <Card.Body className='text-center'>
          <Card.Title>DISFRUTA DE ACTIVIDADES AL AIRE LIBRE</Card.Title>
          <Card.Text>
          Disfruta de actividades deportivas en un entorno natural, donde la pasión por el fútbol, el baloncesto y más se combina con el aire fresco y la diversión. 
          </Card.Text>
        </Card.Body>
        
      </Card>
      <Card>
        <Card.Img variant="top" src="/images/about/voleyplaya.jpg" />
        <Card.Body  className='text-center'>
          <Card.Title>INCREIBLE VARIEDAD DE EVENTOS</Card.Title>
          <Card.Text>
          Explora nuestra amplia variedad de eventos diseñados para apasionados del deporte y la diversión. Desde torneos competitivos hasta experiencias recreativas, creamos momentos únicos que unen a personas, marcas y comunidades
          </Card.Text>
        </Card.Body>
        
      </Card>
      <Card>
        <Card.Img variant="top" src="/images/about/paella.jpg" />
        <Card.Body  className='text-center'>
          <Card.Title>NO TE OLVIDES DE NUESTROS SERVICIOS</Card.Title>
          <Card.Text>
          Explora nuestros servicios diseñados para brindarte experiencias inolvidables. Desde la organización de eventos deportivos hasta la gestión de experiencias únicas, conectamos marcas y personas a través del deporte.
          </Card.Text>
        </Card.Body>
       
      </Card>
    </CardGroup>
    </div>
    </div>

    <div className='info-cont'>
      <div>
        <h2 className='text-warning'>
        Comunícate con nosotros
        </h2>
      </div>
      <div>
        <img src="/images/logo/logoOscuro.png" alt="" />
      </div>
      <div className='p-5'>
        <p>Más información</p>
        <p>+34 671 971 629</p>
        <a href="mailto:mediterraneanhockey@hotmail.com">Enviar correo a mediterraneanhockey@hotmail.com</a>
      </div>
      
      
    </div>


    </>
  )
}

