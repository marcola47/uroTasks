import express from 'express';

import verifyToken from './middleware/verifyToken.js';

import projectController from './controllers/projectController.js'
import taskController from './controllers/taskController.js';
import userController from './controllers/userController.js';

const router = express.Router();

/********************************************************************************************/
/*** project routes ***/
router.post('/project/get', verifyToken, projectController.get);
router.post('/project/create', verifyToken, projectController.create);
router.post('/project/update', verifyToken, projectController.update);
router.post('/project/delete', verifyToken, projectController.delete);

/********************************************************************************************/
/*** task routes ***/
router.post('/task/get', verifyToken, taskController.get);
router.post('/task/create', verifyToken, taskController.create);
router.post('/task/update', verifyToken, taskController.update);
router.post('/task/delete', verifyToken, taskController.delete);

/********************************************************************************************/
/*** user routes ***/
router.post('/user/token', verifyToken, userController.token);
router.post('/user/login', userController.login);
router.post('/user/logout', userController.logout);
router.post('/user/create', userController.create);
router.post('/user/update', userController.update);

export default router;
