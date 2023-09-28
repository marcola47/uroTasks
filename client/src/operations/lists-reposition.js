export default function repositionLists(projectsContext, opContext) 
{
  const { projects, setProjects, activeProject } = projectsContext;
  const { dispatch, result, axios, setResponseError } = opContext;

  const typeList = structuredClone(activeProject.types);
  const type = typeList.find(listType => listType.id === result.draggableId);
  const positions = { old: result.source.index, new: result.destination.index };

  typeList.forEach(listType => 
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
      project.types = typeList;
      project.updated_at = Date.now();
    }

    return project;
  })

  setProjects(projectsCopy);
  axios.patch('/a/list/update/position', 
  {
    typeID: type.id,
    params: 
    {
      sourceID: activeProject.id,
      sourcePosition: result.source.index,
      destinationID: activeProject.id,
      destinationPosition: result.destination.index,
    }
  })
  .catch(err => 
  {
    setResponseError(err, dispatch);
    setProjects(projectsOld);
  });
}
