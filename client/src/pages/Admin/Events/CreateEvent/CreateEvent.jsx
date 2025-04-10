import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { ZodError } from "zod";
import { createEventSchema } from "../../../../schemas/createEventSchema";
import { fetchData } from "../../../../helpers/axiosHelper";
import { KingOfTheCourtContext } from "../../../../Context/ContextProvider";
import { Card, Row, Col, Image } from "react-bootstrap";
import "./CreateEvent.css";

const initialValue = {
  event_name: "",
  sport_name: "",
  level_category: "",
  gender: "",
  max_participants: 100,
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

export const CreateEvent = () => {
  const [newEvent, setNewEvent] = useState(initialValue);
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [errors, setErrors] = useState({});
  const [imageError, setImageError] = useState("");
  const [services, setServices] = useState([]);
  const navigate = useNavigate();
  const { token } = useContext(KingOfTheCourtContext);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        let result = await fetchData("/services/allServices", "get", null, {
          Authorization: `Bearer ${token}`,
        });
        setServices(result.data);
      } catch (error) {
        console.error("Error fetching services:", error);
      }
    };
    fetchServices();
  }, [token]);

  const handleChange = (e) => {
    const { name, type, checked, value } = e.target;

    setNewEvent((prevEvent) => ({
      ...prevEvent,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) {
      setImage(null);
      setImagePreview(null);
      return;
    }

    if (!file.type.match("image.*")) {
      setImageError("Por favor, selecciona un archivo de imagen válido");
      setImage(null);
      setImagePreview(null);
      return;
    }

    setImage(file);
    setImageError("");

    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
  };

  const handleServiceChange = (serviceId) => {
    setNewEvent((prevEvent) => {
      // Convertimos serviceId a número para consistencia
      const id = Number(serviceId);
      const isSelected = prevEvent.services_array.includes(id);

      return {
        ...prevEvent,
        services_array: isSelected
          ? prevEvent.services_array.filter((item) => item !== id)
          : [...prevEvent.services_array, id],
      };
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
    setErrors({});
    setImageError("");

    if (!image) {
      setImageError("Por favor, selecciona una imagen para el evento");
      return;
    }

    const formData = {
      ...newEvent,
      max_participants: Number(newEvent.max_participants),
      price: parseFloat(newEvent.price),
      status: Number(newEvent.status),
      services_array: newEvent.services_array.map((service) => Number(service)),
    };

    try {
      createEventSchema.parse(formData);

      let newFormData = new FormData();
      newFormData.append("data", JSON.stringify(formData));
      newFormData.append("img", image);

      await fetchData("/admin/CreateEvent", "post", newFormData, {
        Authorization: `Bearer ${token}`,
      });

      navigate("/adminPanelEvents");
    } catch (error) {
      if (error instanceof ZodError) {
        const fieldErrors = {};
        error.errors.forEach((err) => {
          fieldErrors[err.path[0]] = err.message;
        });
        setErrors(fieldErrors);
      } else {
        console.error("Error en la solicitud:", error);
      }
    }
  };

  return (
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
                  value={newEvent.event_name}
                />
                {errors.event_name && (
                  <Form.Text className="text-danger">
                    {errors.event_name}
                  </Form.Text>
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
                  value={newEvent.sport_name}
                />
                {errors.sport_name && (
                  <Form.Text className="text-danger">
                    {errors.sport_name}
                  </Form.Text>
                )}
              </Form.Group>

              <Form.Group className="mb-3" controlId="formSeason">
                <Form.Label className="text-warning">Temporada</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Ejemplo: 2024-2025"
                  onChange={handleChange}
                  name="season"
                  value={newEvent.season}
                />
                {errors.season && (
                  <Form.Text className="text-danger">{errors.season}</Form.Text>
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
                  value={newEvent.level_category}
                />
                {errors.level_category && (
                  <Form.Text className="text-danger">
                    {errors.level_category}
                  </Form.Text>
                )}
              </Form.Group>

              {/* Categoría de Género */}
              <Form.Group className="mb-3" controlId="formBasicGenderCategory">
                <Form.Label className="text-warning">
                  Categoría de Género
                </Form.Label>
                <Form.Control
                  as="select"
                  name="gender"
                  value={newEvent.gender}
                  onChange={handleChange}
                >
                  <option value="x">Seleccionar Genero</option>
                  <option value="Masculino">Masculino</option>
                  <option value="Femenino">Femenino</option>
                  <option value="Mixto">Mixto</option>
                </Form.Control>
                {errors.gender && (
                  <Form.Text className="text-danger">{errors.gender}</Form.Text>
                )}
              </Form.Group>
            </Col>

            <Col md={6}>
              {/* Máximos Participantes */}
              <Form.Group className="mb-3" controlId="formBasicMaxParticipants">
                <Form.Label className="text-warning">
                  Nº máximo de personas o equipos (100 por defecto)
                </Form.Label>
                <Form.Control
                  type="number"
                  placeholder="Selecciona o escribe el máximo"
                  onChange={handleChange}
                  name="max_participants"
                  value={newEvent.max_participants}
                />
                {errors.max_participants && (
                  <Form.Text className="text-danger">
                    {errors.max_participants}
                  </Form.Text>
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
                  value={newEvent.price}
                />
                {errors.price && (
                  <Form.Text className="text-danger">{errors.price}</Form.Text>
                )}
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
                  value={newEvent.description || ""}
                />
                {errors.description && (
                  <Form.Text className="text-danger">
                    {errors.description}
                  </Form.Text>
                )}
              </Form.Group>

              {/* ¿Es un evento de equipo? */}
              <Form.Group className="mb-3" controlId="formBasicIsTeamEvent">
                <Form.Check
                  type="checkbox"
                  label="¿Es un evento de equipo?"
                  onChange={(e) => handleChange(e)}
                  name="is_team_event"
                  checked={newEvent.is_team_event}
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="formBasicServices">
                <Form.Label className="text-warning">
                  Servicios Disponibles
                </Form.Label>
                <div className="services-checkbox-container">
                  {services.map((service) => (
                    <Form.Check
                      key={service.service_id}
                      type="checkbox"
                      id={`service-${service.service_id}`}
                      label={service.service_name}
                      value={service.service_id}
                      onChange={() => handleServiceChange(service.service_id)}
                      checked={newEvent.services_array.includes(
                        Number(service.service_id)
                      )}
                      className="service-checkbox"
                    />
                  ))}
                </div>
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
                  value={newEvent.date_start}
                />
                {errors.date_start && (
                  <Form.Text className="text-danger">
                    {errors.date_start}
                  </Form.Text>
                )}
              </Form.Group>

              {/* Hora de Inicio */}
              <Form.Group className="mb-3" controlId="formBasicTimeStart">
                <Form.Label className="text-warning">Hora de Inicio</Form.Label>
                <Form.Control
                  type="time"
                  onChange={handleChange}
                  name="time_start"
                  value={newEvent.time_start}
                />
                {errors.time_start && (
                  <Form.Text className="text-danger">
                    {errors.time_start}
                  </Form.Text>
                )}
              </Form.Group>

              {/* Fecha de Fin */}
              <Form.Group className="mb-3" controlId="formBasicDateEnd">
                <Form.Label className="text-warning">Fecha de Fin</Form.Label>
                <Form.Control
                  type="date"
                  onChange={handleChange}
                  name="date_end"
                  value={newEvent.date_end}
                />
                {errors.date_end && (
                  <Form.Text className="text-danger">
                    {errors.date_end}
                  </Form.Text>
                )}
              </Form.Group>

              {/* Hora de Fin */}
              <Form.Group className="mb-3" controlId="formBasicTimeEnd">
                <Form.Label className="text-warning">Hora de Fin</Form.Label>
                <Form.Control
                  type="time"
                  onChange={handleChange}
                  name="time_end"
                  value={newEvent.time_end}
                />
                {errors.time_end && (
                  <Form.Text className="text-danger">
                    {errors.time_end}
                  </Form.Text>
                )}
              </Form.Group>

              {/* Check In */}
              <Form.Group className="mb-3" controlId="formCheckIn">
                <Form.Label className="text-warning">Check In</Form.Label>
                <Form.Control
                  type="time"
                  onChange={handleChange}
                  name="check_in"
                  value={newEvent.check_in}
                />
                {errors.date_end && (
                  <Form.Text className="text-danger">
                    {errors.check_in}
                  </Form.Text>
                )}
              </Form.Group>

              {/* Estado */}
              <Form.Group className="mb-3" controlId="formBasicStatus">
                <Form.Label className="text-warning">Estado</Form.Label>
                <Form.Select
                  aria-label="Estado del evento"
                  onChange={handleChange}
                  name="status"
                  value={newEvent.status}
                >
                  <option value={0}>Seleccionar estado</option>
                  <option value={1}>Proximamente</option>
                  <option value={2}>Activo para Registro</option>
                  <option value={3}>Inscripción Cerrada</option>
                  <option value={4}>Cancelado</option>
                </Form.Select>
                {errors.status && (
                  <Form.Text className="text-danger">{errors.status}</Form.Text>
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
                  value={newEvent.event_city}
                />
                {errors.event_city && (
                  <Form.Text className="text-danger">
                    {errors.event_city}
                  </Form.Text>
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
                  value={newEvent.event_address}
                />
                {errors.event_address && (
                  <Form.Text className="text-danger">
                    {errors.event_address}
                  </Form.Text>
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
                  value={newEvent.event_country}
                />
                {errors.event_country && (
                  <Form.Text className="text-danger">
                    {errors.event_country}
                  </Form.Text>
                )}
              </Form.Group>

              {/* Enlace de Google Maps */}
              <Form.Group className="mb-3" controlId="formBasicGoogleMapsLink">
                <Form.Label className="text-warning">
                  Enlace de Google Maps
                </Form.Label>
                <Form.Control
                  type="url"
                  placeholder="Enlace de Google Maps"
                  onChange={handleChange}
                  name="google_maps_link"
                  value={newEvent.google_maps_link}
                />
                {errors.google_maps_link && (
                  <p className="msg-error">{errors.google_maps_link}</p>
                )}
                {!isIframeValid(newEvent.google_maps_link) && (
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
                  accept="image/*" // Solo imágenes serán aceptadas
                  onChange={handleFile} // Método para manejar el cambio del archivo
                  name="event_photo"
                />
                {imageError && (
                  <Form.Text className="text-danger">{imageError}</Form.Text>
                )}
                {imagePreview && (
                  <div className="mt-2">
                    <p className="text-warning">Vista previa:</p>
                    <Image
                      src={imagePreview}
                      alt="Vista previa de la imagen"
                      style={{ maxWidth: "100%", maxHeight: "200px" }}
                      thumbnail
                    />
                  </div>
                )}
              </Form.Group>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Botón de Envío */}
      <Button variant="primary" onClick={onSubmit}>
        Crear Evento
      </Button>
      <button className="btn btn-danger" onClick={() => navigate(`/adminPanelEvents`)}>Volver</button>
    </Form> 
  );
};
