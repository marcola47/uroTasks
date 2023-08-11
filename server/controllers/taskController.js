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
      { $push: { tasks: newTask.id }, $set: { updated_at: Date.now() } }
    );
   
    await session.commitTransaction();
    session.endSession();

    res.status(201).send({ newAccessToken: newAccessToken });
    console.log(`${Date.now()}: successfully inserted task to project |${data.projectID}|`)
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
taskController.updateContent = async (req, res, session) => 
{
  const newAccessToken = req.newAccessToken ?? null;
  const data = req.body;

  await Task.updateOne
  (
    { id: data.taskID }, 
    { content: data.newContent, $set: { updated_at: Date.now() } },
    { session }
  );

  await Project.updateOne
  (
    { id: data.projectID },
    { $set: { updated_at: Date.now() } },
    { session }
  )
  
  res.status(200).send({ newAccessToken: newAccessToken });
  console.log(`${Date.now()}: successfully updated task |${data.taskID}|`);
}

/*********************************************************************************************************************************/
taskController.updateType = async (req, res,  session) => 
{
  const newAccessToken = req.newAccessToken ?? null;
  const data = req.body;
  const project = await Project.findOne({ id: data.projectID }).lean().select('tasks -_id');
  const taskList = await Task.find({ id: { $in: project.tasks } });

  const bulkOps = [];

  taskList.forEach(task => 
  {
    if (task.type === data.types.old && task.position > data.positions.old)
    {
      bulkOps.push(
      {
        updateOne: 
        {
          filter: { id: task.id },
          update: { $inc: { position: -1 }, updated_at: Date.now() }
        }
      })
    }

    else if (task.id === data.taskID)
    {
      bulkOps.push(
      {
        updateOne:
        {
          filter: { id: task.id },
          update: { $set: { type: data.types.new, position: data.positions.new, updated_at: Date.now() } }
        }
      })
    }
  })

  if (bulkOps.length > 0)
    await Task.bulkWrite(bulkOps, { session });

  await Project.updateOne
  (
    { id: data.projectID },
    { $set: { updated_at: Date.now() } },
    { session }
  )

  res.status(200).send({ newAccessToken: newAccessToken });
  console.log(`${Date.now()}: successfully moved task to |${data.types.new}|`);
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
      { $inc: { position: -1 }, $set: { updated_at: Date.now() } },
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
      { $inc: { position: +1 }, $set: { updated_at: Date.now() }},
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

  await Project.updateOne
  (
    { id: data.projectID },
    { $set: { updated_at: Date.now() } },
    { session }
  )

  res.status(200).send({ newAccessToken: newAccessToken })
  console.log(`${Date.now()}: successfully updated task position`);
}

/*********************************************************************************************************************************/
taskController.updateTags = async (req, res, session) =>
{
  const newAccessToken = req.newAccessToken ?? null;
  const data = req.body;

  if (req.query.method === 'push')
  {
    await Task.updateOne
    (
      { id: data.taskID },
      { $push: { tags: data.tagID }, $set: { updated_at: Date.now() } },
      { session } 
    )
  }

  else if (req.query.method === 'pull')
  {
    await Task.updateOne
    (
      { id: data.taskID },
      { $pull: { tags: data.tagID }, $set: { updated_at: Date.now() } },
      { session }
    )
  }

  else 
    throw new Error('Invalid method');

  await Project.updateOne
  (
    { id: data.projectID },
    { $set: { updated_at: Date.now() } },
    { session }
  )

  res.status(200).send({ newAccessToken: newAccessToken })
  console.log(`${Date.now()}: successfully updated task tags`);
}
/*********************************************************************************************************************************/
taskController.updateDates = async (req, res, session) => 
{
  const newAccessToken = req.newAccessToken ?? null;
  const data = req.body;

  const startDate = data.startDate === null ? null : new Date(data.startDate);
  const dueDate = data.dueDate === null ? null : new Date(data.dueDate);

  console.log(data.taskID)
  console.log(startDate)
  console.log(dueDate)

  await Task.updateOne
  (
    { id: data.taskID },
    { $set: { start_date: startDate, due_date: dueDate } },
    { session }
  )

  res.status(200).send({ newAccessToken: newAccessToken })
  console.log(`${Date.now()}: successfully updated task dates`);
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
      await taskController.updateContent(req, res, session);

    else if (type === 'type') // sessions don't work here
      await taskController.updateType(req, res, session);

    else if (type === 'position')
      await taskController.updatePosition(req, res, session);

    else if (type === 'tags')
      await taskController.updateTags(req, res, session);

    else if (type === 'dates')
      await taskController.updateDates(req, res, session);

    await session.commitTransaction();
    session.endSession();
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
  const session = await mongoose.startSession();
  session.startTransaction();

  try
  {
    const newAccessToken = req.newAccessToken ?? null;

    const data = req.body;
    const project = await Project.findOne({ id: data.projectID }).lean().select('tasks -_id');
    project.tasks.splice(project.tasks.findIndex(task => task === data.taskID), 1);
    
    const taskList = await Task.find({ id: { $in: project.tasks } });
    const bulkOps = [];

    taskList.forEach(task =>
    {
      if (task.type === data.taskType && task.position > data.position) 
      {
        bulkOps.push(
        {
          updateOne:
          {
            filter: { id: task.id },
            update: { $inc: { position: -1 } }
          }
        })
      }

      else if (task.id === data.taskID)
        bulkOps.push({ deleteOne: { filter: { id: task.id } } })
    })

    if (bulkOps.length > 0)
      await Task.bulkWrite(bulkOps);

    await Project.updateOne
    (
      { id: data.projectID }, 
      { $pull: { tasks: data.taskID }, $set: { updated_at: Date.now() } }
    );

    await session.commitTransaction();
    session.endSession();

    res.status(200).send({ newAccessToken: newAccessToken });
    console.log(`${Date.now()}: successfully deleted task |${data.taskID}|`);
  }

  catch (error)
  {
    await session.abortTransaction();
    session.endSession();

    console.log(error)
    res.status(500).send(
    { 
      header: "Failed to delete task",
      message: "Internal server error on deleting task" 
    })
  }
}

export default taskController;