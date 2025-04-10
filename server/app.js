import createError from 'http-errors';
import express from 'express';
import path from 'path';
import logger from 'morgan';
import { fileURLToPath } from 'url';
import cors from 'cors';

//Para la ruta relativa de public
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

//Rutas de los ENDPOINTS

import usersRouter from './modules/users/users.routes.js';
import adminRouter from './modules/admin/admin.routes.js';
import eventsRouter from './modules/events/events.routes.js';
import servicesRouter from './modules/services/services.routes.js';

const app = express();

//Middlewares
app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

//--------------------------

app.use('/users', usersRouter);
app.use('/admin', adminRouter);
app.use('/events', eventsRouter);
app.use('/services', servicesRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500).json(err.message);
});

export default app;
