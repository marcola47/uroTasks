import mongoose from 'mongoose';

import Project from '../models/Project.js';
import Task from '../models/Task.js';

const taskController = {};

taskController.get = async (req, res) =>
{
  try
  {
    const projectID = req.query.projectID;
    const taskIDs = (await Project.findOne({ id: projectID }).select('tasks -_id')).tasks;
    const tasks = await Task.find({ id: { $in: taskIDs } }).select('-_id -__v');
  
    res.status(200).send({ newAccessToken: req.newAccessToken, tasks: tasks });
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

taskController.create = async (req, res) => 
{
  const session = await mongoose.startSession();
  session.startTransaction();

  try 
  {
    const { projectID, newTaks } = req.body;
    const newTask = new Task(newTask);

    await Task.create(newTask);
    await Project.updateOne
    (
      { id: projectID }, 
      { 
        $push: { tasks: newTask.id }, 
        $set: { updated_at: Date.now() } 
      }
    );
   
    await session.commitTransaction();
    await session.endSession();

    res.status(201).send({ newAccessToken: req.newAccessToken });
    console.log(`${new Date()}: successfully inserted task to project |${projectID}|`)
  }

  catch (error)
  {
    await session.abortTransaction();
    await session.endSession();

    console.log(error);
    res.status(500).send(
    { 
      header: "Failed to create task",
      message: "Internal server error on creating task" 
    })
  }
}

taskController.order = async (req, res) => 
{
  const session = await mongoose.startSession();
  session.startTransaction();

  try
  {
    const { projectID, typeID, method } = req.body;
    const bulkOps = [];
  
    const query = typeID === 'all'
      ? { project: projectID }
      : { project: projectID, type: data.typeID }


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
    
    const taskList = await Task
      .find(query).sort('type')
      .sort(sortMethods[method] || sortMethods['alpha_asc'])
    
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

      bulkOps.push(
      {
        updateOne: 
        {
          filter: { id: listTask.id },
          update: { $set: { position: listTask.position } }
        }
      })
    });

    await Task.bulkWrite(bulkOps);

    await session.commitTransaction();
    await session.endSession();

    res.status(200).send({ newAccessToken: req.newAccessToken });
    console.log(`${new Date()}: successfully ordered task list |${typeID}|`);
  }

  catch (error)
  {
    await session.abortTransaction();
    await session.endSession();

    console.log(error)
    res.status(500).send(
    { 
      header: "Failed to order tasks",
      message: "Internal server error on ordering tasks" 
    })
  }
}

taskController.updateContent = async (req, res) => 
{
  const session = await mongoose.startSession();
  session.startTransaction();

  try
  {
    const { projectID, taskID, newContent } = req.body;
  
    await Task.updateOne
    (
      { id: taskID }, 
      { $set: { content: newContent, updated_at: Date.now() } }
    );
  
    await Project.updateOne
    (
      { id: projectID },
      { $set: { updated_at: Date.now() } }
    )
    
    await session.commitTransaction();
    await session.endSession();

    res.status(200).send({ newAccessToken: req.newAccessToken });
    console.log(`${new Date()}: successfully updated task |${taskID}|`);
  }

  catch (error)
  {
    await session.abortTransaction();
    await session.endSession();

    console.log(error)
    res.status(500).send(
    { 
      header: "Failed to update task",
      message: "Internal server error on updating task" 
    })
  }
}

taskController.updateType = async (req, res) => 
{
  const session = await mongoose.startSession();
  session.startTransaction();

  try
  {
    const { projectID, taskID, types, positions } = req.body;
    const project = await Project.findOne({ id: projectID }).lean().select('tasks -_id');
    const taskList = await Task.find({ id: { $in: project.tasks } });
  
    const bulkOps = [];
  
    taskList.forEach(task => 
    {
      if (task.type === types.old && task.position > positions.old)
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
  
      else if (task.id === taskID)
      {
        bulkOps.push(
        {
          updateOne:
          {
            filter: { id: task.id },
            update: { $set: { type: types.new, position: positions.new, updated_at: Date.now() } }
          }
        })
      }
    })
  
    if (bulkOps.length > 0)
      await Task.bulkWrite(bulkOps);
  
    await Project.updateOne
    (
      { id: projectID },
      { $set: { updated_at: Date.now() } }
    )
  
    await session.commitTransaction();
    await session.endSession();

    res.status(200).send({ newAccessToken: req.newAccessToken });
    console.log(`${new Date()}: successfully moved task to |${types.new}|`);
  }

  catch (error)
  {
    await session.abortTransaction();
    await session.endSession();

    console.log(error)
    res.status(500).send(
    { 
      header: "Failed to update task",
      message: "Internal server error on updating task" 
    })
  }
}

