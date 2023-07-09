import Project from '../models/Project.js';
import Task from '../models/Task.js';
const taskController = {};

/*********************************************************************************************************************************/
taskController.create = async (projectID, taskData) => 
{
  const newTask = new Task(taskData);
  await newTask.save();

  if (taskData.type === 'done')
    await Project.updateOne({ id: projectID }, { $push: { tasks: newTask.id } });

  else
    await Project.updateOne({ id: projectID }, { $push: { tasks: newTask.id }, $inc: { activeTasks: 1 } });

  console.log(`${new Date()}: successfully inserted task to project |${projectID}|`)
}


/*********************************************************************************************************************************/
taskController.updateContent = async (req, res) => 
{
  try 
  {
    const data = req.body;

    await Task.updateOne({ id: data.taskID }, { content: data.newContent, updated_at: new Date() });
    
    console.log(`${new Date()}: successfully updated task |${data.taskID}|`);
    res.sendStatus(200);
  }

  catch (error)
  {
    console.log(error);
    res.status(500).send({ auth: true, message: "Internal server error on updating task content" })
  }
}

/*********************************************************************************************************************************/
taskController.updateType = async (req, res) => 
{
  try
  {
    const data = req.body;
    const project = await Project.findOne({ id: data.projectID }).lean().select('tasks -_id');
    const taskList = await Task.find({ id: { $in: project.tasks } });
  
    if (data.types.old === 'done')
      await Project.updateOne({ id: data.projectID }, { $inc: { activeTasks: 1 } });
    
    else if (data.types.new === 'done')
      await Project.updateOne({ id: data.projectID }, { $inc: { activeTasks: -1 } });
  
    await Promise.all(taskList.map(async task => 
    {
      if (task.type === data.types.old && task.position > data.positions.old) 
        await Task.updateOne({ id: task.id }, { $inc: { position: -1 } });
  
      else if (task.id === data.taskID) 
        await Task.updateOne({ id: data.taskID }, { type: data.types.new, position: data.positions.new, updated_at: new Date() });
    }));
    
    console.log(`${new Date()}: successfully moved task to |${data.types.new}|`);
    res.sendStatus(200);
  }

  catch (error)
  {
    console.log(error);
    res.status(500).send({ auth: true, message: "Internal server error on updating task type" })
  }
}

/*********************************************************************************************************************************/
taskController.updatePosition = async (req, res) =>
{
  try
  {
    const data = req.body;

    switch (data.direction)
    {
      case 'up':
        await Task.updateOne({ id: data.updatedTaskID }, { $inc: { position: -1 } });
        await Task.updateOne({ id: data.otherTaskID }, { $inc: { position: +1 } });
        break;
  
      case 'down':
        await Task.updateOne({ id: data.updatedTaskID }, { $inc: { position: +1 } });
        await Task.updateOne({ id: data.otherTaskID }, { $inc: { position: -1 } });
        break;
    }
  
    console.log(`${new Date()}: successfully updated task position`);
    res.sendStatus(200);
  }

  catch (error)
  {
    console.log(error);
    res.status(500).send({ auth: true, message: "Internal server error on updating task position" })
  }
}

/*********************************************************************************************************************************/
taskController.update = async (req, res) => 
{
  try 
  {
    const type = req.query.type;

    if (type === 'content')
      await taskController.updateContent(req, res);

    else if (type === 'type')
      await taskController.updateType(req, res);

    else if (type === 'position')
      await taskController.updatePosition(req, res);
  }
  catch (error)
  {
    console.log(error)
    res.status(500).send({ auth: true, message: "Internal server error on updating task" })
  }
}

/*********************************************************************************************************************************/
taskController.delete = async (req, res) =>
{
  try
  {
    const data = req.body;
    const project = await Project.findOne({ id: data.projectID }).lean().select('tasks -_id');
    project.tasks.splice(project.tasks.findIndex(task => task === data.taskID), 1);
    
    const taskList = await Task.find({ id: { $in: project.tasks } });
  
    if (data.taskType === 'done')
      await Project.updateOne({ id: data.projectID }, { $pull: { tasks: data.taskID } });
    
    else
      await Project.updateOne({ id: data.projectID }, { $pull: { tasks: data.taskID }, $inc: { activeTasks: -1 } });
  
    await Promise.all(taskList.map(async task => 
    {
      if (task.type === data.taskType && task.position > data.position) 
        await Task.updateOne({ id: task.id }, { $inc: { position: -1 } });
        
      else if (task.id === data.taskID)
        await Task.deleteOne({ id: data.taskID });
    }));

    res.sendStatus(200);
    console.log(`${new Date()}: successfully deleted task |${data.taskID}|`);
  }

  catch (error)
  {
    console.log(error)
    res.status(500).send({ auth: true, message: "Internal server error on deleting task" })
  }
}

export default taskController;