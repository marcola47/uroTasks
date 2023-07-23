import Project from '../models/Project.js';
import Task from '../models/Task.js';
import User from '../models/User.js';

const projectController = {};

/*********************************************************************************************************************************/
projectController.get = async (req, res) => 
{
  try
  {
    const data = req.body;
    const projectsMeta = await Project.find({ id: { $in: data.projectIDs } }).lean().select('-created_at -updated_at -_id -__v');
      
    await Promise.all (projectsMeta.map(async project => 
    {
      if (project.activeTasks === -1)
      {
        await Task.countDocuments({ id: { $in: project.tasks }, type: { $in: ['todo', 'doing'] } })
        .then(async count => 
        {
          await Project.updateOne({ id: project.id }, { activeTasks: count });
          project.activeTasks = count;
        })
        .catch(err => console.log(err))
      }
  
      delete project.tasks;
      return project;
    }));
  
    res.status(200).send(projectsMeta);
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

/*********************************************************************************************************************************/
projectController.create = async (req, res) =>
{
  try 
  {
    const data = req.body;
    const project = new Project(data.newProject);
    
    console.log(`${new Date()}: successfully created project: ${data.newProject.name}`);
    await project.save();
    res.sendStatus(201);
  }

  catch (error)
  {
    console.log(error);
    res.status(500).send(
    {
      header: "Failed to create project",
      message: "Internal server error on creating project" 
    })
  }
}

/*********************************************************************************************************************************/
projectController.updateName = async (req, res) => 
{
  const data = req.body;

  await Project.updateOne({ id: data.projectID }, { name: data.newName });
  console.log(`${new Date()}: successfully updated project name to: ${data.newName}`);
};

/*********************************************************************************************************************************/
projectController.updateColor = async (req, res) => 
{
  const data = req.body;
  
  await Project.updateOne({ id: data.projectID }, { color: data.newColor });
  console.log(`${new Date()}: successfully updated project color to: ${data.newColor}`);
};

/*********************************************************************************************************************************/
projectController.update = async (req, res) => 
{
  try 
  {
    const type = req.query.type;

    if (type === 'name')
      await projectController.updateName(req, res);
    
    else if (type === 'color')
      await projectController.updateColor(req, res);
  
    else 
      throw new Error('Invalid type');
  
    res.sendStatus(200);
  }

  catch (error)
  {
    console.log(error);
    res.status(500).send(
    {
      header: "Failed to update project",
      message: "Internal server error on updating project" 
    })
  }
}

/*********************************************************************************************************************************/
projectController.delete = async (req, res) =>
{
  try 
  {
    const data = req.body;
    const project = await Project.findOne({ id: data.projectID }).lean().select('tasks -_id');
    const taskIDs = project.tasks;
    
    const updatedUser = {};
    updatedUser.$pull = { projects: data.projectID };
    updatedUser.$set = { activeProject: '0' };

    await Task.deleteMany({ id: { $in: taskIDs } });
    await Project.deleteOne({ id: data.projectID });
    await User.updateOne({ id: data.userID }, updatedUser);

    console.log(`${new Date()}: successfully deleted project: ${data.projectID}`);
    res.sendStatus(200);
  }

  catch (error)
  {
    console.log(error);
    res.status(500).send(
    {
      header: "Failed to delete project",
      message: "Internal server error on deleting project" 
    })
  }
}

export default projectController;