taskController.updatePosition = async (req, res) => 
{
  const session = await mongoose.startSession();
  session.startTransaction();

  try
  {
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
            update: { $set: { type: params.destinationID, position: positions.new, updated_at: Date.now() } } 
          }
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
  
    await Task.bulkWrite(bulkOps);
  
    await session.commitTransaction();
    await session.endSession();

    res.status(200).send({ newAccessToken: req.newAccessToken });
    console.log(`${new Date()}: successfully updated task position`);
  }

  catch (error)
  {
    await session.abortTransaction();
    await session.endSession();

    console.log(error)
    res.status(500).send(
    { 
      header: "Failed to update task",
      message: "Internal server error on updating task" 
    })
  }
}

taskController.updateTags = async (req, res) =>
{
  const session = await mongoose.startSession();
  session.startTransaction();

  try
  {
    const { projectID, taskID, tagID } = req.body;
  
    if (req.query.method === 'push')
    {
      await Task.updateOne
      (
        { id: taskID },
        { 
          $push: { tags: tagID }, 
          $set: { updated_at: Date.now() } 
        }
      )
    }
  
    else if (req.query.method === 'pull')
    {
      await Task.updateOne
      (
        { id: taskID },
        { 
          $pull: { tags: tagID }, 
          $set: { updated_at: Date.now() } 
        }
      )
    }
  
    else 
      throw new Error('Invalid method');
  
    await Project.updateOne
    (
      { id: projectID },
      { $set: { updated_at: Date.now() } }
    )
  
    await session.commitTransaction();
    await session.endSession();

    res.status(200).send({ newAccessToken: req.newAccessToken })
    console.log(`${new Date()}: successfully updated task tags`);
  }

  catch (error)
  {
    await session.abortTransaction();
    await session.endSession();

    console.log(error)
    res.status(500).send(
    { 
      header: "Failed to update task",
      message: "Internal server error on updating task" 
    })
  }
}

taskController.updateDates = async (req, res) => 
{
  const session = await mongoose.startSession();
  session.startTransaction();

  try
  {
    const { taskID, startDate, dueDate } = req.body;
  
    await Task.updateOne
    (
      { id: taskID },
      { $set: { start_date: startDate, due_date: dueDate } }
    )
  
    await session.commitTransaction();
    await session.endSession();

    res.status(200).send({ newAccessToken: req.newAccessToken })
    console.log(`${new Date()}: successfully updated task dates`);
  }

  catch (error)
  {
    await session.abortTransaction();
    await session.endSession();

    console.log(error)
    res.status(500).send(
    { 
      header: "Failed to update task",
      message: "Internal server error on updating task" 
    })
  }
}

taskController.updateStatus = async (req, res) => 
{
  const session = await mongoose.startSession();
  session.startTransaction();

  try
  {
    const { taskID, completed } = req.body;
  
    await Task.updateOne
    (
      { id: taskID },
      { $set: { completed: completed } }
    )
  
    await session.commitTransaction();
    await session.endSession();

    res.status(200).send({ newAccessToken: req.newAccessToken })
    console.log(`${new Date()}: successfully updated task completed status`);
  }

  catch (error)
  {
    await session.abortTransaction();
    await session.endSession();

    console.log(error)
    res.status(500).send(
    { 
      header: "Failed to update task",
      message: "Internal server error on updating task" 
    })
  }
}

taskController.delete = async (req, res) =>
{
  const session = await mongoose.startSession();
  session.startTransaction();

  try
  {

    const { projectID, taskID, type, position } = req.params;
    const project = await Project.findOne({ id: projectID }).lean().select('tasks -_id');
    project.tasks.splice(project.tasks.findIndex(task => task === taskID), 1);
    
    const taskList = await Task.find({ id: { $in: project.tasks } });
    const bulkOps = [];

    taskList.forEach(task =>
    {
      if (task.type === type && task.position > position) 
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

      else if (task.id === taskID)
        bulkOps.push({ deleteOne: { filter: { id: task.id } } })
    })

    if (bulkOps.length > 0)
      await Task.bulkWrite(bulkOps);

    await Project.updateOne
    (
      { id: projectID }, 
      { 
        $pull: { tasks: taskID }, 
        $set: { updated_at: Date.now() } 
      }
    );

    await session.commitTransaction();
    await session.endSession();

    res.status(200).send({ newAccessToken: req.newAccessToken });
    console.log(`${new Date()}: successfully deleted task |${taskID}|`);
  }

  catch (error)
  {
    await session.abortTransaction();
    await session.endSession();

    console.log(error)
    res.status(500).send(
    { 
      header: "Failed to delete task",
      message: "Internal server error on deleting task" 
    })
  }
}

export default taskController;