import mongoose from 'mongoose';

import Project from '../models/Project.js';
import Task from '../models/Task.js';
import User from '../models/User.js';

const projectController = {};

projectController.get = async (req, res) => 
{
  try
  {
    const projects = await Project
      .find({ id: { $in: req.body.projectIDs } })
      .select('-tasks -_id -__v');
    
    res.status(200).send({ newAccessToken: req.newAccessToken, projects: projects });
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

projectController.create = async (req, res) =>
{
  const session = await mongoose.startSession();
  session.startTransaction();

  try 
  {
    const { userID, newProject, type } = req.body;
    const projectPosition = newProject.position;

    delete newProject.position;
    const project = new Project(newProject);

    if (type === 'clone')
      await Task.insertMany(req.body.tasks);

    await Project.create(project);
    await User.updateOne
    (
      { id: userID },
      {
        $set: { activeProject: project.id },
        $push: { projects: { id: project.id, projectPosition } }
      }
    );
    
    await session.commitTransaction();
    await session.endSession();

    res.status(201).send({ newAccessToken: req.newAccessToken });
    console.log(`${new Date()}: successfully created project: ${newProject.name}`);
  }

  catch (error)
  {
    await session.abortTransaction();
    await session.endSession();
    
    console.log(error);
    res.status(500).send(
    {
      header: "Failed to create project",
      message: "Internal server error on creating project" 
    })
  }
}

projectController.updateName = async (req, res) => 
{
  const session = await mongoose.startSession();
  session.startTransaction();

  try
  {
    const { projectID, newName } = req.body;

    await Project.updateOne
    (
      { id: projectID }, 
      { $set: { name: newName, updated_at: Date.now() } }
  );

    await session.commitTransaction();
    await session.endSession();

    res.status(200).send({ newAccessToken: req.newAccessToken });
    console.log(`${new Date()}: successfully updated project name to: ${newName}`);
  }

  catch (error)
  {
    await session.abortTransaction();
    await session.endSession();
    
    console.log(error);
    res.status(500).send(
    {
      header: "Failed to create project",
      message: "Internal server error on creating project" 
    })
  }
}

projectController.updateColor = async (req, res) => 
{
  const session = await mongoose.startSession();
  session.startTransaction();

  try
  {
    const { projectID, newColor } = req.body;
  
    await Project.updateOne
    (
      { id: projectID }, 
      { $set: { color: newColor, updated_at: Date.now() } }
    );
    
    await session.commitTransaction();
    await session.endSession();

    res.status(200).send({ newAccessToken: req.newAccessToken });
    console.log(`${new Date()}: successfully updated project color to: ${newColor}`);
  }

  catch (error)
  {
    await session.abortTransaction();
    await session.endSession();
    
    console.log(error);
    res.status(500).send(
    {
      header: "Failed to create project",
      message: "Internal server error on creating project" 
    })
  }
}

projectController.updatePosition = async (req, res) => 
{
  const session = await mongoose.startSession();
  session.startTransaction();

  try
  {
    const { userID, params } = req.body;
    const projectList = (await User.findOne({ id: userID }).select('projects -_id')).projects;
    const positions = { old: params.sourcePosition, new: params.destinationPosition };
    
    projectList.forEach(listProject => 
    {
      const isBetween =
        listProject.position >= Math.min(positions.old, positions.new) && 
        listProject.position <= Math.max(positions.old, positions.new)
  
      if (listProject.id === typeID) 
        listProject.position = positions.new;
      
      else if (listProject.id !== typeID && isBetween)
        listProject.position += positions.new > positions.old ? -1 : 1;
    });

    await User.updateOne
    (
      { id: userID }, 
      { $set: { projects: projectList } }
    );

    await session.commitTransaction();
    await session.endSession();

    res.status(200).send({ newAccessToken: req.newAccessToken });
    console.log(`${new Date()}: successfully updated project positions`);
  }

  catch (error)
  {
    await session.abortTransaction();
    await session.endSession();

    console.log(error);
    res.status(500).send(
    {
      header: 'Failed to update project',
      message: 'Internal server error on updating project',
    });
  }
}

projectController.delete = async (req, res) =>
{
  const session = await mongoose.startSession();
  session.startTransaction();

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

    await session.commitTransaction();
    await session.endSession();

    console.log(`${new Date()}: successfully deleted project: ${projectID}`);
    res.status(200).send({ newAccessToken: req.newAccessToken });
  }

  catch (error)
  {
    await session.abortTransaction();
    await session.endSession();

    console.log(error);
    res.status(500).send(
    {
      header: "Failed to delete project",
      message: "Internal server error on deleting project" 
    })
  }
}

export default projectController;
