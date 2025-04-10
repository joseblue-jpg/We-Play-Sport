import React, { useContext, useEffect, useState } from 'react';
import { fetchData } from '../../helpers/axiosHelper';
import { useNavigate, useParams } from 'react-router-dom';
import './eventInfo.css';
import { KingOfTheCourtContext } from '../../Context/ContextProvider';

const BackUrl = import.meta.env.VITE_SERVER_URL;

export const AdminEventInfo = () => {
  const {token} = useContext(KingOfTheCourtContext);
  const { id } = useParams();
  const [eventUnico, setEventUnico] = useState({});
  const [services, setServices] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        let result = await fetchData(`/events/oneEvent/${id}`, 'get', null, {
          Authorization: `Bearer ${token}`,
        });
        setEventUnico(result.data); //=>setEventUnico(result.data[0])
      }
      
      catch (error) {
        console.log(error);
      }
    }
    fetchEvents();

    const fetchServices = async ()=>{
      try{
        let result = await fetchData(`/events/getServicesFromAnEvent/${id}`, 'get', null, {
          Authorization: `Bearer ${token}`,
        });
      
        setServices(result.data.result);
      }
      catch(error){
        console.log(error);
      }
    }
    fetchServices();
  }, []);
  // Mostrar mensaje si el evento no se encuentra
  if (!eventUnico) {
    return <p>Evento no encontrado...</p>;
  }
  return (
    <>
      <div className='background'>
        <div className='event-info-main container-xl p-3'>
            <h2 className='fw-bolder text-warning rounded-3 p-3 text-center'>VISTA PREVIA</h2>
          <div className='d-flex justify-content-center'>
            <div className='event-img d-flex justify-content-center rounded-5'>
              <img
                src={eventUnico.event_photo ? `${BackUrl}/images/event_images/${eventUnico.event_photo}` : '/images/background/event.jpeg'}
                alt='Evento'
              />
            </div>
          </div>
          <div className='d-flex flex-column justify-content-center my-3'>
            <h2 className='fw-bolder text-white rounded-3 p-3'>{eventUnico.event_name}</h2>
            <div className='d-flex my-2 gap-2'>
              {eventUnico.status === 2 && <button className='border-0 rounded-3 px-5 py-2 fw-bold' onClick={() => navigate(`/inscriptionEvent/${eventUnico.event_id}`)}>INSCRÍBETE</button>}
              <div className='price d-flex rounded-3'>
                <p className='m-0 px-3 py-2'><strong>Precio:</strong> {eventUnico.price} €</p>
              </div>
            </div>
          </div>
          <div className='info-main-div d-flex gap-3'>
            <div className='info-div rounded-2'>
              <div className='info-title'>
                <h3 className='mx-3 fs-4'>DETALLES DEL EVENTO</h3>
              </div>
              <div className='px-4 py-2'>
                <p><strong>Lugar:</strong> {eventUnico.event_city}, {eventUnico.event_country}</p>
                <p><strong>Duración del evento:</strong> desde el {eventUnico.date_start} hasta {eventUnico.date_end}</p>
                <p><strong>Hora de inicio:</strong> {eventUnico.time_start ? eventUnico.time_start.split(":")[0] + ":" + eventUnico.time_start.split(":")[1] : "No disponible"}</p>
                <p><strong>Hora de Finalización:</strong> {eventUnico.time_end ? eventUnico.time_end.split(":")[0] + ":" + eventUnico.time_end.split(":")[1] : "No disponible"}</p>
                <p><strong>Check-in:</strong> {eventUnico.check_in ? eventUnico.check_in.split(":")[0] + ":" + eventUnico.check_in.split(":")[1] : "No disponible"}</p>
                <p><strong>Estado de inscripción:</strong> {
                  eventUnico.status === 1 ? "Próximamente" :
                  eventUnico.status === 2 ? "Activo" :
                  eventUnico.status === 3 ? "Inscripción cerrada" :
                  eventUnico.status === 4 ? "Cancelado" :
                  eventUnico.status === 5 ? "Finalizado" : null
                }</p>
              </div>
            </div>
            <div className='info-div rounded-2'>
              <div className='info-title'>
                <h3 className='mx-3 fs-4'>MÁS INFO</h3>
              </div>
              <div className='px-4 py-2'>
                <p><strong>Deporte:</strong> {eventUnico.sport_name}</p>
                <p><strong>Categoría:</strong> {eventUnico.level_category}</p>
                <p><strong>Categoría de Género:</strong> {eventUnico.gender_category}</p>
                <p><strong>Evento por equipos:</strong> {eventUnico.is_team_event ? "Sí" : "No"}</p>
                <p><strong>Máximo de Participantes:</strong> {eventUnico.max_participants}</p>
                <p><strong>Temporada:</strong> {eventUnico.season}</p>
              </div>
            </div>
          </div>
          <div className='info-div-2 d-flex flex-column w-100 mt-3 rounded-2'>
            <div className='info-title'>
              <h3 className='mx-3 fs-4'>DESCRIPCIÓN</h3>
            </div>
            <p className='p-2 m-0'>{eventUnico.description || "Sin descripción disponible."}</p>
          </div>
          <div className='info-div-2 d-flex flex-column w-100 mt-3 rounded-2'>
            <div className='info-title'>
              <h3 className='mx-3 fs-4'>SERVICIOS</h3>
            </div>
            <div className='d-flex justify-content-center'>
              {services?.map((elem)=>{
                return(
                  <div className='w-25 bg-warning rounded m-1 text-center border border-2 border-secondary' key={elem}>
                    <p className='p-1 m-0 fs-5'>{elem}</p>
                  </div>
                )
              })}
            </div>
            {services.length == 0 && <p className='p-2 m-0'>No hay servicios disponibles.</p>}
          </div>
          {eventUnico.google_maps_link && (
            <div className='ubication mt-5'>
              <div
                dangerouslySetInnerHTML={{ __html: eventUnico.google_maps_link }}
              />
            </div>
          )}
          <div className='d-flex justify-content-center'>
            <button className=' back-btn py-2 px-4 rounded-3 border-0 text-white mt-3' onClick={() => navigate(`/adminPanelEvents`)}>VOLVER</button>
            </div>
        </div>
      </div>
    </>
  );
};