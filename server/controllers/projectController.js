import Project from '../models/Project.js';
import Task from '../models/Task.js';

const projectController = {};

/*********************************************************************************************************************************/
projectController.create = async projectData =>
{
  const project = new Project(projectData);
  await project.save();

  console.log(`${new Date()}: successfully created project: ${projectData.name}`);
}

/*********************************************************************************************************************************/
projectController.updateName = async (projectID, newName) => 
{
  await Project.updateOne({ id: projectID }, { name: newName });
  console.log(`${new Date()}: successfully updated project name to: ${newName}`);
};

/*********************************************************************************************************************************/
projectController.updateColor = async (projectID, newColor) => 
{
  await Project.updateOne({ id: projectID }, { color: newColor });
  console.log(`${new Date()}: successfully updated project color to: ${newColor}`);
};

/*********************************************************************************************************************************/
projectController.delete = async projectID =>
{
  const project = await Project.findOne({ id: projectID }).lean().select('tasks -_id');
  const taskIDs = project.tasks;
  
  await Task.deleteMany({ id: { $in: taskIDs } });
  await Project.deleteOne({ id: projectID });
  
  console.log(`${new Date()}: successfully deleted project: ${projectID}`);
}

export default projectController;