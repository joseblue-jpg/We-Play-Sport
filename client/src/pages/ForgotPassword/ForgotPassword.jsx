import React, { useState } from "react";
import { Button, Form } from "react-bootstrap";
import { fetchData } from "../../helpers/axiosHelper";
import { ZodError } from "zod";
import { forgotPasswordSchema } from "../../schemas/forgotPasswordSchema";
import './forgotPassword.css'
import { useNavigate } from "react-router-dom";

export const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setEmail(e.target.value);
  };

  const onSubmit = async () => {
    try {
      forgotPasswordSchema.parse({email});
      let res = await fetchData("/users/forgotPassword", "post", { email });
  
      navigate("/confirmEmailNewPass");
    } catch (error) {
      console.log(error);
      if (error instanceof ZodError) {
        const fieldError = {};
        error.errors.forEach((err)=>{
          fieldError[err.path[0]]=err.message;
        })
        setErrors(fieldError);
      }else {
        console.log(error);
        
        if(error.response.data==="El usuario no existe"){
          setErrors({ email: "El email no existe" })
        }
      }
    }
  };

  return (
    <div className="forgot-pass-main">
      <div className="form-div">
        <h3 className="text-warning">
        Introduce tu correo electrónico:
        </h3>
        <Form>
          <Form.Group>
            <Form.Control
              type="text"
              placeholder="Introduce tu dirección email"
              name="email"
              onChange={handleChange}
              value={email}
            ></Form.Control>
            {errors.email && <p className="msg-error">{errors.email}</p>}
          </Form.Group>
          <Button onClick={onSubmit}>Reestablecer contraseña</Button>
        </Form>
      </div>
    </div>
  );
};
