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
    const projectsMeta = await Project.find({ id: { $in: req.body.projectIDs } }).lean().select('-tasks -created_at -updated_at -_id -__v');
    res.status(200).send({ newAccessToken: req.newAccessToken, projectsMeta: projectsMeta });
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
    const { userID, newProject, type } = req.body;
    const project = new Project(newProject);

    if (type === 'clone')
      await Task.insertMany(req.body.tasks);

    await project.save();
    await User.updateOne
    (
      { id: userID }, 
      {
        $set: { activeProject: project.id },
        $push: { projects: project.id }
      }
    );
    
    await session.commitTransaction();
    session.endSession();

    res.status(201).send({ newAccessToken: req.newAccessToken });
    console.log(`${new Date()}: successfully created project: ${newProject.name}`);
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
  const { projectID, newName } = req.body;

  await Project.updateOne
  (
    { id: projectID }, 
    { $set: { name: newName, updated_at: Date.now() } }, 
    { session });
  
  res.status(200).send({ newAccessToken: req.newAccessToken });
  console.log(`${new Date()}: successfully updated project name to: ${newName}`);
}

/*********************************************************************************************************************************/
projectController.updateColor = async (req, res, session) => 
{
  const { projectID, newColor } = req.body;
  
  await Project.updateOne
  (
    { id: projectID }, 
    { $set: { color: newColor, updated_at: Date.now() } }, 
    { session }
  );
  
  res.status(200).send({ newAccessToken: req.newAccessToken });
  console.log(`${new Date()}: successfully updated project color to: ${newColor}`);
}

/*********************************************************************************************************************************/
projectController.updateTags = async (req, res, session) => 
{
  if (req.query.crud === 'create')
  {
    const { projectID, newTag } = req.body;

    await Project.updateOne
    (
      { id: projectID },
      { 
        $set: { updated_at: Date.now() },
        $push: { tags: newTag }
      },
      { session }
    );

    res.status(201).send({ newAccessToken: req.newAccessToken });
    console.log(`${new Date()}: successfully updated project tags`);
  }

  else if (req.query.crud === 'update')
  {
    const { projectID, tagID, tagName, tagColor } = req.body;

    await Project.updateOne
    (
      { id: projectID, 'tags.id': tagID }, 
      { $set: { 'tags.$.name': tagName, 'tags.$.color': tagColor, updated_at: Date.now() } },
      { session }
    );

    res.status(200).send({ newAccessToken: req.newAccessToken });
    console.log(`${new Date()}: successfully updated project tags`);
  }

  else if (req.query.crud = 'delete')
  {
    const { projectID, tagID } = req.body;
    
    await Task.updateMany
    (
      { project: projectID, tags: { $elemMatch: { $eq: tagID } } }, 
      { $pull: { tags: tagID } }, 
      { multi: true, session },
    );

    await Project.updateOne
    (
      { id: projectID, 'tags.id': tagID },
      { $pull: { tags: { id: tagID } }, $set: { updated_at: Date.now() } },
      { session }
    );

    res.status(200).send({ newAccessToken: req.newAccessToken });
    console.log(`${new Date()}: successfully updated project tags`);
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

    else if (type === 'tags')
      await projectController.updateTags(req, res, session)
    
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
    const { projectID, userID } = req.body;
    const taskIDs = (await Project.findOne({ id: projectID }).lean().select('tasks -_id')).tasks;
    
    await Task.deleteMany({ id: { $in: taskIDs } });
    await Project.deleteOne({ id: projectID });
    await User.updateOne
    (
      { id: userID },
      {
        $set: { activeProject: null },
        $pull: { projects: projectID }
      }
    );

    console.log(`${new Date()}: successfully deleted project: ${projectID}`);
    res.status(200).send({ newAccessToken: req.newAccessToken });
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
