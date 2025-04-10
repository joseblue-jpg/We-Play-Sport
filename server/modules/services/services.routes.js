import express from "express";
import servicesControllers from "./services.controllers.js";
import uploadImage from "../../middlewares/multerSingle.js";
import { tokenVerify } from '../../middlewares/tokenVerify.js';
import { validateForms } from "../../middlewares/validateForm.js";
import { servicesSchema } from "../../schemas/servicesSchema.js";


const router = express.Router();

router.post('/createService', tokenVerify, uploadImage("service"), validateForms(servicesSchema), servicesControllers.createService);
router.put('/editService', tokenVerify, uploadImage("service"), validateForms(servicesSchema), servicesControllers.editService);
router.get('/serviceById/:service_id', servicesControllers.serviceById);
router.delete('/delService', tokenVerify, servicesControllers.delService);
router.get('/allServices', servicesControllers.allServices);
router.post('/servicesSearchButton', tokenVerify, uploadImage(), servicesControllers.searchFilterButton);
router.get('/servicesEvents/:event_id', servicesControllers.servicesEvents)

export default router;