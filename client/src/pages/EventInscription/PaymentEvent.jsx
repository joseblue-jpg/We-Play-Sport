import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useOutletContext } from "react-router-dom";
import Swal from "sweetalert2";
import { fetchData } from "../../helpers/axiosHelper";
import { Button } from "react-bootstrap";
import "./paymentEvent.css";
import { KingOfTheCourtContext } from '../../Context/ContextProvider';

export const PaymentEvent = () => {
  const { team, setTeam } = useOutletContext();
  const [paymentData, setPaymentData] = useState({});
  const navigate = useNavigate();
  const {token} = useContext(KingOfTheCourtContext);

  useEffect(() => {
    const fetchPaymentData = async () => {
      try {
        let res = await fetchData("/users/paymentData", "post", team, {
                    Authorization: `Bearer ${token}`,
                  });
        setPaymentData(res.data.data);
    
      } catch (error) {
        console.log(error);
      }
    };
    fetchPaymentData();
  }, []);


  const onSubmit = async () => {
    // Confirmación antes de procesar el pago
    const { isConfirmed } = await Swal.fire({
      title: "¿Confirmar pago?",
      text: "¿Estás seguro de que deseas realizar el pago y completar la inscripción?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#28a745",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, pagar",
      cancelButtonText: "Cancelar",
    });

    if (!isConfirmed) return; // Si cancela, no hace nada

        try {
            await fetchData("/users/finalInscription", "post", {
                user_id: team.team_owner,
                team_id: team.team_id,
                event_id: team.event_id,
                members: team.members,
            },
            {
                Authorization: `Bearer ${token}`,
            });

            const fetchEventIsFull = async ()=>{
              try {
                await fetchData(`/events/eventIsFull/${team.event_id}`, `post`);        
                
              } 
              catch (error) {        
               
                console.log(error);
              }
            }
        
              fetchEventIsFull();


      // Mensaje de éxito y redirección
      Swal.fire({
        title: "Pago exitoso",
        text: "Tu inscripción ha sido completada con éxito.",
        icon: "success",
        confirmButtonColor: "#3085d6",
        confirmButtonText: "Aceptar",
      }).then(() => {

        navigate("/invitationOk");
      });
    } catch (error) {
      console.log(error);

      // Mensaje de error y redirección
      Swal.fire({
        title: "Error",
        text: "Hubo un problema al procesar el pago. Inténtalo nuevamente.",
        icon: "error",
        confirmButtonColor: "#d33",
        confirmButtonText: "Aceptar",
      }).then(() => {
        navigate("/invitationFailed");
      });
    }
  };

  const onCancel = async () => {
    try {
      await fetchData("/users/cancelTeamEvent", "delete", {team_id: team.team_id}, {
        Authorization: `Bearer ${token}`,
      })
      navigate(-1); // Regresar a la pantalla anterior
    } 
    catch (error) {
      console.log(error);
        
    }
  };

  return (
    <section className="payment-main">
      <div className="verified-msg-payment">
        <h1>Haz el pago para completar la inscripción</h1>
        <Button
          variant="warning fw-bold"
          className="button-payment"
          onClick={onSubmit}
        >
          Realizar pago
        </Button>
        <Button
          variant="danger fw-bold"
          className="button-payment"
          onClick={onCancel}
        >
          Cancelar
        </Button>
      </div>
    </section>
  );
};
