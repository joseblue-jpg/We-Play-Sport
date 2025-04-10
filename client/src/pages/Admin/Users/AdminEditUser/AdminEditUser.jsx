import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Button, Form, Image } from "react-bootstrap";
import { KingOfTheCourtContext } from "../../../../Context/ContextProvider";
import { fetchData } from "../../../../helpers/axiosHelper";
import adminEditUserSchema from "../../../../schemas/adminEditUserSchema";
import { ZodError } from "zod";
import './adminEditUser.css'

const ApiUrl = import.meta.env.VITE_SERVER_URL;

const initialValues = {
  user_name: "",
  last_name: "",
  birth_date: "",
  file: "",
  gender: "",
  identity_doc: "",
  nationality: "",
  phone_number: "",
  province: "",
  user_address: "",
  user_city: "",
  user_country: "",
  zip_code: "",
  is_federated: 0,
  is_disabled: 0,
  is_verified: 0,
  is_admin: 0
};

export const AdminEditUser = () => {
  let { user_id } = useParams();
  user_id = parseInt(user_id);
  const navigate = useNavigate();
  const { token } = useContext(KingOfTheCourtContext);
  
  const [userData, setUserData] = useState(initialValues);
  const [editUserData, setEditUserData] = useState(initialValues);
  const [profilePic, setProfilePic] = useState(null);
  // const [profilePicPreview, setProfilePicPreview] = useState(null);
  const [federatedFile, setFederatedFile] = useState(null);
  const [errors, setErrors] = useState({});

  // Fetch user data on component mount
  useEffect(() => {
    const fetchUser = async () => {
      try {
        let temp = await fetchData(
          `/admin/AdminOneUser/${user_id}`,
          "get",
          null,
          { Authorization: `Bearer ${token}` }
        );
        const userData = temp.data.result[0];
        setUserData(userData);
        setEditUserData(userData);
        
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    fetchUser();
  }, [user_id, token]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditUserData(prev => ({ ...prev, [name]: value }));
  };

  // Handle status changes
  const handleStatusChange = (e) => {
    const { name, value } = e.target;
    // Convert string value to boolean
    const numberValue = value === '1' ? 1 : 0;
    setEditUserData(prev => ({ ...prev, [name]: numberValue }));
  };

  // Submit form handler
  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      // Validate data using Zod schema
      adminEditUserSchema.parse(editUserData);
  
      // Prepare form data
      const newFormData = new FormData();
      newFormData.append("data", JSON.stringify(editUserData));
      
      // Append profile picture if changed
      if (profilePic) {
        newFormData.append("user_photo", profilePic);
      }
      
      // Append federated file if uploaded
      if (federatedFile) {
        newFormData.append("file", federatedFile);
      }
  
      // Change the route to match backend and use POST instead of PUT
      const response = await fetchData(
        `/admin/AdminEditUser/${user_id}`, 
        "POST", 
        newFormData, 
        { Authorization: `Bearer ${token}` }
      );
  
      if (response.data) {
        navigate('/AdminPanelUsers');
      }
    } catch (error) {
      console.error("Full Error:", error);
      console.error("Error Response:", error.response);
      if (error instanceof ZodError) {
        const fieldErrors = {};
        error.errors.forEach((err) => {
          fieldErrors[err.path[0]] = err.message;
        });
        setErrors(fieldErrors);
      } else {
        console.error("Error in request:", error);
      }
    }
  };

  return (
    <div className="admin-edit-user-main d-flex justify-content-center align-items-center px-5">
      <Form className="admin-edit-user-form rounded-4 my-5 px-5">
        <div className="text-center text-warning fs-1 pb-4">
          <h2>EDITAR USUARIO</h2>
        </div>

        {/* Profile Picture */}
        <Form.Group className="mb-3 d-flex flex-column align-items-center justify-content-center" controlId="formBasicFilePic">
              <Form.Label className="text-warning">Foto de Perfil actual</Form.Label>
              <div className="mt-2">
                
                
                  <Image 
                    src={
                      editUserData?.user_photo
                        ? `${ApiUrl}/images/user_photo/${editUserData?.user_photo}`
                        : "/images/defaultImage/defaultImage.png"
                    }
                    alt="Vista previa" 
                    style={{ maxWidth: '100%', maxHeight: '200px' }}
                    thumbnail
                    className="rounded-5"
                  />
              
              </div>
            </Form.Group>
        
        <div className="divisor d-flex justify-content-center gap-3">
          <div className="block1">
            {/* Basic Information */}
            <Form.Group className="mb-3" controlId="formBasicName">
              <Form.Label className="text-warning">Nombre</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ingresa el Nombre"
                onChange={handleChange}
                name="user_name"
                value={editUserData?.user_name || ""}
                className="custom-file-input"
                required
              />
              {errors.user_name && (
                <p className="text-danger">{errors.user_name}</p>
              )}
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicLastName">
              <Form.Label className="text-warning">Apellidos</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ingresa los Apellidos"
                onChange={handleChange}
                name="last_name"
                value={editUserData?.last_name || ""}
                className="custom-file-input"
                required
              />
              {errors.last_name && (
                <p className="text-danger">{errors.last_name}</p>
              )}
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicBirthDate">
              <Form.Label className="text-warning">Fecha de Nacimiento</Form.Label>
              <Form.Control
                type="date"
                onChange={handleChange}
                name="birth_date"
                value={editUserData?.birth_date || ""}
                className="custom-file-input"
              />
              {errors.birth_date && (
                <p className="text-danger">{errors.birth_date}</p>
              )}
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicGender">
              <Form.Label className="text-warning">Género</Form.Label>
              <Form.Control
                as="select"
                name="gender"
                value={editUserData?.gender || ""}
                className="custom-file-input"
                onChange={handleChange}
              >
                <option value="">Seleccionar Género</option>
                <option value="masculino">Masculino</option>
                <option value="femenino">Femenino</option>
              </Form.Control>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicCity">
              <Form.Label className="text-warning">Ciudad</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ingresa la Ciudad"
                onChange={handleChange}
                name="user_city"
                value={editUserData?.user_city || ""}
                className="custom-file-input"
              />
              {errors.user_city && (
                <p className="text-danger">{errors.user_city}</p>
              )}
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicProvince">
              <Form.Label className="text-warning">Provincia</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ingresa la Provincia"
                onChange={handleChange}
                name="province"
                value={editUserData?.province || ""}
                className="custom-file-input"
              />
              {errors.province && (
                <p className="text-danger">{errors.province}</p>
              )}
            </Form.Group>
          </div>

          <div className="block2">
            <Form.Group className="mb-3" controlId="formBasicCountry">
              <Form.Label className="text-warning">País</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ingresa el País"
                onChange={handleChange}
                name="user_country"
                value={editUserData?.user_country || ""}
                className="custom-file-input"
              />
              {errors.user_country && (
                <p className="text-danger">{errors.user_country}</p>
              )}
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicUserAddress">
              <Form.Label className="text-warning">Dirección</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ingresa la Dirección"
                onChange={handleChange}
                name="user_address"
                value={editUserData?.user_address || ""}
                className="custom-file-input"
              />
              {errors.user_address && (
                <p className="text-danger">{errors.user_address}</p>
              )}
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPostalCode">
              <Form.Label className="text-warning">Código Postal</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ingresa el Código Postal"
                onChange={handleChange}
                name="zip_code"
                value={editUserData?.zip_code || ""}
                className="custom-file-input"
              />
              {errors.zip_code && (
                <p className="text-danger">{errors.zip_code}</p>
              )}
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPhone">
              <Form.Label className="text-warning">Número de Teléfono</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ingresa el Teléfono"
                onChange={handleChange}
                name="phone_number"
                value={editUserData?.phone_number || ""}
                className="custom-file-input"
              />
              {errors.phone_number && (
                <p className="text-danger">{errors.phone_number}</p>
              )}
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicIdentityDocument">
              <Form.Label className="text-warning">Documento de Identidad</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ingresa el Documento de Identidad"
                onChange={handleChange}
                name="identity_doc"
                value={editUserData?.identity_doc || ""}
                className="custom-file-input"
              />
              {errors.identity_doc && (
                <p className="text-danger">{errors.identity_doc}</p>
              )}
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicNationality">
              <Form.Label className="text-warning">Nacionalidad</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ingresa la Nacionalidad"
                onChange={handleChange}
                name="nationality"
                value={editUserData?.nationality || ""}
                className="custom-file-input"
              />
              {errors.nationality && (
                <p className="text-danger">{errors.nationality}</p>
              )}
            </Form.Group>
          </div>
        </div>

        {/* User Status Select Inputs */}
        {/* Federated Document */}
        <Form.Label className="text-warning d-flex flex-column justify-content-center align-items-center">Documento Federativo</Form.Label>
              <Link className="btn btn-warning d-flex flex-column justify-content-center align-items-center mb-3" to={`${ApiUrl}/images/file/${editUserData?.file}`} target="_blank" download>Descargar documento Federativo
              </Link>
        <div className="mb-3">
          <Form.Group className="mb-3" controlId="formBasicFederated">
            <Form.Label className="text-warning">¿Está federado?</Form.Label>
            <Form.Control
              as="select"
              name="is_federated"
              value={editUserData.is_federated.toString()}
              className="custom-file-input"
              onChange={handleStatusChange}
            >
              <option value="0">No</option>
              <option value="1">Sí</option>
            </Form.Control>
          </Form.Group>

          
          <Form.Group className="mb-3" controlId="formBasicDisabled">
            <Form.Label className="text-warning">¿Está baneado?</Form.Label>
            <Form.Control
              as="select"
              name="is_disabled"
              value={editUserData.is_disabled.toString()}
              className="custom-file-input"
              onChange={handleStatusChange}
            >
              <option value="0">No</option>
              <option value="1">Sí</option>
            </Form.Control>
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicVerified">
            <Form.Label className="text-warning">¿Está verificado?</Form.Label>
            <Form.Control
              as="select"
              name="is_verified"
              value={editUserData.is_verified.toString()}
              className="custom-file-input"
              onChange={handleStatusChange}
            >
              <option value="0">No</option>
              <option value="1">Sí</option>
            </Form.Control>
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicAdmin">
            <Form.Label className="text-warning">¿Es administrador?</Form.Label>
            <Form.Control
              as="select"
              name="is_admin"
              value={editUserData.is_admin.toString()}
              className="custom-file-input"
              onChange={handleStatusChange}
            >
              <option value="0">No</option>
              <option value="1">Sí</option>
            </Form.Control>
          </Form.Group>
        </div>

        {/* Buttons */}
        <div className="d-flex justify-content-center gap-2 pt-4 pb-3">
          <Button 
            className="edit-profile-btn fw-bold" 
            variant="warning" 
            type="submit" 
            onClick={onSubmit}
          >
            ACEPTAR
          </Button>
          <Button
            className="edit-profile-btn fw-bold"
            variant="secondary"
            onClick={() => navigate("/AdminPanelUsers")}
          >
            CANCELAR
          </Button>
        </div>
      </Form>
    </div>
  );
};