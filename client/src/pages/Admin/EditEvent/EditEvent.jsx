import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { KingOfTheCourtContext } from "../../../Context/ContextProvider";
import { Card, Row, Col, Form, Button, Image } from "react-bootstrap";
import { fetchData } from "../../../helpers/axiosHelper";
import { createEventSchema } from "../../../schemas/createEventSchema";
import { ZodError } from "zod";
import "./editEvent.css";

const ApiUrl = import.meta.env.VITE_SERVER_URL;

const initialValue = {
  event_name: "",
  sport_name: "",
  level_category: "",
  gender: "",
  max_participants: 0,
  description: "",
  is_team_event: false,
  date_start: "",
  time_start: "",
  date_end: "",
  time_end: "",
  check_in: "",
  event_city: "",
  event_address: "",
  event_country: "",
  google_maps_link: "",
  price: "",
  season: "",
  status: "",
  services_array: [], // Inicializado como array vacío
};

export const EditEvent = () => {
  const { token } = useContext(KingOfTheCourtContext);
  const { event_id } = useParams();
  const [eventEdit, setEventEdit] = useState(initialValue);
  const [eventphoto, setEventPhoto] = useState();
  const [imagePreview, setImagePreview] = useState();
  const [errors, setErrors] = useState({});
  const [services, setServices] = useState([]);
  const [selectedServices, setSelectedServices] = useState([]);
  const navigate = useNavigate();

  // Cargar servicios disponibles
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const result = await fetchData("/services/allServices", "get", null, {
          Authorization: `Bearer ${token}`,
        });
        

        setServices(result.data);
      } catch (error) {
        console.error("Error al cargar servicios:", error);
      }
    };
    fetchServices();
  }, [token]);

  useEffect(() => {
    const fetchSelectedServices = async () => {
      try {
        const result = await fetchData(
          `/services/servicesEvents/${event_id}`,
          "get",
          null,
          {
            Authorization: `Bearer ${token}`,
          }
        );

        // Extraer solo los IDs de los servicios seleccionados
        const serviceIds = result.data.result.map(
          (service) => service.service_id
        );
        setSelectedServices(serviceIds);
      } catch (error) {
        console.log(error);
      }
    };
    fetchSelectedServices();
  }, []);

  // Cargar datos del evento a editar
  useEffect(() => {
    const fetchEditEvents = async () => {
      try {
        let result = await fetchData(`/events/oneEvent/${event_id}`, "get", {
          Authorization: `Bearer ${token}`,
        });
        setEventEdit(result.data);

        // Extraer los IDs de servicios del evento
        if (result.data.services && Array.isArray(result.data.services)) {
          const serviceIds = result.data.services.map((service) =>
            typeof service === "object" ? service.service_id : service
          );
          setSelectedServices(serviceIds);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchEditEvents();
  }, [event_id]);

  const handleEventPhotoChange = (e) => {
    const file = e.target.files[0];
    if (!file) {
      setEventPhoto(null);
      setImagePreview(null);
      return;
    }

    setEventPhoto(file);

    // Crear vista previa de la imagen
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
  };

  const handleChange = (e) => {
    const { name, type, checked, value } = e.target;

    setEventEdit((prevState) => ({
      ...prevState,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Función para manejar el cambio de servicios
  const handleServiceChange = (e) => {
    const serviceId = Number(e.target.value);

    setSelectedServices((prevServices) => {
      if (prevServices.includes(serviceId)) {
        return prevServices.filter((id) => id !== serviceId);
      } else {
        return [...prevServices, serviceId];
      }
    });
  };

  const isIframeValid = (html) => {
    // Expresión regular para detectar un solo <iframe> válido
    const iframeRegex =
      /^<iframe[^>]*src=["']https?:\/\/[^"']+["'][^>]*><\/iframe>$/i;

    // Verificar que el contenido coincida con la expresión regular
    return iframeRegex.test(html.trim());
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = {
        ...eventEdit,
        price: parseFloat(eventEdit.price),
        max_participants: Number(eventEdit.max_participants),
        gender: String(eventEdit.gender),
        is_team_event: Boolean(eventEdit.is_team_event),
        time_start: String(eventEdit.time_start),
        status: Number(eventEdit.status),
        services: selectedServices,
      };
  

      createEventSchema.parse(formData);

      const newFormData = new FormData();
      newFormData.append("data", JSON.stringify(formData));
      if (eventphoto) {
        newFormData.append("img", eventphoto);
      }

      const response = await fetchData(
        `/admin/EditEvent/${event_id}`,
        "put",
        newFormData,
        {
          Authorization: `Bearer ${token}`,
        }
      );

      if (response.data) {
        setEventEdit({ ...eventEdit, event_photo: response.data.event_photo });
        navigate("/adminPanelEvents");
      } else {
        console.error("No se recibieron datos del backend");
      }
    } catch (error) {
      if (error instanceof ZodError) {
        const fieldErrors = {};
        error.errors.forEach((err) => {
          fieldErrors[err.path[0]] = err.message;
        });
        setErrors(fieldErrors);
      } else {
        console.log(error);
      }
    }
  };
  return (
    <>
      <Form>
        {/* Primera sección: Información Básica */}
        <Card className="mb-4">
          <Card.Header className="bg-primary text-white">
            Información Básica
          </Card.Header>
          <Card.Body className="event-form">
            <Row>
              <Col md={6}>
                {/* Nombre del Evento */}
                <Form.Group className="mb-3" controlId="formBasicEventName">
                  <Form.Label className="text-warning">
                    Nombre del Evento
                  </Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Ejemplo: Torneo de Fútbol"
                    onChange={handleChange}
                    name="event_name"
                    value={eventEdit?.event_name || ""}
                    required
                  />
                  {errors.event_name && (
                    <p className="msg-error">{errors.event_name}</p>
                  )}
                </Form.Group>

                {/* Deporte */}
                <Form.Group className="mb-3" controlId="formBasicSport">
                  <Form.Label className="text-warning">Deporte</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Ejemplo: Fútbol, Baloncesto"
                    onChange={handleChange}
                    name="sport_name"
                    value={eventEdit?.sport_name || ""}
                    required
                  />
                  {errors.sport_name && (
                    <p className="msg-error">{errors.sport_name}</p>
                  )}
                </Form.Group>

                {/* Temporada */}
                <Form.Group className="mb-3" controlId="formSeason">
                  <Form.Label className="text-warning">Temporada</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Ejemplo: 2024-2025"
                    onChange={handleChange}
                    name="season"
                    value={eventEdit?.season || ""}
                    required
                  />
                  {errors.season && (
                    <p className="msg-error">{errors.season}</p>
                  )}
                </Form.Group>

                {/* Categoría de Nivel */}
                <Form.Group className="mb-3" controlId="formBasicLevelCategory">
                  <Form.Label className="text-warning">
                    Categoría de Nivel
                  </Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Ejemplo: Oro, Plata..."
                    onChange={handleChange}
                    name="level_category"
                    value={eventEdit?.level_category || ""}
                  />
                  {errors.level_category && (
                    <p className="msg-error">{errors.level_category}</p>
                  )}
                </Form.Group>

                {/* Categoría de Género */}
                <Form.Group
                  className="mb-3"
                  controlId="formBasicGenderCategory"
                >
                  <Form.Label className="text-warning">
                    Categoría de Género
                  </Form.Label>
                  <Form.Control
                    as="select"
                    name="gender"
                    value={eventEdit?.gender || "masc"}
                    onChange={handleChange}
                  >
                    <option value="masc">Masculino</option>
                    <option value="fem">Femenino</option>
                    <option value="mix">Mixto</option>
                  </Form.Control>
                  {errors.gender && (
                    <p className="msg-error">{errors.gender}</p>
                  )}
                </Form.Group>
              </Col>

              <Col md={6}>
                {/* Máximos Participantes */}
                <Form.Group
                  className="mb-3"
                  controlId="formBasicMaxParticipants"
                >
                  <Form.Label className="text-warning">
                    Nº máximo de personas o equipos
                  </Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="Número máximo de participantes"
                    onChange={handleChange}
                    name="max_participants"
                    value={eventEdit?.max_participants || ""}
                  />
                  {errors.max_participants && (
                    <p className="msg-error">{errors.max_participants}</p>
                  )}
                </Form.Group>

                {/* Precio */}
                <Form.Group className="mb-3" controlId="formBasicPrice">
                  <Form.Label className="text-warning">Precio</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="Ejemplo: 19.99"
                    onChange={handleChange}
                    name="price"
                    value={eventEdit?.price || ""}
                  />
                  {errors.price && <p className="msg-error">{errors.price}</p>}
                </Form.Group>

                {/* Descripción */}
                <Form.Group className="mb-3" controlId="formBasicDescription">
                  <Form.Label className="text-warning">Descripción</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    placeholder="Descripción del evento"
                    onChange={handleChange}
                    name="description"
                    value={eventEdit?.description || ""}
                  />
                  {errors.description && (
                    <p className="msg-error">{errors.description}</p>
                  )}
                </Form.Group>

                {/* ¿Es un evento de equipo? */}
                <Form.Group className="mb-3" controlId="formBasicIsTeamEvent">
                  <Form.Check
                    type="checkbox"
                    label="¿Es un evento de equipo?"
                    onChange={handleChange}
                    name="is_team_event"
                    checked={eventEdit?.is_team_event || false}
                  />
                  {errors.is_team_event && (
                    <p className="msg-error">{errors.is_team_event}</p>
                  )}
                </Form.Group>

                {/* Servicios Disponibles */}
                <Form.Group className="mb-3" controlId="formBasicServices">
                  <Form.Label className="text-warning">
                    Servicios Disponibles
                  </Form.Label>
                  {services.map((service) => (
                    <Form.Check
                      key={service.service_id}
                      type="checkbox"
                      label={service.service_name}
                      value={service?.service_id}
                      onChange={handleServiceChange}
                      checked={selectedServices.includes(service.service_id)} // Asegúrate de que esto esté correcto
                    />
                  ))}
                </Form.Group>
              </Col>
            </Row>
          </Card.Body>
        </Card>

        {/* Segunda sección: Ubicación y Detalles */}
        <Card className="mb-4">
          <Card.Header className="bg-secondary text-white">
            Ubicación y Detalles
          </Card.Header>
          <Card.Body className="event-form">
            <Row>
              <Col md={6}>
                {/* Fecha de Inicio */}
                <Form.Group className="mb-3" controlId="formBasicDateStart">
                  <Form.Label className="text-warning">
                    Fecha de Inicio
                  </Form.Label>
                  <Form.Control
                    type="date"
                    onChange={handleChange}
                    name="date_start"
                    value={eventEdit?.date_start}
                  />
                  {errors.date_start && (
                    <p className="msg-error">{errors.date_start}</p>
                  )}
                </Form.Group>

                {/* Hora de Inicio */}
                <Form.Group className="mb-3" controlId="formBasicTimeStart">
                  <Form.Label className="text-warning">
                    Hora de Inicio
                  </Form.Label>
                  <Form.Control
                    type="time"
                    onChange={handleChange}
                    name="time_start"
                    value={eventEdit?.time_start}
                  />
                  {errors.time_start && (
                    <p className="msg-error">{errors.time_start}</p>
                  )}
                </Form.Group>

                {/* Fecha de Fin */}
                <Form.Group className="mb-3" controlId="formBasicDateEnd">
                  <Form.Label className="text-warning">Fecha de Fin</Form.Label>
                  <Form.Control
                    type="date"
                    onChange={handleChange}
                    name="date_end"
                    value={eventEdit?.date_end}
                  />
                  {errors.date_end && (
                    <p className="msg-error">{errors.date_end}</p>
                  )}
                </Form.Group>

                {/* Hora de Fin */}
                <Form.Group className="mb-3" controlId="formBasicTimeEnd">
                  <Form.Label className="text-warning">Hora de Fin</Form.Label>
                  <Form.Control
                    type="time"
                    onChange={handleChange}
                    name="time_end"
                    value={eventEdit?.time_end}
                  />
                  {errors.time_end && (
                    <p className="msg-error">{errors.time_end}</p>
                  )}
                </Form.Group>

                {/* Check In */}
                <Form.Group className="mb-3" controlId="formCheckIn">
                  <Form.Label className="text-warning">Check In</Form.Label>
                  <Form.Control
                    type="time"
                    onChange={handleChange}
                    name="check_in"
                    value={eventEdit?.check_in}
                  />
                  {errors.check_in && (
                    <p className="msg-error">{errors.check_in}</p>
                  )}
                </Form.Group>

                {/* Estado */}
                <Form.Group className="mb-3" controlId="formBasicStatus">
                  <Form.Label className="text-warning">Estado</Form.Label>
                  <Form.Select
                    aria-label="Estado del evento"
                    onChange={handleChange}
                    name="status"
                    value={eventEdit?.status}
                  >
                    <option value={0}>Seleccionar estado del evento</option>
                    <option value={1}>Proximamente</option>
                    <option value={2}>Activo para Registro</option>
                    <option value={3}>Inscripción Cerrada</option>
                    <option value={4}>Cancelado</option>
                  </Form.Select>
                  {errors.status && (
                    <p className="msg-error">{errors.status}</p>
                  )}
                </Form.Group>
              </Col>

              <Col md={6}>
                {/* Ciudad */}
                <Form.Group className="mb-3" controlId="formBasicEventCity">
                  <Form.Label className="text-warning">Ciudad</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Ejemplo: Ciudad de México"
                    onChange={handleChange}
                    name="event_city"
                    value={eventEdit?.event_city}
                  />
                  {errors.event_city && (
                    <p className="msg-error">{errors.event_city}</p>
                  )}
                </Form.Group>

                {/* Dirección */}
                <Form.Group className="mb-3" controlId="formBasicEventAddress">
                  <Form.Label className="text-warning">Dirección</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Dirección del evento"
                    onChange={handleChange}
                    name="event_address"
                    value={eventEdit?.event_address}
                  />
                  {errors.event_address && (
                    <p className="msg-error">{errors.event_address}</p>
                  )}
                </Form.Group>

                {/* País */}
                <Form.Group className="mb-3" controlId="formBasicEventCountry">
                  <Form.Label className="text-warning">País</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="País del evento"
                    onChange={handleChange}
                    name="event_country"
                    value={eventEdit?.event_country}
                  />
                  {errors.event_country && (
                    <p className="msg-error">{errors.event_country}</p>
                  )}
                </Form.Group>

                {/* Enlace de Google Maps */}
                <Form.Group
                  className="mb-3"
                  controlId="formBasicGoogleMapsLink"
                >
                  <Form.Label className="text-warning">
                    Enlace de Google Maps
                  </Form.Label>
                  <Form.Control
                    type="url"
                    placeholder="Enlace de Google Maps"
                    onChange={handleChange}
                    name="google_maps_link"
                    value={eventEdit?.google_maps_link}
                    required
                  />
                  {errors.google_maps_link && (
                    <p className="msg-error">{errors.google_maps_link}</p>
                  )}
                  {!isIframeValid(eventEdit.google_maps_link) && (
                    <p className="msg-error">
                      Este campo tiene que ser un iframe
                    </p>
                  )}
                </Form.Group>

                {/* Foto del Evento */}
                <Form.Group className="mb-3" controlId="formBasicEventPhoto">
                  <Form.Label className="text-warning">
                    Foto del Evento
                  </Form.Label>
                  <Form.Control
                    type="file"
                    accept="image/*"
                    onChange={handleEventPhotoChange}
                    name="event_photo"
                    // value={eventEdit?.event_photo}
                  />
                  {errors.event_photo && (
                    <p className="msg-error">{errors.event_photo}</p>
                  )}

                  {/* Previsualización de la imagen */}
                  {imagePreview ? (
                    <div className="img-preview mt-2">
                      <p className="text-warning">Vista previa:</p>
                      <Image
                        src={imagePreview}
                        alt="Vista previa"
                        style={{ maxWidth: "100%", maxHeight: "200px" }}
                        thumbnail
                      />
                    </div>
                  ) : eventEdit?.event_photo ? (
                    <div className="img-preview mt-2">
                      <p className="text-warning">Imagen actual:</p>
                      <Image
                        src={
                          eventEdit?.event_photo
                            ? `${ApiUrl}/images/event_images/${eventEdit?.event_photo}`
                            : "/images/background/event.jpeg"
                        }
                        alt="Imagen actual"
                        style={{ maxWidth: "100%", maxHeight: "200px" }}
                        thumbnail
                      />
                    </div>
                  ) : null}
                </Form.Group>
              </Col>
            </Row>
          </Card.Body>
        </Card>

        {/* Botón de Envío */}
        <Button variant="primary" onClick={onSubmit}>
          Editar Evento
        </Button>
        <p>{eventEdit?.service_name}</p>
        {/* Botón de Volver */}
        <Button
          variant="danger"
          onClick={() => navigate("/adminPanelEvents")}
          className="ms-2"
        >
          Volver
        </Button>
      </Form>
    </>
  );
};
