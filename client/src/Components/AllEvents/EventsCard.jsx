import React from 'react';
import { Button, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import './eventCard.css'

const BackUrl = import.meta.env.VITE_SERVER_URL;

export const EventsCard = ({ eventData }) => {
  const navigate = useNavigate();
  
  // Formateamos la fecha para mostrar solo el día
  const formattedDate = new Date(eventData.date_start).toLocaleDateString();

  return (
    <Card className="event-card border-0">
        <Card.Img 
          variant="top" 
          src={eventData?.event_photo ? `${BackUrl}/images/event_images/${eventData?.event_photo}` : '/images/background/event.jpeg'}
          className="event-img" 
        />
        
        <Card.Body className='event-body'>
          <Card.Title className='event-title'>{eventData.event_name}</Card.Title>
          <Card.Text className='event-text'>
            {formattedDate}<span>, </span><span className='text-warning'>{eventData.event_city}</span>
          </Card.Text>

          <div className="event-btns d-flex flex-column align-items-center">
            <div 
              className={`event-status rounded-1 fw-bold mb-3 w-100 mt-3 ${
                eventData.status === 1
                  ? 'btn-blue'
                  : eventData.status === 2
                  ? 'btn-green'
                  : eventData.status === 3
                  ? 'btn-gray'
                  : eventData.status === 4
                  ? 'btn-red'
                  : eventData.status === 5
                  ? 'btn-yellow'
                  : ''
              }`} 
              disabled
            >
              {eventData.status === 1
                ? 'Próximamente'
                : eventData.status === 2
                ? 'Activo'
                : eventData.status === 3
                ? 'Inscripción cerrada'
                : eventData.status === 4
                ? 'Cancelado'
                : eventData.status === 5
                ? 'Finalizado'
                : 'Estado desconocido'}
            </div>
            <Button 
              onClick={() => navigate(`/eventInfo/${eventData.event_id}`)} 
              className="btn-more-info p-1 fw-bold"
            >
              VER EVENTO
            </Button>
          </div>

          
        </Card.Body>
    </Card>
  );
};
