import React, { useState } from "react";
import { Button, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { ZodError } from "zod";
import { registerSchema } from "../../schemas/registerSchema";
import { fetchData } from "../../helpers/axiosHelper";
import "./register.css";

const initialValue = {
  user_name: "",
  last_name: "",
  birth_date: "",
  email: "",
  password: "",
  confirmPassword: "",
};
export const Register = () => {
  const [newUser, setNewUser] = useState(initialValue);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewUser((newUser) => ({
      ...newUser,
      [name]: value,
    }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      registerSchema.parse(newUser);
      await fetchData("/users/register", "POST", newUser);
      navigate("/confirmEmailSent");
      
    } catch (error) {
      if (error instanceof ZodError) {
        const fieldErrors = {};
        error.errors.forEach((err) => {
          fieldErrors[err.path[0]] = err.message;
        });
        setErrors(fieldErrors);
      } else {
        if (error.response && error.response.data) {
          const { message } = error.response.data;
  
          if (message === "Email already registered") {
            setErrors((prevErrors) => ({
              ...prevErrors,
              email: "Este email ya está registrado. Intenta con otro.",
            }));
          }
        } else {
          console.log(error);
        }
      }
    }

  };

  return (
    <div className="user-register-main d-flex justify-content-center align-items-start">
      <Form className="register-form rounded-4" onSubmit={onSubmit}>
        <div className="d-flex justify-content-center">
          <h2 className="pb-4 text-warning fs-2 fw-bold">REGÍSTRATE</h2>
        </div>
        <Form.Group className="mb-3" controlId="formBasicUserName">
          <Form.Label>Nombre</Form.Label>
          <Form.Control
            type="text"
            placeholder="Introduce tu nombre"
            onChange={handleChange}
            value={newUser.user_name}
            name="user_name"
          />
          {errors.user_name && <p className="msg-error">{errors.user_name}</p>}
          </Form.Group>
          <Form.Group
            className="mb-3"
            controlId="formBasicLastName"
          >
          <Form.Label>Apellidos</Form.Label>
          <Form.Control
            type="text"
            placeholder="Introduce tus apellidos"
            onChange={handleChange}
            value={newUser.last_name}
            name="last_name"
          />
          {errors.last_name && <p className="msg-error">{errors.last_name}</p>}
        </Form.Group>
          <Form.Group
            className="mb-3"
            controlId="formBasicBirthDate"
          >
          <Form.Label>Fecha de nacimiento</Form.Label>
          <Form.Control
            type="date"
            placeholder="Fecha de nacimiento"
            onChange={handleChange}
            value={newUser.birth_date}
            name="birth_date"
          />
          {errors.birth_date && <p className="msg-error">{errors.birth_date}</p>}
        </Form.Group>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            placeholder="ejemplo@ejemplo.com"
            onChange={handleChange}
            value={newUser.email}
            name="email"
          />
          {errors.email && <p className="msg-error">{errors.email}</p>}
        </Form.Group>
        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label>Contraseña</Form.Label>
          <Form.Control
            type="password"
            placeholder="Introduce una contraseña"
            onChange={handleChange}
            value={newUser.password}
            name="password"
          />
          {errors.password && <p className="msg-error">{errors.password}</p>}
        </Form.Group>
        <Form.Group className="mb-3" controlId="formBasicConfirmPassword">
          <Form.Label>Repetir Contraseña</Form.Label>
          <Form.Control
            type="password"
            placeholder="Repite la contraseña"
            onChange={handleChange}
            value={newUser.confirmPassword}
            name="confirmPassword"
          />
          {errors.confirmPassword && <p className="msg-error">{errors.confirmPassword}</p>}
        </Form.Group>
        <div className="d-flex flex-column align-items-center gap-2 pt-4">
          <Button variant="warning w-50 fw-bold" type="submit">
            ACEPTAR
          </Button>
          <Button
            variant="secondary w-50 fw-bold"
            onClick={() => navigate("/")}
          >
            VOLVER
          </Button>
        </div>
      </Form>
    </div>
  );
};