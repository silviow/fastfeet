import { Router } from 'express';
import AdminUserController from './app/controllers/AdminUserController';
import SessionController from './app/controllers/SessionController';
import RecipientController from './app/controllers/RecipientController';
import authMiddleware from './app/middlewares/auth';

const routes = new Router();

routes.post('/adminusers', AdminUserController.store);
routes.post('/sessions', SessionController.store);

routes.use(authMiddleware);

routes.put('/adminusers', AdminUserController.update);

routes.post('/recipients', RecipientController.store);
routes.put('/recipients/:id', RecipientController.update);

export default routes;
