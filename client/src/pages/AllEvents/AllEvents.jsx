import React, { useEffect, useState } from 'react';
import './allEvents.css';
import { fetchData } from '../../helpers/axiosHelper';
import { useNavigate } from 'react-router-dom';
import { EventsCard } from '../../Components/AllEvents/EventsCard';
import { Button, Modal } from 'react-bootstrap';

export const AllEvents = () => {
  const [events, setEvents] = useState([]);
  const [showAll, setShowAll] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  const [searchSelection, setSearchSelection] = useState({
    gender_category: "",
    level_category: "",
    event_name: "",
    status: null,
    sport_name: "",
    event_country: "",
    event_city: ""
  });

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        let result = await fetchData("/events/allEvents", "get");
        setEvents(result.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchEvents();
  }, []);

  const onSubmit = async (e) => {
    e.preventDefault();
    

    try {
      let newFormData = new FormData();
      newFormData.append("data", JSON.stringify(searchSelection));

      let res = await fetchData('/events/eventFilterButton', 'post', newFormData);
      setEvents(res.data.data);
     
    }
    catch (error) {
      console.log(error);
    }
  };

  const handleChange = (e) => {
    let { name, value } = e.target;
    setSearchSelection({ ...searchSelection, [name]: value });
  };

  const handleModalOpen = () => {
    setShowModal(true);
    setSearchSelection({
      gender_category: "",
      level_category: "",
      event_name: "",
      status: null,
      sport_name: "",
      event_country: "",
      event_city: ""
    })
  }

  const eventsToShow = showAll ? events : events.slice(0, 12);

  return (
    <>
      <div className="nav-all-events-container d-flex flex-column flex-wrap box-sizing-border-box gap-2">
        <div className="all-events-header d-flex flex-column justify-content-center align-items-center text-white">
          <div className="all-event-title d-flex justify-content-center align-items-center text-center">
            <h2 className="text-warning fs-2 fw-bold">TODOS LOS EVENTOS</h2>
          </div>
          <div className='search-btn d-flex align-items-center px-3'>
            <img src="/images/logo/search-icon.png" alt="search-icon" />
            <Button
              className='fs-5'
              variant=""
              onClick={() => handleModalOpen(true)}
            >
              Búsqueda
            </Button>
          </div>

          <Modal className='event-search-modal d-flex justify-content-center' show={showModal} onHide={() => setShowModal(false)}>
            <Modal.Header closeButton className='events-search-modal-header border-0'>
              <Modal.Title className='text-warning'>Buscador de Eventos</Modal.Title>
            </Modal.Header>
            <Modal.Body className='p-0'>
              <form className='events-searcher d-flex flex-column align-items-center gap-2 pt-4' action="">
                <input type="text" name='event_name' placeholder='Por nombre' onChange={handleChange} />
                <input type="text" name='sport_name' placeholder='Por deporte' onChange={handleChange} />
                <input type="text" name='event_country' placeholder='Por país' onChange={handleChange} />
                <input type="text" name='event_city' placeholder='o por ciudad' onChange={handleChange} />

                <div className='pt-3'>
                  <select name='gender_category' onChange={handleChange}>
                    <option value="">Categoría de género (todas)</option>
                    <option value="masculino">Masculino</option>
                    <option value="femenino">Femenino</option>
                    <option value="mixto">Mixto</option>
                  </select>
                </div>
                <div>
                  <select name='level_category' onChange={handleChange}>
                    <option value="">Categoría profesional (todas)</option>
                    <option value="gold">Oro</option>
                    <option value="silver">Plata</option>
                    <option value="bronze">Bronce</option>
                  </select>
                </div>
                <div>
                  <select name='status' onChange={handleChange}>
                    <option value={null}>Estado del evento (todos)</option>
                    <option value={1}>Próximamente</option>
                    <option value={2}>Activo</option>
                    <option value={3}>Inscripción cerrada</option>
                    <option value={4}>Cancelado</option>
                    <option value={5}>Pasado</option>
                  </select>
                </div>
                <Button className='text-black rounded-3 border-0 px-4 my-3' onClick={onSubmit}>
                  BUSCAR
                </Button>
              </form>
            </Modal.Body>
          </Modal>
        </div>
        <div className='all-events-container d-flex justify-content-center flex-wrap gap-3'>
          {eventsToShow?.map((event) => (
            <article className='mt-4' key={event.event_id}>
              <EventsCard eventData={event} navigate={navigate} />
            </article>
          ))}
          {eventsToShow.length === 0 &&
            <p>No existen eventos con esas características</p>}
        </div>
        <div className="all-events-more-events text-center pt-1 w-100">
            <button
              className="show-more-btn text-center fs-5 fw-bold mb-3 rounded-5"
              onClick={() => setShowAll(!showAll)}
            >
              {showAll ? 'VER MENOS EVENTOS' : 'VER MÁS EVENTOS'}
            </button>
          </div>

      </div>
    </>
  );
};
