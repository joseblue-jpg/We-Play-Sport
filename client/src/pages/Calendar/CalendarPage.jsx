import "react-big-calendar/lib/css/react-big-calendar.css";
import { Calendar, Navigate } from "react-big-calendar";
import { Button, Col, Container, Modal, Row } from "react-bootstrap";
import { localizer } from "../../helpers/calendarLocalicer"; //Fechas
import { calendarMessages } from "../../helpers/calendarMessages";
import "./calendar.css";
import { useEffect } from "react";
import { useState } from "react";
import { fetchData } from "../../helpers/axiosHelper";
import { CalendarEvent } from "../../Components/Calendar/CalendarEvent";
import { useNavigate } from "react-router-dom";

const BackUrl = import.meta.env.VITE_SERVER_URL;

export const CalendarPage = () => {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [moreEvents, setMoreEvents] = useState([]);
  const [showModalEvent, setShowModalEvent] = useState(false);
  const [showModalMoreEvents, setShowModalMoreEvents] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 576);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        let result = await fetchData("/events/allEvents", "get");
        const newData = result.data.map((event) => ({
          ...event,
          title: event.event_name,
          start: new Date(event.date_start + `T${event.time_start}`),
          end: new Date(event.date_end + `T${event.time_end}`),
          allDay: false,
        }));
        setEvents(newData); // Almacenar los eventos
      } catch (error) {
        console.log(error);
      }
    };
    fetchEvents();
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 576);
    };
    //controlar eventos
    window.addEventListener("resize", handleResize);
    return () => {
      //eliminar eventos
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const onSelect = (e) => {
    if (isMobile) {
      const dayEvents = events.filter(
        (event) =>
          new Date(event.start).toDateString() ===
          new Date(e.start).toDateString()
      );
      setMoreEvents(dayEvents);
      setShowModalMoreEvents(true);
    }
    else{
      //Cuando hagamos click funciona
      setSelectedEvent(e);
      setShowModalEvent(true);
    }
  };


  const handleCloseModalEvent = () => setShowModalEvent(false);
  const onShowMore = (e) => {
    setMoreEvents(e);
    setShowModalMoreEvents(true);
  };

  const handleCloseModalMoreEvents = () => setShowModalMoreEvents(false);

  return (
      <section className="calendar-main">
        <Container >
          <Row>
            <Col xs={12}>
              {/**Esto es el calendario*/}
              <Calendar
                className="calendar py-4"
                culture="es" //idioma
                localizer={localizer}
                messages={calendarMessages()}
                events={events}
                startAccessor="start"
                endAccessor="end"
                onSelectEvent={onSelect}
                onShowMore={onShowMore}
                components={{
                  //renderizamos el componente
                  event: CalendarEvent,
                }}
                views={["month"]} //activar vista mes
              />
              {/**Esto es el Modal de un Evento*/}
              <Modal show={showModalEvent} onHide={handleCloseModalEvent}>
                <Modal.Header closeButton>
                  <Modal.Title className="fw-bold">{selectedEvent?.event_name}</Modal.Title>
                </Modal.Header>
                <Modal.Body className="d-flex justify-content-between">
                  <div>
                    <p><strong>Fecha de Inicio: </strong>{selectedEvent?.date_start}</p>
                    <p><strong>Hora de Inicio: </strong>{selectedEvent?.time_start.split(":")[0]}:{selectedEvent?.time_start.split(":")[1]}</p>
                    <p><strong>Hora de Fin: </strong>{selectedEvent?.time_end.split(":")[0]}:{selectedEvent?.time_end.split(":")[1]}</p>
                    <p
                      className={`event-status-badge ${
                        selectedEvent?.status === 1
                          ? "upcoming"
                          : selectedEvent?.status === 2
                          ? "active"
                          : selectedEvent?.status === 3
                          ? "closed"
                          : selectedEvent?.status === 4
                          ? "cancelled"
                          : selectedEvent?.status === 5
                          ? "finished"
                          : "unknown"
                      }`}
                    >
                      {selectedEvent?.status === 1
                        ? " Próximamente"
                        : selectedEvent?.status === 2
                        ? " Activo"
                        : selectedEvent?.status === 3
                        ? " Inscripción cerrada"
                        : selectedEvent?.status === 4
                        ? " Cancelado"
                        : selectedEvent?.status === 5
                        ? " Finalizado"
                        : null}
                    </p>
                    <button
                      className="btn-mustard"
                      onClick={() =>
                        navigate(`/eventInfo/${selectedEvent.event_id}`)
                      }
                    >
                      Ir al evento
                    </button>
                  </div>
                  <img
                    className="modal-img-event object-fit-cover"
                    src={
                      selectedEvent?.event_photo
                        ? `${BackUrl}/images/event_images/${selectedEvent?.event_photo}`
                        : "/images/background/event.jpeg"
                    }
                    alt="Modal Evento"
                  />
                </Modal.Body>
              </Modal>
              {/**Esto es el modal de ver mas eventos */}
              <Modal
                show={showModalMoreEvents}
                onHide={handleCloseModalMoreEvents}
              >
                <Modal.Header closeButton className="border-0 pb-0">
                </Modal.Header>
                <Modal.Body>
                  {moreEvents.map((event) => (
                    <div className="d-flex justify-content-between align-items-center border-top border-bottom py-2" key={event.event_id}>
                      <div>
                        <p className="mb-0 fw-bold">{event?.event_name}</p>
                        <p className="mb-0">{event?.time_start.split(":")[0]}:{event?.time_start.split(":")[1]} a {event?.time_end.split(":")[0]}:{event?.time_end.split(":")[1]}</p>
                      </div>
                      <button
                      className="btn-mustard"
                      onClick={() =>
                        navigate(`/eventInfo/${event.event_id}`)
                      }
                    >
                      Ir al evento
                    </button>
                    </div>
                  ))}
                </Modal.Body>
              </Modal>
            </Col>
          </Row>
        </Container>
      </section>
  );
};
