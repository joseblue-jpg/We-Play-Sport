import React, { useEffect, useState } from 'react'
import { fetchData } from '../../helpers/axiosHelper';
import { useNavigate, useParams } from 'react-router-dom';
import Swal from "sweetalert2";
import "./confirmTeam.css";
import { Button } from 'react-bootstrap';

export const ConfirmTeam = () => {

    const {token} = useParams();
    const [teamData, setTeamData] = useState();
    const [eventData, setEventData] = useState();
    const [user_id, setUser_id] = useState();
    const navigate = useNavigate();

    useEffect(()=>{
        const fetchTeamData = async()=>{

            try {                
                let result = await fetchData(`/users/acceptInvitationGet`, "get", null, {Authorization: `Bearer ${token}` });
                setTeamData(result.data.team_data);
                setEventData(result.data.event_data);
                setUser_id(result.data.user_id);
            } 
            catch (error) {
                console.log(error);
            }
        };
        fetchTeamData();
    },[]);    
    
    const onSubmit = async()=>{
        // Mostrar alerta de confirmación antes de aceptar la invitación
        const { isConfirmed } = await Swal.fire({
            title: "¿Aceptar invitación?",
            text: "¿Estás seguro de que quieres unirte al equipo para este evento?",
            icon: "question",
            showCancelButton: true,
            confirmButtonColor: "#28a745", // Verde para confirmar
            cancelButtonColor: "#d33", // Rojo para cancelar
            confirmButtonText: "Sí, aceptar",
            cancelButtonText: "No, cancelar",
        });

    // Si el usuario cancela, no se hace nada
    if (!isConfirmed) return;

        try {
            // Enviar solicitud al backend para aceptar la invitación
            await fetchData("/users/acceptInvitationButton", "post", {
                team_id: teamData.team_id,
                user_id,
                event_id: eventData.event_id,
            },
            {
                Authorization: `Bearer ${token}`,
            });

            // Mostrar mensaje de éxito y redirigir
            Swal.fire({
                title: "¡Invitación aceptada!",
                text: "Has sido añadido al equipo con éxito.",
                icon: "success",
                confirmButtonColor: "#3085d6",
                confirmButtonText: "Aceptar",
            })
            .then(() => {
                navigate("/invitationOk");
            });
        } 
        catch (error) {
            console.log(error);

            // Mostrar mensaje de error y redirigir
            Swal.fire({
                title: "Error",
                text: "No se pudo aceptar la invitación. Inténtalo nuevamente.",
                icon: "error",
                confirmButtonColor: "#d33",
                confirmButtonText: "Aceptar",
            })
            .then(() => {
                navigate("/invitationFailed");
            });
        }
    };

  return (
    <section className='confirm-team-main'>

            <div className='verified-msg-confirm-team'>
                <h2 className='fs-2 fw-bold'>Unirse al equipo {teamData?.team_name} </h2>
                <p className='fs-4'>Confirma tu asistencia al siguiente evento:</p>
                <p className='fs-5 fw-bold text-light'>{eventData?.event_name}</p>
                <p className='fs-5 fw-bold text-light'>{eventData?.date_start}</p>
                <p className='fs-5 fw-bold text-light'>{eventData?.time_start.split(":")[0]}:{eventData?.time_start.split(":")[1]}</p>
                <Button className='button-confirm-team' onClick={onSubmit}>Confirmar</Button>
            </div>

    </section>
  )
}
