import mongoose from 'mongoose';

import Project from '../models/Project.js';
import Task from '../models/Task.js';
import User from '../models/User.js';

const projectController = {};

/*********************************************************************************************************************************/
projectController.get = async (req, res) => 
{
  try
  {
    const newAccessToken = req.newAccessToken ?? null;

    const data = req.body;
    const projectsMeta = await Project.find({ id: { $in: data.projectIDs } }).lean().select('-tasks -created_at -updated_at -_id -__v');

    res.status(200).send({ newAccessToken: newAccessToken, projectsMeta: projectsMeta });
  }

  catch (error)
  {
    console.log(error);
    res.status(500).send(
    {
      header: "Failed to fetch projects",
      message: "Internal server error on fetching projects" 
    })
  }
}

/*********************************************************************************************************************************/
projectController.create = async (req, res) =>
{
  const session = await mongoose.startSession();
  session.startTransaction();

  try 
  {
    const newAccessToken = req.newAccessToken ?? null;

    const data = req.body;
    const project = new Project(data.newProject);
    
    const updatedUser = {};
    updatedUser.$push = { projects: project.id };
    updatedUser.$set = { activeProject: project.id };

    await User.updateOne({ id: data.userID }, updatedUser);
    await project.save();
    
    await session.commitTransaction();
    res.status(201).send({ newAccessToken: newAccessToken });
    console.log(`${new Date()}: successfully created project: ${data.newProject.name}`);
  }

  catch (error)
  {
    await session.abortTransaction();
    session.endSession();
    
    console.log(error);
    res.status(500).send(
    {
      header: "Failed to create project",
      message: "Internal server error on creating project" 
    })
  }
}

/*********************************************************************************************************************************/
projectController.updateName = async (req, res, session) => 
{
  const newAccessToken = req.newAccessToken ?? null;
  const data = req.body;

  await Project.updateOne({ id: data.projectID }, { name: data.newName }, { session });
  res.status(200).send({ newAccessToken: newAccessToken });
  console.log(`${new Date()}: successfully updated project name to: ${data.newName}`);
}

/*********************************************************************************************************************************/
projectController.updateColor = async (req, res, session) => 
{
  const newAccessToken = req.newAccessToken ?? null;
  const data = req.body;
  
  await Project.updateOne
  (
    { id: data.projectID }, 
    { color: data.newColor }, 
    { session }
  );
  
  res.status(200).send({ newAccessToken: newAccessToken });
  console.log(`${new Date()}: successfully updated project color to: ${data.newColor}`);
}

/*********************************************************************************************************************************/
projectController.updateTypes = async (req, res, session) => 
{
  if (req.query.crud === 'create')
  {
    const newAccessToken = req.newAccessToken ?? null;
    const data = req.body;
    
    await Project.updateOne
    (
      { id: data.projectID }, 
      { $push: { types: data.newType } }, 
      { session }
    );
    
    res.status(200).send({ newAccessToken: newAccessToken });
    console.log(`${new Date()}: successfully updated task types`);
  }

  else if (req.query.crud === 'updateName')
  {
    const newAccessToken = req.newAccessToken ?? null;
    const data = req.body;

    await Project.updateOne
    (
      { id: data.projectID, 'types.id': data.typeID }, 
      { $set: { 'types.$.name': data.typeName } }, 
      { session }
    );
    
    await Task.updateMany
    (
      { project: data.projectID, type: data.typeID },
      { $set: { type: data.typeName } }, 
      { session }
    );

    res.status(200).send({ newAccessToken: newAccessToken });
    console.log(`${new Date()}: successfully updated type to ${data.typeName}`);
  }

  else if (req.query.crud === 'delete')
  {
    const newAccessToken = req.newAccessToken ?? null;
    const data = req.body;

    await Task.deleteMany
    (
      { type: data.typeID, project: data.projectID }, 
      { session }
    );
    
    await Project.updateOne
    (
      { id: data.projectID, 'types.id': data.typeID }, 
      { $pull: { types: { id: data.typeID } } }, 
      { session }
    );

    res.status(200).send({ newAccessToken: newAccessToken });
    console.log(`${new Date()}: successfully updated project types`);
  }
}

/*********************************************************************************************************************************/
projectController.update = async (req, res) => 
{
  const session = await mongoose.startSession();
  session.startTransaction();

  try 
  {
    const type = req.query.type;

    if (type === 'name') 
      await projectController.updateName(req, res, session);
    
    else if (type === 'color') 
      await projectController.updateColor(req, res, session);
    
    else if (type === 'types') 
      await projectController.updateTypes(req, res, session);
    
    else 
      throw new Error('Invalid type');

    await session.commitTransaction();
    session.endSession();
  } 
  
  catch (error) 
  {
    await session.abortTransaction();
    session.endSession();
    
    console.log(error);
    res.status(500).send(
    {
      header: 'Failed to update project',
      message: 'Internal server error on updating project',
    });
  }
}

/*********************************************************************************************************************************/
projectController.delete = async (req, res) =>
{
  try 
  {
    const newAccessToken = req.newAccessToken ?? null;

    const data = req.body;
    const project = await Project.findOne({ id: data.projectID }).lean().select('tasks -_id');
    const taskIDs = project.tasks;
    
    const updatedUser = {};
    updatedUser.$pull = { projects: data.projectID };
    updatedUser.$set = { activeProject: '0' };

    await Task.deleteMany({ id: { $in: taskIDs } });
    await Project.deleteOne({ id: data.projectID });
    await User.updateOne({ id: data.userID }, updatedUser);

    console.log(`${new Date()}: successfully deleted project: ${data.projectID}`);
    res.status(200).send({ newAccessToken: newAccessToken });
  }

  catch (error)
  {
    console.log(error);
    res.status(500).send(
    {
      header: "Failed to delete project",
      message: "Internal server error on deleting project" 
    })
  }
}

export default projectController;
