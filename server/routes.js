import express from 'express';

import verifyToken from './middleware/verifyToken.js';

import projectController from './controllers/projectController.js';
import listController from './controllers/listController.js';
import tagsController from './controllers/tagsController.js'
import taskController from './controllers/taskController.js';
import userController from './controllers/userController.js';

const router = express.Router();
const guestRouter = express.Router();
const authRouter = express.Router();
authRouter.use(verifyToken);

guestRouter.post('/user/create', userController.create);
guestRouter.post('/user/login', userController.login);
guestRouter.post('/user/logout', userController.logout);
authRouter.patch('/user/update/activeProject', userController.updateActiveProject);
authRouter.post('/user/token', userController.token);

authRouter.post('/project/get', projectController.get);
authRouter.post('/project/create', projectController.create);
authRouter.patch('/project/update/name', projectController.updateName);
authRouter.patch('/project/update/color', projectController.updateColor);
authRouter.patch('/project/update/position', projectController.updatePosition);
authRouter.delete('/project/delete/:userID/:projectID/:position', projectController.delete);

authRouter.post('/list/create', listController.create);
authRouter.post('/list/clone', listController.create);
authRouter.patch('/list/update/name', listController.updateName);
authRouter.patch('/list/update/position', listController.updatePosition);
authRouter.delete('/list/delete/list/:projectID/:typeID', listController.deleteList);
authRouter.delete('/list/delete/tasks/:projectID/:typeID', listController.deleteTasks);

authRouter.post('/tag/create', tagsController.create);
authRouter.post('/tag/update/content', tagsController.updateContent);
authRouter.post('/tag/update/position', tagsController.updatePosition);
authRouter.delete('/tag/delete/:projectID/:tagID', tagsController.delete);

authRouter.post('/task/get', taskController.get);
authRouter.post('/task/create', taskController.create);
authRouter.post('/task/order', taskController.order);
authRouter.patch('/task/update/content', taskController.updateContent);
authRouter.patch('/task/update/type', taskController.updateType);
authRouter.patch('/task/update/position', taskController.updatePosition);
authRouter.patch('/task/update/tags', taskController.updateTags);
authRouter.patch('/task/update/dates', taskController.updateDates);
authRouter.patch('/task/update/status', taskController.updateStatus);
authRouter.delete('/task/delete/:projectID/:taskID/:type/:position', taskController.delete);

router.use('/a', authRouter);
router.use('/g', guestRouter);

export default router;
