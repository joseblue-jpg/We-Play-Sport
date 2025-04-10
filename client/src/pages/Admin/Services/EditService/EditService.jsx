import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Image from "react-bootstrap/Image";
import { ZodError } from "zod";
import { createServiceSchema } from "../../../../schemas/createServiceSchema";
import { fetchData } from "../../../../helpers/axiosHelper";
import { KingOfTheCourtContext } from "../../../../Context/ContextProvider";
import { Card, Row, Col } from "react-bootstrap";
import './editService.css'

const ApiUrl = import.meta.env.VITE_SERVER_URL;

export const EditService = () => {
  const [editService, setEditService] = useState();
  const [image, setImage] = useState();
  const [imagePreview, setImagePreview] = useState();
  const [errors, setErrors] = useState({});
  const { token } = useContext(KingOfTheCourtContext);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchService = async () => {
      try {
        let result = await fetchData(
          `/services/serviceById/${id}`,
          "get",
          null,
          { Authorization: `Bearer ${token}` }
        );
        setEditService(result.data[0]);
      } catch (error) {
        console.log(error);
      }
    };

    fetchService();
  }, []);

  const handleChange = (e) => {
    setEditService({ ...editService, service_name: e.target.value });
  };

  const handleFile = (e) => {
    const selectedFile = e.target.files[0];
    setImage(selectedFile);

    // Create image preview
    if (selectedFile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(selectedFile);
    } else {
      setImagePreview(null);
    }
  };

  const onSubmit = async () => {
    try {
      createServiceSchema.parse(editService);
      let newFormData = new FormData();
      newFormData.append("data", JSON.stringify(editService));
      if (image) {
        newFormData.append("img", image);
      }
      await fetchData("/services/editService", "put", newFormData, {
        Authorization: `Bearer ${token}`,
      });
     
      navigate("/adminPanelServices");
    } catch (error) {
      console.log(error);
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
    <div className="adminPanelEvents-ppal d-flex justify-content-center">
      <Form className="admin-edit-service-form m-5">
        <Button 
          className="btn-1 border-0 w-50 rounded-0 text-black" 
          variant="primary" 
          onClick={onSubmit}
        >
          MODIFICAR
        </Button>
        <Button 
          className="btn-2 border-0 w-50 rounded-0" 
          variant="primary" 
          onClick={() => navigate("/adminPanelServices")}
        >
          VOLVER
        </Button>
        <Card className="mb-4 rounded-0 border-0">
          <Card.Body className="event-form">
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3" controlId="formBasicServiceName">
                  <Form.Label className="text-warning">
                    Nombre del Servicio
                  </Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Ejemplo: Duchas"
                    onChange={handleChange}
                    name="service_name"
                    value={editService ? editService.service_name : ""}
                  />
                  {errors.service_name && <p className="msg-error">{errors.service_name}</p>}
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicServicePhoto">
                  <Form.Label className="text-warning">
                    Foto del Servicio
                  </Form.Label>
                  <Form.Control
                    type="file"
                    onChange={handleFile}
                    name="service_photo"
                  />
                </Form.Group>
                {imagePreview ? (
                  <div className="image-preview mt-3">
                    <img 
                      src={imagePreview} 
                      alt="Preview" 
                      className="img-fluid rounded"
                      style={{ 
                        maxHeight: '200px', 
                        objectFit: 'cover' 
                      }}
                    />
                  </div>
                ) : editService?.service_photo ? (
                  <div className="img-preview mt-2">
                    <p className="text-warning">Imagen actual:</p>
                    <Image
                      src={`${ApiUrl}/images/service/${editService.service_photo}`} 
                      alt="Imagen actual"
                      style={{ maxWidth: "100%", maxHeight: "200px" }}
                      thumbnail
                    />
                  </div>
                ) : null}
              </Col>
            </Row>
          </Card.Body>
        </Card>
      </Form>
    </div>
  );
};