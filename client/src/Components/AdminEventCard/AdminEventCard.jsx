import { Button, Card } from 'react-bootstrap'
import './adminEventCard.css'

const BackUrl = import.meta.env.VITE_SERVER_URL;

export const AdminEventCard = ({data, navigate, onDelete}) => {

  const formattedDate = new Date(data.date_start).toLocaleDateString();    
  
  return (
    <>
    <Card className="event-card">
        <Card.Img
          variant="top" 
          src={data?.event_photo ? `${BackUrl}/images/event_images/${data?.event_photo}` : '/images/background/event.jpeg'} 
          className="event-img" 
          />
        
        <Card.Body className='event-body'>
          <Card.Title className='event-title'>{data.event_name}</Card.Title>
          <Card.Text className='event-text'>
          {formattedDate}<span>, </span><span className='text-warning'>{data.event_city}</span>
          </Card.Text>

          <div className="event-btns d-flex flex-column align-items-center">
            <div
              className={`event-status rounded-1 fw-bold mb-3 w-100 mt-3 ${
                data.status === 1
                  ? 'btn-blue'
                  : data.status === 2
                  ? 'btn-green'
                  : data.status === 3
                  ? 'btn-gray'
                  : data.status === 4
                  ? 'btn-red'
                  : data.status === 5
                  ? 'btn-yellow'
                  : ''
              }`} 
              disabled
            >
              {data.status === 1
                ? 'Próximamente'
                : data.status === 2
                ? 'Activo'
                : data.status === 3
                ? 'Inscripción cerrada'
                : data.status === 4
                ? 'Cancelado'
                : data.status === 5
                ? 'Finalizado'
                : 'Estado desconocido'}
            </div>
            <div className='d-flex gap-2'>
              <Button
                onClick={()=>navigate(`/adminEventInfo/${data.event_id}`)}
              >
                Ver mas
              </Button>
              <Button
                onClick={()=>navigate(`/EditEvent/${data.event_id}`)}
              >
                Modificar
              </Button>
              <Button
                onClick={()=>onDelete(data.event_id)}
              >
                Eliminar
              </Button>
            </div>
          </div> 
        </Card.Body>
    </Card>
    </>
  )
}
