import mongoose from 'mongoose';

import Project from '../models/Project.js';
import Task from '../models/Task.js';

const listController = {};

listController.create = async (req, res) => 
{
  const session = await mongoose.startSession();
  session.startTransaction();

  try
  {
    const { projectID, newType } = req.body;
    
    await Project.updateOne
    (
      { id: projectID }, 
      { 
        $set: { updated_at: Date.now() },
        $push: { types: newType } 
      }
    );
    
    await session.commitTransaction();
    session.endSession();

    res.status(201).send({ newAccessToken: req.newAccessToken });
    console.log(`${new Date()}: successfully updated project types`);
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

listController.clone = async (req, res) => 
{
  const session = await mongoose.startSession();
  session.startTransaction();

  try
  {
    const { projectID, newType, taskList } = req.body;

    await Task.insertMany(taskList);
    await Project.updateOne
    (
      { id: projectID },
      { 
        $set: { updated_at: Date.now() },
        $push: { types: newType, tasks: taskList.map(listTask => listTask.id) } 
      }
    )

    await session.commitTransaction();
    session.endSession();

    res.status(201).send({ newAccessToken: req.newAccessToken });
    console.log(`${new Date()}: successfully cloned task list`);
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

listController.updateName = async (req, res) => 
{
  const session = await mongoose.startSession();
  session.startTransaction();

  try
  {
    const { projectID, typeID, typeName } = req.body;

    await Project.updateOne
    (
      { id: projectID, 'types.id': typeID }, 
      { $set: { 'types.$.name': typeName, updated_at: Date.now() } }
    );
    
    await Task.updateMany
    (
      { project: projectID, type: typeID },
      { $set: { type: typeName } }
    );

    await session.commitTransaction();
    session.endSession();

    res.status(200).send({ newAccessToken: req.newAccessToken });
    console.log(`${new Date()}: successfully updated project types`); 
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

listController.updatePosition = async (req, res) =>
{
  const session = await mongoose.startSession();
  session.startTransaction();

  try
  {
    const { typeID, params } = req.body;
    const typesList = (await Project.findOne({ id: params.sourceID }).select('types -_id')).types;
    const positions = { old: params.sourcePosition, new: params.destinationPosition };
    
    if (params.sourceID === params.destinationID)
    {
      typesList.forEach(listType => 
      {
        const isBetween =
          listType.position >= Math.min(positions.old, positions.new) && 
          listType.position <= Math.max(positions.old, positions.new)
    
        if (listType.id === typeID) 
          listType.position = positions.new;
        
        else if (listType.id !== typeID && isBetween)
          listType.position += positions.new > positions.old ? -1 : 1;
      });

      await Project.updateOne
      (
        { id: params.sourceID }, 
        { $set: { types: typesList } }
      );
    }

    
    else
    { // implement cross project moving
      console.log('fodase')
    }

    await session.commitTransaction();
    session.endSession();

    res.status(200).send({ newAccessToken: req.newAccessToken });
    console.log(`${new Date()}: successfully updated project types`);
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

listController.deleteList = async (req, res) => 
{
  const session = await mongoose.startSession();
  session.startTransaction();

  try 
  {
    const { projectID, typeID } = req.body;
    const taskIDs = (await Task.find({ type: typeID, project: projectID })).map(task => task.id);

    await Task.deleteMany({ id: { $in: taskIDs } });
    await Project.updateOne
    (
      { id: projectID, 'types.id': typeID }, 
      { 
        $set: { updated_at: Date.now() },
        $pull: { types: { id: typeID }, tasks: { $in: taskIDs } }
      }
    );

    await session.commitTransaction();
    session.endSession();

    res.status(200).send({ newAccessToken: req.newAccessToken });
    console.log(`${new Date()}: successfully updated project types`);
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

listController.deleteTasks = async (req, res) =>
{
  const session = await mongoose.startSession();
  session.startTransaction();

  try 
  {
    const { projectID, typeID } = req.body;
    const taskIDs = (await Task.find({ type: typeID, project: projectID })).map(task => task.id);

    await Task.deleteMany({ id: { $in: taskIDs } });
    await Project.updateOne
    (
      { id: projectID },
      { 
        $set: { updated_at: Date.now() }, 
        $pull: { tasks: { $in: taskIDs } } 
      }
    )

    await session.commitTransaction();
    session.endSession();

    res.status(200).send({ newAccessToken: req.newAccessToken });
    console.log(`${new Date()}: successfully deleted all tasks from list`);
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

export default listController;