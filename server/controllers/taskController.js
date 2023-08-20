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
    { $set: { content: data.newContent, updated_at: Date.now() } }
  );

  await Project.updateOne
  (
    { id: data.projectID },
    { $set: { updated_at: Date.now() } }
  )
  
  res.status(200).send({ newAccessToken: newAccessToken });
  console.log(`${new Date()}: successfully updated task |${data.taskID}|`);
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
  console.log(`${new Date()}: successfully moved task to |${data.types.new}|`);
}

/*********************************************************************************************************************************/
taskController.updatePosition = async (req, res, session) => 
{
  const newAccessToken = req.newAccessToken ?? null;
  const { projectID, taskID, params } = req.body;

  const positions = { old: params.sourcePosition, new: params.destinationPosition };
  const bulkOps = [];

  const taskList = await Task.find({ project: projectID, type: { $in: [params.sourceID, params.destinationID] }});
  taskList.forEach(listTask => 
  {
    const isSource = listTask.type === params.sourceID;
    const isDestination = listTask.type === params.destinationID;

    if (listTask.id === taskID) 
    {
      bulkOps.push(
      {
        updateOne: 
        {
          filter: { id: taskID },
          update: 
          {
            $set: 
            {
              type: params.destinationID,
              position: positions.new,
              updated_at: Date.now(),
            },
          },
        },
      });
    }
     
    else if (isSource && listTask.position > positions.old) 
    {
      bulkOps.push(
      {
        updateOne: 
        {
          filter: { id: listTask.id },
          update: { $inc: { position: -1 } },
        },
      });
    } 
    
    else if (isDestination && listTask.position >= positions.new) 
    {
      bulkOps.push(
      {
        updateOne: 
        {
          filter: { id: listTask.id },
          update: { $inc: { position: 1 } },
        },
      });
    }
  });

  await Task.bulkWrite(bulkOps, { session });

  res.status(200).send({ newAccessToken });
  console.log(`${new Date()}: successfully updated task position`);
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
  console.log(`${new Date()}: successfully updated task tags`);
}
/*********************************************************************************************************************************/
taskController.updateDates = async (req, res, session) => 
{
  const newAccessToken = req.newAccessToken ?? null;
  const data = req.body;

  const startDate = data.startDate ? new Date(data.startDate) : null;
  const dueDate = data.dueDate ? new Date(data.dueDate) : null;

  await Task.updateOne
  (
    { id: data.taskID },
    { $set: { start_date: startDate, due_date: dueDate } },
    { session }
  )

  res.status(200).send({ newAccessToken: newAccessToken })
  console.log(`${new Date()}: successfully updated task dates`);
}

/*********************************************************************************************************************************/
taskController.updateCompleted = async (req, res, session) => 
{
  const newAccessToken = req.newAccessToken ?? null;
  const data = req.body;

  await Task.updateOne
  (
    { id: data.taskID },
    { $set: { completed: data.completed } },
    { session }
  )

  res.status(200).send({ newAccessToken: newAccessToken })
  console.log(`${new Date()}: successfully updated task completed status`);
}

/*********************************************************************************************************************************/
taskController.update = async (req, res) => 
{
  const session = await mongoose.startSession();
  session.startTransaction();

  try 
  {
    const type = req.query.type;

    if (type === 'content') //for some god forsaken reason this runs twice. Eventually I'll fix it.
      await taskController.updateContent(req, res);

    else if (type === 'type')
      await taskController.updateType(req, res, session);

    else if (type === 'position')
      await taskController.updatePosition(req, res, session);

    else if (type === 'tags')
      await taskController.updateTags(req, res, session);

    else if (type === 'dates')
      await taskController.updateDates(req, res, session);

    else if (type === 'completed')
      await taskController.updateCompleted(req, res, session);

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
    console.log(`${new Date()}: successfully deleted task |${data.taskID}|`);
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

/*********************************************************************************************************************************/
taskController.order = async (req, res) => 
{
  const session = await mongoose.startSession();
  session.startTransaction();

  try
  {
    const newAccessToken = req.newAccessToken ?? null;
    const data = req.body;
    const bulkOps = [];
  
    const query = data.typeID === 'all'
      ? { project: data.projectID }
      : { project: data.projectID, type: data.typeID }


    const sortMethods = 
    {
      alpha_asc     : { content: 1     },
      alpha_desc    : { content: -1    },
      due_close     : { due_date: 1    },
      due_far       : { due_date: -1   },
      creation_close: { created_at: 1  },
      creation_far  : { created_at: -1 },
      update_close  : { updated_at: 1  },
      update_far    : { updated_at: -1 }
    }
    
    const taskList = await Task.find(query).sort('type').sort(sortMethods[data.method] || sortMethods['alpha_asc'])
    
    let curPosition = 1;
    let curType = taskList[0].type;

    taskList.forEach(listTask => 
    {
      if (listTask.type !== curType) 
      {
        curPosition = 1;
        curType = listTask.type;
      }

      listTask.position = curPosition;
      curPosition++;

      bulkOps.push({
        updateOne: 
        {
          filter: { id: listTask.id },
          update: { $set: { position: listTask.position } }
        }
      })
    });

    await Task.bulkWrite(bulkOps);

    await session.commitTransaction();
    session.endSession();

    res.status(200).send({ newAccessToken: newAccessToken });
    console.log(`${new Date()}: successfully ordered task list |${data.typeID}|`);
  }

  catch (error)
  {
    await session.commitTransaction();
    session.endSession();

    console.log(error)
    res.status(500).send(
    { 
      header: "Failed to order tasks",
      message: "Internal server error on ordering tasks" 
    })
  }
}

export default taskController;