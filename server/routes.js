import express from 'express';

import Project from './models/Project.js';
import Task from './models/Task.js';

import verifyToken from './middleware/verifyToken.js';

import projectController from './controllers/projectController.js'
import taskController from './controllers/taskController.js';
import userController from './controllers/userController.js';

const router = express.Router();

/********************************************************************************************/
/*** project routes ***/
router.post('/project-get', async (req , res) => 
{
  const projectIDs = req.body[0];
  const projectsMeta = await Project.find({ id: { $in: projectIDs } }).lean().select('-created_at -updated_at -_id -__v');
    
  await Promise.all (projectsMeta.map(async project => 
  {
    if (project.activeTasks === -1)
    {
      await Task.countDocuments({ id: { $in: project.tasks }, type: { $in: ['todo', 'doing'] } })
      .then(async count => 
      {
        await Project.updateOne({ id: project.id }, { activeTasks: count });
        project.activeTasks = count;
      })
      .catch(err => console.log(err))
    }

    delete project.tasks;
    return project;
  }));

  res.status(200).send(projectsMeta);
});

router.post('/project-create', async (req, res) => 
{
  const project = req.body;
  
  await projectController.create(project);
  res.sendStatus(201);
});

router.post('/project-update', async (req, res) => 
{
  const type = req.query.type;

  if (type === 'name')
  {
    const [projectID, newName] = [req.body[0], req.body[1]];
    await projectController.updateName(projectID, newName);
  }
  
  else if (type === 'color')
  {
    const [projectID, newColor] = [req.body[0], req.body[1]];
    await projectController.updateColor(projectID, newColor);
  }

  res.sendStatus(200);
})

router.post('/project-delete', async (req, res) => 
{
  const projectID = req.body[0];
  
  await projectController.delete(projectID);
  res.sendStatus(200);
});

/********************************************************************************************/
/*** task routes ***/
router.get('/tasks-get', async (req, res) => 
{
  const projectID = req.query.projectID;
  const project = await Project.findOne({ id: projectID }).select('tasks -_id');
  
  const taskIDs = project.tasks;
  const tasks = await Task.find({ id: { $in: taskIDs } }).lean().select('-_id -__v');

  res.status(200).send(tasks);
});

router.post('/task-create', async (req, res) => 
{
  const data = req.body;
  const [projectID, taskData] = [data[0], data[1]];

  await taskController.create(projectID, taskData);
  res.sendStatus(201);
});

router.post('/task-update', verifyToken, taskController.update);
router.post('/task-delete', verifyToken, taskController.delete);

/********************************************************************************************/
/*** user routes ***/
router.post('/user/loginFromToken', verifyToken, userController.loginFromToken);
router.post('/user/login', userController.login);
router.post('/user/logout', userController.logout);
router.post('/user/create', userController.create);
router.post('/user/update', userController.update);

export default router;
