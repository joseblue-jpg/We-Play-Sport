import React, { useContext, useEffect, useState } from "react";
import { KingOfTheCourtContext } from "../../Context/ContextProvider";
import { useNavigate } from "react-router-dom";
import "./Profile.css";
import { fetchData } from "../../helpers/axiosHelper";
import { BasicModal } from "../../Components/BasicModal/BasicModal";
import Swal from 'sweetalert2'

const ApiUrl = import.meta.env.VITE_SERVER_URL;


export const Profile = () => {
  const { user, token } = useContext(KingOfTheCourtContext);
  const navigate = useNavigate();
  const [eventsInscription, setEventInscription] = useState([]);
  
  
  useEffect(() => {
    const fetchEventInscription = async () => {
      try {
        let result = await fetchData(
          `/users/profileEventSuscription/${user.user_id}`,
          "get",
          null,
          {
            Authorization: `Bearer ${token}`,
          }
        );
        // Acceder a los datos correctamente y actualizar el estado
        if (result.data && result.data.data) {
          setEventInscription(result.data.data);
        }
      } catch (error) {
        console.log("Error al obtener las inscripciones:", error);
      }
    };
    fetchEventInscription();
  }, []);
  
  
  const onUnsub = async (id) => {
    const { isConfirmed } = await Swal.fire({
      title: "¿Estás seguro?",
      text: "Esta acción cancelará tu suscripción al evento.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sí, cancelar",
      cancelButtonText: "No, mantener",
    });
  
    if (!isConfirmed) return;
  
    try {
      await fetchData(
        `/users/withdrawFromEvent/${user.user_id}/${id}`, 
        "post", 
        null, 
        { Authorization: `Bearer ${user.token}` }
      );
  
      setEventInscription(eventsInscription.filter((elem) => elem.event_id != id));
  
      // Mostrar mensaje de éxito
      Swal.fire({
        title: "Cancelación exitosa",
        text: "Tu suscripción al evento ha sido cancelada correctamente.",
        icon: "success",
        confirmButtonColor: "#3085d6",
        confirmButtonText: "Aceptar",
      });
  
    }
    catch (error) {
      console.log(error);
      Swal.fire({
        title: "Error",
        text: "Hubo un problema al cancelar la suscripción. Inténtalo nuevamente.",
        icon: "error",
        confirmButtonColor: "#d33",
        confirmButtonText: "Aceptar",
      });
    }
  }
  
  
  return (
    <>
      <div className="profile-background">
        <div className="profile-info-main d-flex flex-column align-items-center container-xl p-3">
          <div className="profile-header d-flex flex-column justify-content-center align-items-center rounded-5 p-4 gap-3">
            <img
              src={
                user?.user_photo
                  ? `${ApiUrl}/images/user_photo/${user?.user_photo}`
                  : "/images/defaultImage/defaultImage.png"
              }
              alt="Profile"
              className="profile-img"
            />
            <div className="profile-header-text d-flex flex-column justify-content-center align-items-center text-white w-75 rounded-4">
              <h2 className="fs-2 text-warning px-4">MI PERFIL</h2>
              <h3 className="text-center pb-3">
                {user?.user_name} {user?.last_name}
              </h3>
              <button className="text-warning rounded-2 border-0 px-4 mb-2" onClick={() => navigate("/editProfile")}>EDITAR PERFIL</button>
              {user.is_admin === 1 && (
                <button className="text-warning rounded-2 border-0 px-3 mb-3"  onClick={() => navigate("/controlPanel")}>
                  PANEL DE ADMINISTRADOR
                </button>
              )}
            </div>

            <div className="profile-info d-flex flex-column gap-3 m-4 w-100 rounded-3">
              <h3 className="p-2 m-0 text-white">INFORMACIÓN PERSONAL</h3>
              <div className="info-div d-flex justify-content-around p-3">
                <div className="block p-1 d-flex flex-column gap-3">
                  {user?.email && (
                  <p>
                    <strong>Email:</strong> {user.email}
                  </p>
                  )}
                  {user?.phone_number && (
                  <p>
                    <strong>Teléfono:</strong> {user.phone_number}
                  </p>
                  )}
                  {user?.nationality && (
                  <p>
                    <strong>Nacionalidad:</strong> {user.nationality}
                  </p>
                  )}
                  {user?.user_address && (
                  <p>
                    <strong>Dirección:</strong> {user.user_address}
                  </p>
                  )}
                   {user?.zip_code && (
                  <p>
                    <strong>Código postal:</strong> {user.zip_code}
                  </p>
                  )}
                </div>
                <div className="block p-1 d-flex flex-column gap-3">
                  {user?.user_city && (
                    <p>
                      <strong>Ciudad:</strong> {user.user_city}
                    </p>
                  )}
                  {user?.province && (
                  <p>
                    <strong>Provincia:</strong> {user.province}
                  </p>
                  )}
                  {user?.user_country && (
                  <p>
                    <strong>País:</strong> {user.user_country}
                  </p>
                  )}
                  {user?.birth_date && (
                  <p>
                    <strong>Fecha de nacimiento:</strong> {user.birth_date}
                  </p>
                  )}
                  {user?.gender && (
                  <p>
                    <strong>Género:</strong> {user.gender}
                  </p>
                  )}
                  {user?.file ? (
                  <p>
                    <strong>Documento federativo:</strong> {user.file}
                  </p>
                  ) : (
                    <p>
                      <strong>Documento federativo:</strong> Ninguno
                    </p>
                  )}
                </div>
              </div>
          </div>
          </div>
          
          {/* Sección de eventos inscritos dentro del contenedor principal */}
          <div className="events-subs d-flex flex-column align-items-center rounded-3 mb-5">
            <h3 className="text-center text-white rounded-4 p-3 my-4">EVENTOS EN LOS QUE TE HAS INSCRITO</h3>
            {eventsInscription.length > 0 ? (
              <div className="subs-container d-flex flex-wrap justify-content-center gap-2 text-white">
                {eventsInscription.map((event) => (
                  <div className="sub-event-card w-25" key={event.event_id}>
                    <img
                      src={
                        event?.event_photo
                          ? `${ApiUrl}/images/event_images/${event?.event_photo}`
                          : "/images/background/event.webp"
                      }
                      alt={event.event_name}
                      className="event-image w-100 h-50"
                      onClick={() => navigate(`/eventInfo/${event.event_id}`)}
                    />
                    <div className="event-info p-3">
                      <h4>{event.event_name}</h4>
                      <p>
                        <strong>Deporte:</strong> {event.sport_name}
                      </p>
                      <p>
                        <strong>Categoría:</strong> {event.level_category}
                      </p>
                      <p>
                        <strong>Fecha de Inicio</strong> {event.date_start}
                      </p>
                    </div>
                    <button className="w-100 p-2 fw-bold" onClick={()=> onUnsub(event.event_id)}>CANCELAR INSCRIPCIÓN</button>
                  </div>
                ))}
              </div>
            ) : (
              <p>No estás inscrito en ningún evento.</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
