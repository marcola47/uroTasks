export default function repositionLists(projectsContext, opContext) 
{
  const { projects, setProjects, activeProject } = projectsContext;
  const { dispatch, result, axios, setResponseError } = opContext;

  const typesList = structuredClone(activeProject.types);
  const type = typesList.find(listType => listType.id === result.draggableId);
  const positions = { old: result.source.index, new: result.destination.index };

  typesList.forEach(listType => 
  {
    const isBetween =
      listType.position >= Math.min(positions.old, positions.new) && 
      listType.position <= Math.max(positions.old, positions.new)

    if (listType.id === type.id) 
      listType.position = positions.new;
    
    else if (listType.id !== type.id && isBetween)
      listType.position += positions.new > positions.old ? -1 : 1;
  });

  const projectsOld = structuredClone(projects);
  const projectsCopy = structuredClone(projects).map(project => 
  {
    if (project.id === activeProject.id)
    {
      project.types = typesList;
      project.updated_at = Date.now();
    }

    return project;
  })

  setProjects(projectsCopy);
  axios.post('/a/list/update/position', 
  {
    curProjectID: activeProject.id,
    newProjectID: activeProject.id,
    typeID: type.id,
    positions: positions,
  })
  .catch(err => 
  {
    setResponseError(err, dispatch);
    setProjects(projectsOld);
  });
}
