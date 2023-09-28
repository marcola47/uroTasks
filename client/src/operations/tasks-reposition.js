export default function repositionTasks(projectsContext, opContext) 
{
  const { projects, setProjects, activeProject } = projectsContext;
  const { dispatch, result, axios, setResponseError } = opContext;

  const task = activeProject.tasks.find(listTask => listTask.id === result.draggableId);
  const taskList = structuredClone(activeProject.tasks);
  const positions = { old: result.source.index, new: result.destination.index };

  taskList.forEach(listTask => 
  {
    if (listTask.id === task.id) 
    {
      listTask.position = positions.new;
      listTask.type = result.destination.droppableId;
    } 
    
    else 
    {
      if (result.source.droppableId === result.destination.droppableId) 
      {
        const isBetween = 
          listTask.position >= Math.min(positions.old, positions.new) && 
          listTask.position <= Math.max(positions.old, positions.new)

        if (listTask.type === result.destination.droppableId && isBetween) 
          listTask.position += positions.new > positions.old ? -1 : 1;
      } 
      
      else 
      {
        if (listTask.type === result.source.droppableId && listTask.position > positions.old) 
          listTask.position--;
        
        else if (listTask.type === result.destination.droppableId && listTask.position >= positions.new)
          listTask.position++;
      }
    }
  });

  const projectsOld = structuredClone(projects);
  const projectsCopy = structuredClone(projects).map(project => 
  {
    if (project.id === activeProject.id)
    {
      project.tasks = taskList;
      project.updated_at = Date.now();
    }

    return project;
  })

  setProjects(projectsCopy);
  axios.patch('/a/task/update/position', 
  {
    projectID: activeProject.id,
    taskID: task.id,
    params: 
    {
      sourceID: result.source.droppableId,
      sourcePosition: result.source.index,
      destinationID: result.destination.droppableId,
      destinationPosition: result.destination.index,
    }
  })
  .catch(err => 
  {
    setResponseError(err, dispatch);
    setProjects(projectsOld);
  });
}