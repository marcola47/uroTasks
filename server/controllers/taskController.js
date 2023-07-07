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
taskController.updateContent = async (taskID, newContent) => 
{
  await Task.updateOne({ id: taskID }, { content: newContent, updated_at: new Date() });
  console.log(`${new Date()}: successfully updated task |${taskID}|`);
}

/*********************************************************************************************************************************/
taskController.updateType = async (projectID, taskID, locations, positions) => 
{
  const project = await Project.findOne({ id: projectID }).lean().select('tasks -_id');
  const taskList = await Task.find({ id: { $in: project.tasks } });

  if (locations.old === 'done')
    await Project.updateOne({ id: projectID }, { $inc: { activeTasks: 1 } });
  
  else if (locations.new === 'done')
    await Project.updateOne({ id: projectID }, { $inc: { activeTasks: -1 } });

  await Promise.all(taskList.map(async task => 
  {
    if (task.type === locations.old && task.position > positions.old) 
      await Task.updateOne({ id: task.id }, { $inc: { position: -1 } });

    else if (task.id === taskID) 
      await Task.updateOne({ id: taskID }, { type: locations.new, position: positions.new, updated_at: new Date() });
  }));
  
  console.log(`${new Date()}: successfully moved task to |${locations.new}|`);
}

/*********************************************************************************************************************************/
taskController.updatePosition = async (updatedTaskID, otherTaskID, direction) =>
{
  switch (direction)
  {
    case 'up':
      await Task.updateOne({ id: updatedTaskID }, { $inc: { position: -1 } });
      await Task.updateOne({ id: otherTaskID }, { $inc: { position: +1 } });
      break;

    case 'down':
      await Task.updateOne({ id: updatedTaskID }, { $inc: { position: +1 } });
      await Task.updateOne({ id: otherTaskID }, { $inc: { position: -1 } });
      break;
  }

  console.log(`${new Date()}: successfully updated task position`);
}

/*********************************************************************************************************************************/
taskController.delete = async (projectID, taskID, taskType, position) =>
{
  const project = await Project.findOne({ id: projectID }).lean().select('tasks -_id');
  project.tasks.splice(project.tasks.findIndex(task => task === taskID), 1);
  
  const taskList = await Task.find({ id: { $in: project.tasks } });

  if (taskType === 'done')
    await Project.updateOne({ id: projectID }, { $pull: { tasks: taskID } });
  
  else
    await Project.updateOne({ id: projectID }, { $pull: { tasks: taskID }, $inc: { activeTasks: -1 } });

  await Promise.all(taskList.map(async task => 
  {
    if (task.type === taskType && task.position > position) 
      await Task.updateOne({ id: task.id }, { $inc: { position: -1 } });
      
    else if (task.id === taskID)
      await Task.deleteOne({ id: taskID });
  }));

  console.log(`${new Date()}: successfully deleted task |${taskID}|`);
}

export default taskController;