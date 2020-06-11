import express from 'express';
import multer from 'multer';

import multerConfig from './config/multer';

const routes = express.Router();
const upload = multer(multerConfig);

import authController from './app/controllers/AuthController';
import userController from './app/controllers/UserController';
import providerController from './app/controllers/ProviderController';
import appointmentController from './app/controllers/AppointmentController';
import scheduleController from './app/controllers/ScheduleController';
import availableController from './app/controllers/AvailableController';
import fileController from './app/controllers/FileController';

//Validators
import userCreateValidator from './app/validators/user/create';
import userUpdateValidator from './app/validators/user/update'; 
import appointmentCreateValidator from './app/validators/appointment/create';
import appointmentDeleteValidator from './app/validators/appointment/delete';
import providerValidator from './app/validators/provider/index';
import notificationController from './app/controllers/NotificationController';

import authMiddleware from './app/middlewares/auth';


routes.post('/auth', authController.create);

routes.post('/users', userCreateValidator, userController.create);

routes.use(authMiddleware);
routes.get('/users', userController.index);
routes.put('/users', userUpdateValidator, userController.update);

routes.get('/providers', providerController.index);
routes.get('/providers/:id/available', availableController.index);

routes.get('/appointments', appointmentController.index);
routes.post('/appointments', appointmentCreateValidator, appointmentController.create);
routes.delete('/appointments/:id', appointmentDeleteValidator, appointmentController.delete);

routes.get('/schedule', providerValidator, scheduleController.index);

routes.get('/notifications', providerValidator, notificationController.index);
routes.put('/notifications/:id', providerValidator, notificationController.update);

routes.post('/files', upload.single('file'), fileController.create);


export default routes;