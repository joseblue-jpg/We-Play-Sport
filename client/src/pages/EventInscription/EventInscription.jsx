import React, { useContext, useEffect, useState } from "react";
// import { inscriptionEmailsSchema } from "../../schemas/inscriptionEmailsSchema";
import { ZodError } from "zod";
import { BasicModal } from "../../Components/BasicModal/BasicModal";
import { fetchData } from "../../helpers/axiosHelper";
import { KingOfTheCourtContext } from "../../Context/ContextProvider";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import "./eventInscription.css";
import { Button, Col, Container, Form, Row } from "react-bootstrap";

const BackUrl = import.meta.env.VITE_SERVER_URL;

export const EventInscription = () => {
  const { event_id } = useParams();
  const [eventUnico, setEventUnico] = useState({});
  const { team, setTeam } = useOutletContext();
  const [inputEmail, setInputEmail] = useState({ email: "" });
  const [errorDuplicateEmail, setErrorDuplicateEmail] = useState();
  const [errorNoEmail, setErrorNoEmail] = useState();
  const [show, setShow] = useState(false);
  const [isPending, setIsPending] = useState(true);
  const { user, token } = useContext(KingOfTheCourtContext);
  const navigate = useNavigate();

  const handleClose = () => setShow(false);
  const handleShow = () => {
    setErrorDuplicateEmail();
    setErrorNoEmail();
    setShow(true);}

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        let result = await fetchData(`/events/oneEvent/${event_id}`, "get", null, {
          Authorization: `Bearer ${token}`,
        });
        setEventUnico(result.data); //=>setEventUnico(result.data[0])

      } catch (error) {
        console.log(error);
      }
    };
    fetchEvents();
  }, []);

  const addMember = (e) => {
    e.preventDefault();

    try {
      //inscriptionEmailsSchema.parse(inputEmail);

      if (!team.members.includes(inputEmail.email)) {
        setTeam({ ...team, members: [...team.members, inputEmail.email] });
        setInputEmail({ email: "" });
        setErrorDuplicateEmail();
        setErrorNoEmail();
      } else {
        throw new Error("Email duplicado");
      }
    } catch (error) {
      if (error instanceof ZodError) {
        setInputEmail({ email: "" });
        setErrorDuplicateEmail(error.errors[0].message);
      } else {
        setErrorDuplicateEmail(error.message);
      }
    }
  };

  const handleChange = (e) => {
    setInputEmail({ email: e.target.value });
  };

  const deleteMember = (email) => {
    setTeam({
      ...team,
      members: team.members.filter((elem) => elem !== email),
    });
  };

  const onSubmitTeam = async () => {
    try {
      let dataTeam = {
        ...team,
        team_owner: user.user_id,
      };
      let res = await fetchData("/users/eventInscription", "post", dataTeam, {
        Authorization: `Bearer ${token}`,
      });
      setTeam({ ...team, team_id: res.data.team_id, team_owner: user.user_id });
      setIsPending(false);
      handleClose();
      navigate("paymentEvent");
    } catch (error) {
      console.log(error);
      setErrorNoEmail(error.response.data);
    }
  };

  const onSubmitIndividual = async () => {
    try {
      let dataTeam = {
        ...team,
        team_name: "Participación individual",
        team_owner: user.user_id,
      };

      let data = await fetchData(
        "/users/eventInscriptionIndividual",
        "post",
        dataTeam,
        {
          Authorization: `Bearer ${token}`,
        }
      );
      setTeam({
        ...team,
        team_id: data.data.team_id,
        team_owner: user.user_id,
      });
     

      navigate("paymentEvent");
    } catch (error) {
      console.log(error);
    }
  };

  const validateEmail =(text)=>{
    let emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(text);
  }

  return (
    <section className="event-inscription-main">
      <Container className="d-flex justify-content-center" fluid="xxl">
        <Row>
          <Col xs="12" md="8" xl="6" className="">
            <div className="inscriptionForm register-form">
              <p>Te vas a inscribir en...</p>
              <h2 className="pb-3">{eventUnico.event_name}</h2>
              <img
                className="imgInscriptionEvent"
                src={
                  eventUnico.event_photo
                    ? `${BackUrl}/images/event_images/${eventUnico.event_photo}`
                    : "/images/background/event.jpeg"
                }
                alt="Evento"
              />
              <div className="py-2">
                <h2>{eventUnico.event_city}</h2>
                <h2>
                  {/* {eventUnico?.time_start.split(":")[0]}:
                  {eventUnico?.time_start.split(":")[1]}
                  {eventUnico?.time_end.split(":")[0]}:
                  {eventUnico?.time_end.split(":")[1]}  */}
                  {eventUnico.date_start}{eventUnico.time_start && (
                      <p>{eventUnico.time_start.split(":")[0]}:{eventUnico.time_start.split(":")[1]}</p>
                    )}
                </h2>

                <h3>
                  Categoría {eventUnico.level_category}{" "}
                  {eventUnico.gender_category}
                </h3>
              </div>
              {eventUnico.is_team_event === 1 ? (
                <Form>
                  <div className="startForm border border-2 border-secondary rounded mt-4 p-3">
                    <h4>Para participar debes tener un equipo</h4>
                    <p>
                      Si tu(s) compañero(s) ya ha(n) creado un equipo, debes
                      tener una invitación a su equipo en tu email.
                    </p>
                    <p className="mb-0">
                      Si eres tú la persona que va a crearlo, introduce los
                      emails de tus compañeros a continuación para que reciban
                      una invitación a tu equipo:
                    </p>
                  </div>
                  <div className="d-md-flex column-gap-3">
                    <Form.Group
                      className="mt-4 flex-grow-1"
                      controlId="formTeamName"
                    >
                      <Form.Label>Nombre del equipo</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Nombre equipo"
                        onChange={(e) =>
                          setTeam({ ...team, team_name: e.target.value })
                        }
                        value={team.team_name}
                        autoFocus
                      />
                    </Form.Group>
                    <Form.Group
                      className="mt-4 flex-grow-1"
                      controlId="formTeamParticipantName"
                    >
                      <Form.Label htmlFor="">Email de tu compañero</Form.Label>
                      <Form.Control
                        type="email"
                        placeholder="Email compañero"
                        value={inputEmail.email}
                        onChange={handleChange}
                      />
                      {errorDuplicateEmail && <p style={{ color: "red" }}>{errorDuplicateEmail}</p>}
                    </Form.Group>
                  </div>
                  <Button
                    variant="warning fw-bold"
                    className="mt-3 button-event-inscription"
                    onClick={addMember}
                    disabled={!inputEmail.email || !team.team_name || !validateEmail(inputEmail.email)}
                  >
                    Añadir
                  </Button>
                  {team.team_name && (
                    <div className="border border-2 border-secondary rounded mt-5 p-3">
                      <h3>Equipo "{team.team_name}"</h3>
                      {team.members.map((email) => {
                        return (
                          <div className="d-flex justify-content-between mt-3">
                            <p key={email}>{email}</p>
                            <Button
                              variant="danger fw-bold"
                              className="button-event-inscription"
                              onClick={() => deleteMember(email)}
                            >
                              Quitar
                            </Button>
                          </div>
                        );
                      })}
                      <Button
                        variant="warning fw-bold"
                        className="button-event-inscription mt-3"
                        type="button"
                        onClick={handleShow}
                        disabled={team.members.length === 0}
                      >
                        Enviar
                      </Button>
                    </div>
                  )}
                </Form>
              ) : null}
              <div className="d-flex gap-3 mt-5">
                {eventUnico.is_team_event === 0 ? (
                  <Button
                    variant="warning fw-bold"
                    className="button-event-inscription"
                    onClick={onSubmitIndividual}
                  >
                    Siguiente paso
                  </Button>
                ) : null}
                <Button
                  variant="secondary fw-bold"
                  className="button-event-inscription"
                  onClick={() => navigate(`/eventInfo/${team.event_id}`)}
                >
                  Volver
                </Button>
              </div>
            </div>
          </Col>

          <BasicModal
            handleClose={handleClose}
            onSubmit={onSubmitTeam}
            title="Confirmar emails"
            show={show}
          >
            <div>
              <h3>Equipo: {team.team_name}</h3>
              <h2>Confirma los emails de tus compañeros de equipo</h2>
              {team.members.map((email) => {
                return <p key={email}>{email}</p>;
              })}
              {errorNoEmail === "Email inexistente" && (
               <p className="msg-error">Todos los participantes tienen que tener cuenta registrada en WEPLAY para poder recibir un email de invitación.</p>
              )}
            </div>
          </BasicModal>
        </Row>
      </Container>
    </section>
  );
};
