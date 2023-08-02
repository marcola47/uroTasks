import mongoose from 'mongoose';

import Project from '../models/Project.js';
import Task from '../models/Task.js';

const taskController = {};

/*********************************************************************************************************************************/
taskController.get = async (req, res) =>
{
  try
  {
    const newAccessToken = req.newAccessToken ?? null;

    const projectID = req.query.projectID;
    const project = await Project.findOne({ id: projectID }).select('tasks -_id');
    
    const taskIDs = project.tasks;
    const tasks = await Task.find({ id: { $in: taskIDs } }).lean().select('-_id -__v');
  
    res.status(200).send({ newAccessToken: newAccessToken, tasks: tasks });
  }

  catch (error)
  {
    console.log(error)
    res.status(500).send(
    { 
      header: "Failed to get tasks",
      message: "Internal server error on getting tasks" 
    })
  }
}

/*********************************************************************************************************************************/
taskController.create = async (req, res) => 
{
  const session = await mongoose.startSession();
  session.startTransaction();

  try 
  {
    const newAccessToken = req.newAccessToken ?? null;
    const data = req.body;
    const newTask = new Task(data.newTask);

    await newTask.save();
    await Project.updateOne
    (
      { id: data.projectID }, 
      { $push: { tasks: newTask.id } }
    );
   
    await session.commitTransaction();
    res.status(201).send({ newAccessToken: newAccessToken });
    console.log(`${new Date()}: successfully inserted task to project |${data.projectID}|`)
  }

  catch (error)
  {
    await session.abortTransaction();
    session.endSession();

    console.log(error);
    res.status(500).send(
    { 
      header: "Failed to create task",
      message: "Internal server error on creating task" 
    })
  }
}

/*********************************************************************************************************************************/
taskController.updateContent = async (req, res) => 
{
  const newAccessToken = req.newAccessToken ?? null;
  const data = req.body;

  await Task.updateOne
  (
    { id: data.taskID }, 
    { content: data.newContent, updated_at: new Date() }
  );
  
  res.status(200).send({ newAccessToken: newAccessToken });
  console.log(`${new Date()}: successfully updated task |${data.taskID}|`);
}

/*********************************************************************************************************************************/
taskController.updateType = async (req, res) => 
{
  const newAccessToken = req.newAccessToken ?? null;
  const data = req.body;
  const project = await Project.findOne({ id: data.projectID }).lean().select('tasks -_id');
  const taskList = await Task.find({ id: { $in: project.tasks } });

  await Promise.all(taskList.map(async task => 
  {
    if (task.type === data.types.old && task.position > data.positions.old)
    {
      await Task.updateOne
      (
        { id: task.id },
        { $inc: { position: -1 } }
      );
    }

    else if (task.id === data.taskID)
    {
      await Task.updateOne
      (
        { id: data.taskID }, 
        { $set: { type: data.types.new, position: data.positions.new, updated_at: new Date() } }
      );
    }
  }));

  res.status(200).send({ newAccessToken: newAccessToken });
  console.log(`${new Date()}: successfully moved task to |${data.types.new}|`);
}

/*********************************************************************************************************************************/
taskController.updatePosition = async (req, res, session) =>
{
  const newAccessToken = req.newAccessToken ?? null;
  const data = req.body;

  if (data.direction === 'up')
  {
    await Task.updateOne
    (
      { id: data.updatedTaskID },
      { $inc: { position: -1 } },
      { session }
    );
    
    await Task.updateOne
    (
      { id: data.otherTaskID }, 
      { $inc: { position: +1 } },
      { session }
    );
  }

  else if (data.direction === 'down')
  {
    await Task.updateOne
    (
      { id: data.updatedTaskID }, 
      { $inc: { position: +1 } },
      { session }
    );
    
    await Task.updateOne
    (
      { id: data.otherTaskID }, 
      { $inc: { position: -1 } },
      { session }
    );
  }

  else 
    throw new Error('Invalid direction');

  res.status(200).send({ newAccessToken: newAccessToken })
  console.log(`${new Date()}: successfully updated task position`);
}

/*********************************************************************************************************************************/
taskController.updateTags = async (req, res) =>
{
  const newAccessToken = req.newAccessToken ?? null;
  const data = req.body;

  if (req.query.method === 'push')
  {
    await Task.updateOne
    (
      { id: data.taskID },
      { $push: { tags: data.tagID } } 
    )
  }

  else if (req.query.method === 'pull')
  {
    await Task.updateOne
    (
      { id: data.taskID },
      { $pull: { tags: data.tagID } } 
    )
  }

  else 
    throw new Error('Invalid method');

  res.status(200).send({ newAccessToken: newAccessToken })
  console.log(`${new Date()}: successfully updated task tags`);
}

/*********************************************************************************************************************************/
taskController.update = async (req, res) => 
{
  const session = await mongoose.startSession();
  session.startTransaction();

  try 
  {
    const type = req.query.type;

    if (type === 'content')
      await taskController.updateContent(req, res);

    else if (type === 'type') // sessions sometimes, for whatever reason, don't work here
      await taskController.updateType(req, res);

    else if (type === 'position')
      await taskController.updatePosition(req, res, session);

    else if (type === 'tags')
      await taskController.updateTags(req, res);

    await session.commitTransaction();
  }
  catch (error)
  {
    await session.abortTransaction();
    session.endSession();

    console.log(error)
    res.status(500).send(
    { 
      header: "Failed to update task",
      message: "Internal server error on updating task" 
    })
  }
}

/*********************************************************************************************************************************/
taskController.delete = async (req, res) =>
{
  try
  {
    const newAccessToken = req.newAccessToken ?? null;

    const data = req.body;
    const project = await Project.findOne({ id: data.projectID }).lean().select('tasks -_id');
    project.tasks.splice(project.tasks.findIndex(task => task === data.taskID), 1);
    
    const taskList = await Task.find({ id: { $in: project.tasks } });
  
    await Project.updateOne
    (
      { id: data.projectID }, 
      { $pull: { tasks: data.taskID } }
    );
  
    await Promise.all(taskList.map(async task => 
    {
      if (task.type === data.taskType && task.position > data.position) 
        await Task.updateOne({ id: task.id }, { $inc: { position: -1 } });
        
      else if (task.id === data.taskID)
        await Task.deleteOne({ id: data.taskID });
    }));

    res.status(200).send({ newAccessToken: newAccessToken });
    console.log(`${new Date()}: successfully deleted task |${data.taskID}|`);
  }

  catch (error)
  {
    console.log(error)
    res.status(500).send(
    { 
      header: "Failed to delete task",
      message: "Internal server error on deleting task" 
    })
  }
}

export default taskController;