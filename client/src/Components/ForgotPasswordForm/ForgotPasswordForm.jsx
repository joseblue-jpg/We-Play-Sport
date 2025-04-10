import React, { useState } from "react";
import { Button, Form } from "react-bootstrap";
import { fetchData } from "../../helpers/axiosHelper";
import { useNavigate, useParams } from "react-router-dom";
import { newPasswordSchema } from "../../schemas/newPasswordSchema";
import { ZodError } from "zod";
import './forgotPassword.css'

let initialValue = {
  newPassword: "",
  repNewPassword: ""
};

export const ForgotPasswordForm = () => {
  const [newPassword, setNewPassword] = useState(initialValue);
  const [errors, setErrors] = useState({}); // Añadí el estado de errores que estaba ausente
  const navigate = useNavigate();
  const { token } = useParams();

  const handleChange = (e) => {
    const { value, name } = e.target;
    setNewPassword({ ...newPassword, [name]: value });
  };

  const onSubmit = async () => {
    try {
      newPasswordSchema.parse(newPassword); // Corregí la validación para que pase el objeto completo
      await fetchData("/users/newPassword", "put", newPassword, {
        Authorization: `Bearer ${token}`
      });
      

      navigate("/login");
    } catch (error) {
      console.log(error);
      if (error instanceof ZodError) {
        const fieldError = {};
        error.errors.forEach((err) => {
      
          
          fieldError[err.path[0]] = err.message;
        });
        setErrors(fieldError);
      } else {
        console.log(error);
      }
    }
  };

  return (
    <Form className="forgot-pass-main">
      <div className="form-div">
        <Form.Group className="mb-3" controlId="formNewPassword1">
          <Form.Label>NUEVA CONTRASEÑA</Form.Label>
          <Form.Control
            type="password"
            placeholder="Introduce tu nueva contraseña"
            name="newPassword"
            onChange={handleChange}
            value={newPassword.newPassword}
          />
          {errors.newPassword && <p className="msg-error">{errors.newPassword}</p>}
        </Form.Group>
        <Form.Group className="mb-3" controlId="formNewPassword2">
          <Form.Label>REPITE NUEVA CONTRASEÑA</Form.Label>
          <Form.Control
            type="password"
            placeholder="Introduce tu nueva contraseña de nuevo"
            name="repNewPassword"
            onChange={handleChange}
            value={newPassword.repNewPassword}
          />
          {errors.repNewPassword && <p className="msg-error">{errors.repNewPassword}</p>}
        </Form.Group>
      <Button onClick={onSubmit}>Enviar</Button>

      </div>
    </Form>
  );
};
