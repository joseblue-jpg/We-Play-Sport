import React, { useContext, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Container } from "react-bootstrap";
import { Footer } from "../Components/Footer/Footer";
import { Login } from "../pages/Login/Login";
import { NavBarApp } from "../Components/NavBarApp/NavBarApp";
import { ControlPanel } from "../pages/Admin/ControlPanel/ControlPanel";
import { AdminPanelEvents } from "../pages/Admin/Events/AdminPanelEvents/AdminPanelEvents";
import { AdminPanelServices } from "../pages/Admin/Services/AdminPanelServices/AdminPanelServices";
import { AdminPanelUsers } from "../pages/Admin/Users/AdminPanelUsers/AdminPanelUsers";
import { EditProfile } from "../pages/EditProfile/EditProfile";
import { Register } from "../pages/Register/Register";
import { ConfirmEmailSent } from "../pages/Register/ConfirmEmailSent/ConfirmEmailSent";
import { Home } from "../pages/Home/Home";
import { ConfirmRegister } from "../pages/confirmRegister/ConfirmRegister";
import { Profile } from "../pages/Profile/Profile";
import { Error } from "../pages/Error/Error";
import { CreateEvent } from "../pages/Admin/Events/CreateEvent/CreateEvent";
import { CreateService } from "../pages/Admin/Services/CreateService/CreateService";
import { AdminEditUser } from "../pages/Admin/Users/AdminEditUser/AdminEditUser";
import { EditService } from "../pages/Admin/Services/EditService/EditService";
import { ForgotPassword } from "../pages/ForgotPassword/ForgotPassword";
import { EditEvent } from "../pages/Admin/EditEvent/EditEvent";
import { EventInfo } from "../pages/EventsInfo/EventInfo/";
import { ForgotPasswordForm } from "../Components/ForgotPasswordForm/ForgotPasswordForm";
import '../App.css'
import { EventInscription } from "../pages/EventInscription/EventInscription";
import { LayoutInscription } from "../pages/EventInscription/LayoutInscription";
import { PaymentEvent } from "../pages/EventInscription/PaymentEvent";
import { CalendarPage } from "../pages/Calendar/CalendarPage";
import { ConfirmTeam } from "../pages/ConfirmTeam/ConfirmTeam";
import { InvitationOk } from "../pages/ConfirmTeam/InvitationOk";
import { InvitationFailed } from "../pages/ConfirmTeam/InvitationFailed";
import { AllEvents } from "../pages/AllEvents/AllEvents";
import { AdminEventInfo } from "../pages/AdminEventInfo/adminEventInfo";
import {About} from "../pages/About/About";
import { ConfirmEmailNewPass } from "../Components/ConfirmEmailNewPass/ConfirmEmailNewPass";
import { KingOfTheCourtContext } from "../Context/ContextProvider";
import { Cargando } from "../pages/Cargando/Cargando";
import { AlreadyAuth } from "../Components/AlreadyAuth/AlreadyAuth";


export const RoutesApp = () => {

  let { user } = useContext(KingOfTheCourtContext);

  return (
    <div className="app-container">
      <BrowserRouter>

        <header>
        <NavBarApp />
        </header>

        <main>
          <Container fluid className="main-container">
            <Routes>
              {/* Rutas que ve cualquiera */}
              <Route path="/" element={<Home />} />
              <Route path="/About" element={<About/>} />
              <Route path="/allEvents" element={<AllEvents />} />
              <Route path="/calendar" element={<CalendarPage/>}/>
              <Route path="/eventInfo/:id" element={<EventInfo/>} />
              <Route path="/login" element={<AlreadyAuth > <Login /> </AlreadyAuth> } />
              <Route path="/register" element={<AlreadyAuth > <Register /> </AlreadyAuth> } />

              {/* Rutas que solo ve un usuario no logueado */}
              {!user && (
                <>
                  <Route path="/confirmEmailSent" element={<ConfirmEmailSent />} />
                  <Route path="/confirmRegister/:token" element={<ConfirmRegister />} />
                  <Route path="/forgotPassword" element={<ForgotPassword />} />
                  <Route path="/forgotPassword/newPassword/:token" element={<ForgotPasswordForm />} />
                  <Route path="/confirmEmailNewPass" element={<ConfirmEmailNewPass />} />
                </>
              )};

              {/* Rutas que solo ve un usuario logueado */}
              {user && (
                <>
                  <Route path="/profile/" element={<Profile />}  />
                  <Route path="/editProfile" element={<EditProfile/>} />
                </>
              )};
              
              {/* Rutas a las que no puede acceder un admin */}
              {user?.is_admin === 0 && (
                <>
                  <Route path="/inscriptionEvent/:event_id" element={<LayoutInscription />} >
                      <Route index element={<EventInscription />} />
                      <Route path="paymentEvent" element={<PaymentEvent />} />
                  </Route> 
                  <Route path="/acceptInvitation/:token" element={<ConfirmTeam /> } />
                  <Route path="/invitationOk" element={<InvitationOk />} />
                  <Route path="/invitationFailed" element={<InvitationFailed />} />
                </>
              )};

              {/* Rutas a las que solo puede acceder el admin */}
              {user?.is_admin === 1 && (
                <>
                  <Route path="/controlPanel" element={<ControlPanel/>} />
                  <Route path="/adminPanelEvents" element={< AdminPanelEvents />} />
                  <Route path="/adminPanelServices" element={< AdminPanelServices />} />
                  <Route path="/adminPanelUsers" element={< AdminPanelUsers />} />
                  <Route path="/adminEventInfo/:id" element={<AdminEventInfo/>} />
                  <Route path="/adminCreateEvent" element={< CreateEvent />} />
                  <Route path="/adminCreateService" element={< CreateService />} />
                  <Route path="/adminEditUser/:user_id" element={<AdminEditUser />} />
                  <Route path="/adminEditService/:id" element={< EditService />} />
                  <Route path="/EditEvent/:event_id" element={<EditEvent />}/> 
                </>
              )}
              <Route path="*" element= {<Cargando />} />
              <Route path="*" element= {<Error />} />
            </Routes>
          </Container>
        </main>
        <footer>
          <Footer />
        </footer>
      </BrowserRouter>
    </div>

  );
};
