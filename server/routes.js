import express from 'express';

import verifyToken from './middleware/verifyToken.js';

import projectController from './controllers/projectController.js'
import taskController from './controllers/taskController.js';
import userController from './controllers/userController.js';

const router = express.Router();
const guestRouter = express.Router();
const authRouter = express.Router();
authRouter.use(verifyToken);

/***********************************************************************/
/*** project routes ***/
authRouter.post('/project/get', projectController.get);
authRouter.post('/project/create', projectController.create);
authRouter.post('/project/update', projectController.update);
authRouter.post('/project/delete', projectController.delete);

/***********************************************************************/
/*** task routes ***/
authRouter.post('/task/get', taskController.get);
authRouter.post('/task/create', taskController.create);
authRouter.post('/task/update', taskController.update);
authRouter.post('/task/delete', taskController.delete);

/***********************************************************************/
/*** user routes ***/
guestRouter.post('/user/login', userController.login);
guestRouter.post('/user/logout', userController.logout);
guestRouter.post('/user/create', userController.create);
authRouter.post('/user/update', userController.update);
authRouter.post('/user/token', userController.token);

router.use('/a', authRouter);
router.use('/g', guestRouter);

export default router;
