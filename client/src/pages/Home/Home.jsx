import React, { useEffect, useState, useRef } from 'react';
import './home.css';
import { fetchData } from '../../helpers/axiosHelper';
import { useNavigate } from 'react-router-dom';
import { EventsCard } from '../../Components/AllEvents/EventsCard';

export const Home = () => {
  const [events, setEvents] = useState([]);
  const [showAll, setShowAll] = useState(false);
  const navigate = useNavigate();
  const eventsSectionRef = useRef(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        let result = await fetchData("/events/allEventsHome", "get");
        setEvents(result.data.result); // Almacenar los eventos
      } catch (error) {
        console.log(error);
      }
    };

    const changeToDone = async () => {
      try {
        await fetchData("/events/setEventsDone", "post")
      } catch (error) {
        console.log(error);
      }
    };

    changeToDone();
    fetchEvents();

  }, []);
  
  const eventsToShow = showAll ? events : events.slice(0, 6);

  const scrollToEvents = () => {
    if (eventsSectionRef.current) {
      eventsSectionRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <header className="home-header-container d-flex flex-column align-items-center text-center w-100 text-white">
        <div className="header-info my-5">
          <h1 className="fw-bold">BIENVENIDOS, ENTUSIASTAS DEL <span className='sport-span'>DEPORTE</span></h1>
          <p>
            No somos solo una plataforma todo en uno para la organización de eventos deportivos. 
            Somos La plataforma. La gestión de tus eventos deportivos nunca había sido tan sencilla.
          </p>
          <img src="/images/background/sporters.png" alt="Sporters" />
        </div>
        <img 
            src="/images/logo/double-arrow.png" alt="Sporters"
            onClick={scrollToEvents} 
            className="double-arrow d-sm-none"
          >
        </img>
        
        <div ref={eventsSectionRef} className="next-events d-flex justify-content-center align-items-center rounded-5">
          <h2 className="text-warning fs-4 fw-bold m-0">PRÓXIMOS EVENTOS</h2>
        </div>
      </header>

      <section 
        className="home-events-container d-flex flex-wrap justify-content-center align-items-center text-center box-sizing-border-box w-100 p-4 gap-3"
      >
        {eventsToShow?.map((event) => (
          <article className='mt-4' key={event.event_id}>
            <EventsCard eventData={event} navigate={navigate} />
          </article>
        ))}

        <div className="more-events text-center pt-4 w-100">
          <button 
            className="show-more-btn text-center fw-bold mb-3 rounded-5" 
            onClick={() => setShowAll(!showAll)}
          >
            {showAll ? 'VER MENOS EVENTOS' : 'VER MÁS EVENTOS'}
          </button>
        </div>

      </section>
    </>
  );
};
