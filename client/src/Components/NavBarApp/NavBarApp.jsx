import React, { useContext } from 'react';
import './navBarApp.css';

import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { Link, useNavigate } from 'react-router-dom';
import { KingOfTheCourtContext } from "../../Context/ContextProvider";

const BackUrl = import.meta.env.VITE_SERVER_URL;

export const NavBarApp = () => {
  const { user, logOut, setIsLogued } = useContext(KingOfTheCourtContext);
  const navigate = useNavigate();

  const onClickLogout = () => {
    logOut();
    navigate("/");
    setIsLogued(false);
  };


  return (
    <Navbar collapseOnSelect expand="lg" className="main-navbar-tool">
      <Container fluid>
        <Navbar.Brand as={Link} to="/" className="logo-container">
          <img className='wePlay-logo' src="/images/logo/wePlayLogoWhite.png" alt="LogoWePlay" />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" className="burger-icon" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto d-flex align-items-center">
            <Nav.Link className="btn-nav" as={Link} to="/allEvents">EVENTOS</Nav.Link>
            <Nav.Link className="btn-nav" as={Link} to="/calendar">CALENDARIO</Nav.Link>
            <Nav.Link className="btn-nav" as={Link} to="/about">SOBRE NOSOTROS</Nav.Link>
          </Nav>
          <Nav className='user-btns d-flex align-items-center'>
            {!user ? (
              <>
                <Nav.Link className="btn-nav" as={Link} to="/login">INICIA SESIÓN</Nav.Link>
                <Nav.Link className="btn-nav" eventKey={2} as={Link} to="/register">
                  REGÍSTRATE
                </Nav.Link>
              </>
            ) : (
              <>
                <Nav.Link className="btn-nav d-flex justify-content-center align-items-center" onClick={onClickLogout}>
                <img 
                  src="/images/logo/close-session.png" 
                  alt="Cerrar sesión"
                  className='close-session'
                />
                Cerrar sesión
                </Nav.Link>
                <Nav.Link className="btn-nav" as={Link} to="/profile">
                  {user.user_photo ? (
                    <img 
                      // Verificar que la URL esté bien formada
                      src={`${BackUrl}/images/user_photo/${user.user_photo}`} 
                      className='user-photo'
                      alt="User-photo" 
                    />
                  ) : (
                    // Imagen por defecto en caso de que no haya foto de perfil
                    <img 
                      src="/images/defaultImage/defaultImage.png" 
                      alt="default User-photo"
                      className='user-photo d-flex justify-content-center'
                    />
                  )}
                </Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};
