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
    const newAccessToken = req.newAccessToken ?? null;
    const data = req.body;
    
    await Project.updateOne
    (
      { id: data.projectID }, 
      { $push: { types: data.newType }, $set: { updated_at: Date.now() } }
    );
    
    await session.commitTransaction();
    session.endSession();

    res.status(201).send({ newAccessToken: newAccessToken });
    console.log(`${new Date()}: successfully updated project types`);
  }

  catch
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
    // TODO: get tasks from db instead of request
    const newAccessToken = req.newAccessToken ?? null;
    const data = req.body;

    await Project.updateOne
    (
      { id: data.projectID },
      { $push: { types: data.newType, tasks: data.taskList.map(listTask => listTask.id) } }
    )

    await Task.insertMany(data.taskList);

    await session.commitTransaction();
    session.endSession();

    res.status(201).send({ newAccessToken: newAccessToken });
    console.log(`${new Date()}: successfully cloned task list`);
  }

  catch
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
    const newAccessToken = req.newAccessToken ?? null;
    const data = req.body;

    console.log(data);

    await Project.updateOne
    (
      { id: data.projectID, 'types.id': data.typeID }, 
      { $set: { 'types.$.name': data.typeName, updated_at: Date.now() } }
    );
    
    await Task.updateMany
    (
      { project: data.projectID, type: data.typeID },
      { $set: { type: data.typeName } }
    );

    await session.commitTransaction();
    session.endSession();

    res.status(200).send({ newAccessToken: newAccessToken });
    console.log(`${new Date()}: successfully updated project types`); 
  }

  catch
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
    // implement cross project moving
    // refactor
    const newAccessToken = req.newAccessToken ?? null;
    const data = req.body;
    const curProject = await Project.findOne({ id: data.curProjectID })
    const typesList = curProject.types;

    if (data.positions.new > data.positions.old)
    {
      typesList.map(listType => 
      {
        if (listType.id !== data.typeID && listType.position >= data.positions.old && listType.position <= data.positions.new)
          listType.position--;

        else if (listType.id === data.typeID)
          listType.position = data.positions.new

        return listType;
      });
    }

    else if (data.positions.new < data.positions.old)
    {
      typesList.map(listType => 
      {
        if (listType.id !== data.typeID && listType.position <= data.positions.old && listType.position >= data.positions.new)
          listType.position++;

        else if (listType.id === data.typeID)
          listType.position = data.positions.new

        return listType;
      })
    }

    await Project.updateOne
    (
      { id: data.curProjectID }, 
      { $set: { types: typesList } }
    );

    await session.commitTransaction();
    session.endSession();

    res.status(200).send({ newAccessToken: newAccessToken });
    console.log(`${new Date()}: successfully updated project types`);
  }

  catch
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
    const newAccessToken = req.newAccessToken ?? null;
    const data = req.body;

    await Task.deleteMany({ type: data.typeID, project: data.projectID });
    
    await Project.updateOne
    (
      { id: data.projectID, 'types.id': data.typeID }, 
      { $pull: { types: { id: data.typeID } }, $set: { updated_at: Date.now() } }
    );

    await session.commitTransaction();
    session.endSession();

    res.status(200).send({ newAccessToken: newAccessToken });
    console.log(`${new Date()}: successfully updated project types`);
  }

  catch
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
    const newAccessToken = req.newAccessToken ?? null;
    const data = req.body;

    await Task.deleteMany({ type: data.typeID, project: data.projectID });

    await Project.updateOne
    (
      { id: data.projectID },
      { $set: { updated_at: Date.now() } }
    )

    await session.commitTransaction();
    session.endSession();

    res.status(200).send({ newAccessToken: newAccessToken });
    console.log(`${new Date()}: successfully deleted all tasks from list`);
  }

  catch
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