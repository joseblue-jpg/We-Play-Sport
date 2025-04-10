import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import "./EditProfile.css";
import { KingOfTheCourtContext } from "../../Context/ContextProvider";
import { fetchData } from "../../helpers/axiosHelper";
import editUserSchema from "../../schemas/editUserSchema";
import { ZodError } from "zod";
import { Image } from "react-bootstrap";

const ApiUrl = import.meta.env.VITE_SERVER_URL;


export const EditProfile = () => {
  const { user, setUser, token } = useContext(KingOfTheCourtContext);
  const [edit, setEdit] = useState(user);
  const [profilePic, setProfilePic] = useState(null);
  const [profilePicPreview, setProfilePicPreview] = useState(null);
  const [errors, setErrors] = useState({});
  const [federatedFile, setFederatedFile] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    return () => {
      // Limpia la URL de vista previa al salir del componente
      if (profilePicPreview) {
        URL.revokeObjectURL(profilePicPreview);
      }
    };
  }, [profilePicPreview]);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setEdit({ ...edit, [name]: value });
  };

  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    if (!file) {
      setProfilePic(null);
      setProfilePicPreview(null);
      return;
    }
  
    setProfilePic(file);
    setProfilePicPreview(URL.createObjectURL(file)); // Vista previa temporal
  };

  const handleFederatedFileChange = (e) => {
    setFederatedFile(e.target.files[0]);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      editUserSchema.parse(edit);
      const newFormData = new FormData();
      newFormData.append("data", JSON.stringify(edit));
      if (profilePic) {
        newFormData.append("user_photo", profilePic);
      }
      if (federatedFile) {
        newFormData.append("file", federatedFile);
      }

      const response = await fetchData("/users/editUser", "PUT", newFormData, {
        Authorization: `Bearer ${token}`,
      });

      if (response.data) {
        if(response.data.user_photo && !response.data.file){
          setUser({ ...edit, user_photo: response.data.user_photo });
          navigate("/profile");
        } else if (response.data.file && !response.data.user_photo) {
          setUser({ ...edit, file: response.data.file });
          navigate("/profile");
        } else if (response.data.file && response.data.user_photo) {
          setUser({ ...edit, file: response.data.file, user_photo: response.data.user_photo });
          navigate("/profile");
        } else {
          setUser({...edit})
          navigate("/profile");
        }
      } else {
        console.error("No se recibieron datos del backend");
      }
    } catch (error) {
      console.error("Error:", error);
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
    <div className="user-edit-main d-flex justify-content-center align-items-center">
      <Form className="edit-profile-form m-5">
        <div className="text-center text-warning fs-1 pb-4">
          <h2>EDITAR PERFIL</h2>
        </div>
        <div className="divisor">
          <div className="block1">
            {/* Información Básica */}
            <Form.Group className="mb-3" controlId="formBasicName">
              <Form.Label className="text-warning">Nombre</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ingresa aquí tú Nombre"
                onChange={handleChange}
                name="user_name"
                value={edit?.user_name}
                className="custom-file-input"
                required
              />
              {errors.user_name && (
                <p className="msg-error">{errors.user_name}</p>
              )}
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicLastName">
              <Form.Label className="text-warning">Apellidos</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ingresa aquí tus Apellidos"
                onChange={handleChange}
                name="last_name"
                value={edit?.last_name}
                className="custom-file-input"
                required
              />
              {errors.last_name && (
                <p className="msg-error">{errors.last_name}</p>
              )}
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicBirthDate">
              <Form.Label className="text-warning">
                Fecha de Nacimiento
              </Form.Label>
              <Form.Control
                type="date"
                placeholder="Ingresa aquí tu fecha de nacimiento"
                onChange={handleChange}
                name="birth_date"
                value={edit?.birth_date ? edit.birth_date : ""}
                className="custom-file-input"
              />
              {errors.birth_date && (
                <p className="msg-error">{errors.birth_date}</p>
              )}
            </Form.Group>

            {/* Categoría de Género */}
            <Form.Group className="mb-3" controlId="formBasicGender">
              <Form.Label className="text-warning">Género</Form.Label>
              <Form.Control
                as="select"
                name="gender"
                value={edit?.gender ? edit.gender : ""}
                className="custom-file-input"
                onChange={handleChange}
              >
                <option value="">Seleccionar Genero</option>
                <option value="masculino">Masculino</option>
                <option value="femenino">Femenino</option>
              </Form.Control>
            </Form.Group>

            {/* Ubicación */}
            <Form.Group className="mb-3" controlId="formBasicCity">
              <Form.Label className="text-warning">Ciudad</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ingresa aquí tu Ciudad"
                onChange={handleChange}
                name="user_city"
                value={edit?.user_city ? edit.user_city : ""}
                className="custom-file-input"
              />
              {errors.user_city && (
                <p className="msg-error">{errors.user_city}</p>
              )}
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicProvince">
              <Form.Label className="text-warning">Provincia</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ingresa aquí tu Provincia"
                onChange={handleChange}
                name="province"
                value={edit?.province ? edit.province : ""}
                className="custom-file-input"
              />
              {errors.province && (
                <p className="msg-error">{errors.province}</p>
              )}
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicCountry">
              <Form.Label className="text-warning">País</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ingresa aquí tu País de origen"
                onChange={handleChange}
                name="user_country"
                value={edit?.user_country ? edit.user_country : ""}
                className="custom-file-input"
              />
              {errors.user_country && (
                <p className="msg-error">{errors.user_country}</p>
              )}
            </Form.Group>
          </div>

          <div className="block2">
            {/* Dirección */}
            <Form.Group className="mb-3" controlId="formBasicUserAddress">
              <Form.Label className="text-warning">Dirección</Form.Label>
              <Form.Control
                type="text"
                placeholder="Dirección"
                onChange={handleChange}
                name="user_address"
                value={edit?.user_address ? edit.user_address : ""}
                className="custom-file-input"
              />
              {errors.user_address && (
                <p className="msg-error">{errors.user_address}</p>
              )}
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicPostalCode">
              <Form.Label className="text-warning">Código Postal</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ingresa aquí tu Código Postal"
                onChange={handleChange}
                name="zip_code"
                value={edit?.zip_code ? edit.zip_code : ""}
                className="custom-file-input"
              />
              {errors.zip_code && (
                <p className="msg-error">{errors.zip_code}</p>
              )}
            </Form.Group>
            {/* Contacto */}
            <Form.Group className="mb-3" controlId="formBasicPhone">
              <Form.Label className="text-warning">
                Número de Teléfono
              </Form.Label>
              <Form.Control
                type="text"
                placeholder="Ingresa aquí tu Teléfono"
                onChange={handleChange}
                name="phone_number"
                value={edit?.phone_number ? edit.phone_number : ""}
                className="custom-file-input"
              />
              {errors.phone_number && (
                <p className="msg-error">{errors.phone_number}</p>
              )}
            </Form.Group>

            {/* Datos de Identidad */}
            <Form.Group className="mb-3" controlId="formBasicIdentityDocument">
              <Form.Label className="text-warning">
                Documento de Identidad
              </Form.Label>
              <Form.Control
                type="text"
                placeholder="Ingresa aquí tu Documento de Identidad"
                onChange={handleChange}
                name="identity_doc"
                value={edit?.identity_doc ? edit.identity_doc : ""}
                className="custom-file-input"
              />
              {errors.identity_doc && (
                <p className="msg-error">{errors.identity_doc}</p>
              )}
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicNationality">
              <Form.Label className="text-warning">Nacionalidad</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ingresa aquí tu Nacionalidad"
                onChange={handleChange}
                name="nationality"
                value={edit?.nationality ? edit.nationality : ""}
                className="custom-file-input"
              />
              {errors.nationality && (
                <p className="msg-error">{errors.nationality}</p>
              )}
            </Form.Group>

            {/* Archivos */}
            <Form.Group className="mb-3" controlId="formBasicFile">
              <Form.Label className="custom-file-label text-warning">
                Seleccionar Documento Federado
              </Form.Label>
              <Form.Control
                type="file"
                className="custom-file-input"
                onChange={handleFederatedFileChange}
                name="file"
              />
            </Form.Group>
            
            <Form.Group className="mb-3" controlId="formBasicFilePic">
              <Form.Label className="text-warning">Seleccionar Foto de Perfil</Form.Label>
              <Form.Control 
                type="file" 
                onChange={handleProfilePicChange}
                accept="image/*"
              />
              <div className="mt-2">
                <p className="text-warning">Vista previa:</p>
                <Image 
                  src={
                    profilePicPreview
                      ? profilePicPreview 
                      : user?.user_photo
                      ? `${ApiUrl}/images/user_photo/${user.user_photo}`
                      : "/images/defaultImage/defaultImage.png"
                  }
                  alt="Foto de perfil"
                  style={{ maxWidth: '100%', maxHeight: '200px' }}
                  thumbnail
                />
              </div>
            </Form.Group>
          </div>
        </div>

        {/* Botones */}
        <div className="d-flex justify-content-center gap-2 pt-4 pb-3">
          <Button className="edit-profile-btn" variant="warning" type="submit" onClick={onSubmit}>
            ACEPTAR
          </Button>
          <Button
            className="edit-profile-btn"
            variant="secondary"
            type="submit"
            onClick={() => navigate("/profile")}
          >
            CANCELAR
          </Button>
        </div>
      </Form>
    </div>
  );
};
