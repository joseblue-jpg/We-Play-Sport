import express, { Router } from "express";
import eventsControllers from "./events.controllers.js";
import uploadImage from "../../middlewares/multerSingle.js";
import { tokenVerify } from "../../middlewares/tokenVerify.js";

const router = express.Router();

router.get('/allEventsHome', eventsControllers.allEventsHome);
router.get('/allEvents', eventsControllers.allEvents);
router.get('/oneEvent/:id', eventsControllers.oneEvent);
router.post('/eventFilterButton', uploadImage(), eventsControllers.eventFilterButton);
router.get('/getServicesFromAnEvent/:event_id', eventsControllers.getServicesFromAnEvent);
router.post('/eventIsFull/:event_id', eventsControllers.eventIsFull);
router.post('/setEventsDone', eventsControllers.setEventsDone);

export default router;