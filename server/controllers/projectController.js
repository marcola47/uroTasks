import Project from '../models/Project.js';
import Task from '../models/Task.js';

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
    res.status(500).send({ message: "Error on getting projects" })
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
    res.status(500).send({ message: "Error on creating project" })
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
    res.status(500).send({ message: "Error on updating project data" });
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
    
    console.log(`${new Date()}: successfully deleted project: ${data.projectID}`);
    await Task.deleteMany({ id: { $in: taskIDs } });
    await Project.deleteOne({ id: data.projectID });
    res.sendStatus(200);
  }

  catch (error)
  {
    console.log(error);
    res.status(500).send({ message: "Error on deleting project" });
  }
}

export default projectController;