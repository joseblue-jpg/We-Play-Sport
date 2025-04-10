import express from "express";
import adminControllers from "./admin.controllers.js";
import { tokenVerify } from "../../middlewares/tokenVerify.js";
import uploadImage from "../../middlewares/multerSingle.js";
import multerMultiple from '../../middlewares/multerMultiple.js';
import { validateForms } from "../../middlewares/validateForm.js";
import { createEventSchema } from "../../schemas/createEventSchema.js";
import editUserSchema from "../../schemas/editUserSchema.js";
import { tokenVerifyAdmin } from "../../middlewares/tokenVerifyAdmin.js";

const router = express.Router();

//EVENTOS
//Vista de http://localhost:3000/admin/AdminAllEvents
router.get('/AdminAllEvents', tokenVerifyAdmin, adminControllers.adminAllEvents);
router.post('/EditEventStatus/:event_id/:status', tokenVerifyAdmin, adminControllers.editEventStatus);
router.post('/DeleteEvent/:event_id', tokenVerifyAdmin, adminControllers.deteleEvent);

//Vista de http://localhost:3000/admin/CreateEvent
router.post('/CreateEvent', tokenVerifyAdmin,  uploadImage("event_images"), validateForms(createEventSchema), adminControllers.createEvent);
router.post("/eventFilterButton", tokenVerifyAdmin, uploadImage(), adminControllers.eventFilterButton);

//Vista de http://localhost:3000/admin/EditEvent/:event_id
router.put('/EditEvent/:event_id', tokenVerifyAdmin, uploadImage("event_images"), validateForms(createEventSchema), adminControllers.editEvent);
router.get('/oneEvent/:event_id', tokenVerifyAdmin, adminControllers.oneEvent);

//USUARIOS
router.get('/AdminAllUsers', tokenVerifyAdmin, adminControllers.adminAllUsers);
router.post('/AdminEditUser/:user_id', tokenVerifyAdmin, multerMultiple(), validateForms(editUserSchema),  adminControllers.editUser);
router.post('/DeleteUser/:user_id', tokenVerifyAdmin, adminControllers.deleteUser);
router.get('/AdminOneUser/:user_id', tokenVerifyAdmin, adminControllers.adminOneUser);
router.post('/AdminSearchUsers', tokenVerifyAdmin, uploadImage(), adminControllers.adminSearchUsers);

export default router;