import express from "express";
import usersControllers from "./users.controllers.js";
import { tokenVerify } from '../../middlewares/tokenVerify.js';
import multerMultiple from '../../middlewares/multerMultiple.js';
import { validateForms }from "../../middlewares/validateForm.js";
import registerSchema from "../../schemas/registerSchema.js";
import { tokenVerifyRegister } from "../../middlewares/tokenVerifyRegister.js";
import { forgotPasswordSchema } from "../../schemas/forgotPasswordSchema.js";
import { tokenVerifyNewPassword } from "../../middlewares/tokenVerifyNewPassword.js";
import editUserSchema from "../../schemas/editUserSchema.js";
import { inscriptionEmailsSchema } from "../../../client/src/schemas/inscriptionEmailsSchema.js";
import { tokenVerifyTeamInscription } from "../../middlewares/tokenVerifyTeamInscription.js";


const router = express.Router();

router.post('/register', validateForms(registerSchema), usersControllers.register);
router.put('/confirmRegister', tokenVerifyRegister, usersControllers.confirmRegister);
router.post('/forgotPassword', validateForms(forgotPasswordSchema), usersControllers.forgotPassword);
router.put('/newPassword', tokenVerifyNewPassword, usersControllers.newPassword);
router.post('/login', usersControllers.login);
router.get('/userById', tokenVerify, usersControllers.userById);
router.put('/editUser', tokenVerify, multerMultiple(), validateForms(editUserSchema), usersControllers.editUser);
router.put('/disableUser/:id', tokenVerify, usersControllers.disableUser);
router.delete('/deleteUser/:id', tokenVerify, usersControllers.deleteUser);
router.get('/profileEventSuscription/:user_id', tokenVerify, usersControllers.profileEventSuscription);

router.post('/eventInscription', tokenVerify, usersControllers.eventInscription);
router.post('/eventInscriptionIndividual', tokenVerify, usersControllers.eventInscriptionIndividual);
router.post('/paymentData', tokenVerify, usersControllers.paymentData);
router.post('/finalInscription', tokenVerify, usersControllers.finalInscription);
router.get('/acceptInvitationGet', tokenVerifyTeamInscription, usersControllers.acceptInvitationGet);
router.post('/acceptInvitationButton', usersControllers.acceptInvitationButton);
router.post('/withdrawFromEvent/:user_id/:event_id', usersControllers.withdrawFromEvent);
router.delete('/cancelTeamEvent', tokenVerify, usersControllers.cancelTeamEvent);

//Ambos hacen lo mismo, solo es por tema semantico, para nada mas ver la ruta sepas para que va a ser
//put---> modificar algo, db-->UPDATE
//post--> orientada a crear o llevar datos, db--> INSERT o SELECT.
export default router;