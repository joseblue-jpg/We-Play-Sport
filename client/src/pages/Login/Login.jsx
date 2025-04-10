import React, { useContext, useState } from "react";
import { Form, Button } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { fetchData } from "../../helpers/axiosHelper";
import { KingOfTheCourtContext } from "../../Context/ContextProvider";
import './login.css'

const initialValue = {
  email:"",
  password:""
}

export const Login = () => {
  const [loginData, setLoginData] = useState(initialValue);
  const [msg, setMsg] = useState("");

  const {setUser, setToken, setIsLogued} = useContext(KingOfTheCourtContext);
  const navigate = useNavigate();
  
  const handleChange = (e) =>{
    const {name, value} = e.target;
    setLoginData({...loginData, [name]:value})
  }
  
  const onSubmit = async() => {
    try {
      //comprueba que las credenciales sean correctas y me trae el token
      const res = await fetchData("/users/login", "post", loginData)
      let token = res.data
      
      //hacer petición de los datos del usuario que se ha logueado
      const userData = await fetchData("/users/userById", "get", null, {
        Authorization: `Bearer ${token}`,
      })
      //guardar el token en el localstroage y setear el user en el context
      localStorage.setItem("token", token);
      setUser(userData.data)
      setToken(token)
      navigate('/')
      setIsLogued(true);
     
    } catch (error) {
      if (error.response) {
        if (error.response.status === 403) {
          setMsg("Tu cuenta no ha sido verificada. Por favor, verifica tu correo electrónico");
        } else {
          setMsg("La dirección de correo o contraseña no son correctas");
        }
      } else {
        setMsg("Error al conectar con el servidor");
      }
      console.log("onsubmit error", error);
    }
  }

  return (
    <div className="user-login-main d-flex justify-content-center align-items-start">
        <Form className="login-form text-white rounded-4">
        <div className="d-flex justify-content-center">
          <h2 className="pb-4 text-warning fs-2 fw-bold">INICIA SESIÓN</h2>
        </div>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Correo electrónico</Form.Label>
            <Form.Control
              type="text"
              placeholder="Introduce tu dirección email"
              name="email"
              onChange={handleChange}
              value={loginData.email}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Contraseña</Form.Label>
            <Form.Control
              type="password"
              placeholder="Introduce tu contraseña"
              name="password"
              onChange={handleChange}
              value={loginData.password}
            />
          </Form.Group>
          <p style={{color:"red"}}>{msg}</p>
          <div className="d-flex justify-content-center gap-3 pt-4">
            <Button className="login-btn"
              onClick={onSubmit}
              variant="warning w-50 fw-bold">ACEPTAR</Button>
            <Button className="login-btn"
              variant="secondary w-50 fw-bold"
              onClick={()=>navigate("/")}
            >VOLVER</Button>
          </div>
          <div className="register-now d-flex flex-column align-items-center pt-4">
            <p className="d-flex justify-content-center mb-1">
              ¿Todavía no tienes  cuenta?
            </p>
            <Button variant="warning w-50 fw-bold">
              <Link to="/register" className="text-decoration-none text-black">Regístrate gratis</Link>
            </Button>
          </div>
          
          <p className="d-flex align-items-center justify-content-center pt-4 text-underline">
            ¿Has olvidado tu<span>&nbsp;</span><Link to="/forgotPassword"><span className="text-warning text-underline">contraseña?</span></Link> 
          </p>
        </Form>
    </div>
  );
};
