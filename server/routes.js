import express from 'express';

import verifyToken from './middleware/verifyToken.js';

import projectController from './controllers/projectController.js';
import listController from './controllers/listController.js';
import tagController from './controllers/tagController.js'
import taskController from './controllers/taskController.js';
import userController from './controllers/userController.js';

const router = express.Router();
const guestRouter = express.Router();
const authRouter = express.Router();
authRouter.use(verifyToken);

guestRouter.post('/user/create', userController.create);
guestRouter.post('/user/login', userController.login);
guestRouter.post('/user/logout', userController.logout);
authRouter.post('/user/update/activeProject', userController.updateActiveProject);
authRouter.post('/user/token', userController.token);

authRouter.post('/project/get', projectController.get);
authRouter.post('/project/create', projectController.create);
authRouter.post('/project/update/name', projectController.updateName);
authRouter.post('/project/update/color', projectController.updateColor);
authRouter.post('/project/update/position', projectController.updatePosition);
authRouter.post('/project/delete', projectController.delete);

authRouter.post('/list/create', listController.create);
authRouter.post('/list/clone', listController.create);
authRouter.post('/list/update/name', listController.updateName);
authRouter.post('/list/update/position', listController.updatePosition);
authRouter.post('/list/delete/list', listController.deleteList);
authRouter.post('/list/delete/tasks', listController.deleteTasks);

authRouter.post('/tag/create', tagController.create);
authRouter.post('/tag/update/content', tagController.updateContent);
authRouter.post('/tag/update/position', tagController.updatePosition);
authRouter.post('/tag/delete', tagController.delete);

authRouter.post('/task/get', taskController.get);
authRouter.post('/task/create', taskController.create);
authRouter.post('/task/order', taskController.order);
authRouter.post('/task/update/content', taskController.updateContent);
authRouter.post('/task/update/type', taskController.updateType);
authRouter.post('/task/update/position', taskController.updatePosition);
authRouter.post('/task/update/tags', taskController.updateTags);
authRouter.post('/task/update/dates', taskController.updateDates);
authRouter.post('/task/update/status', taskController.updateStatus);
authRouter.post('/task/delete', taskController.delete);

router.use('/a', authRouter);
router.use('/g', guestRouter);

export default router;
