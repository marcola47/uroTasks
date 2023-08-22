export default function repositionProjects(userContext, opContext) 
{
  const { user, setUser } = userContext;
  const { dispatch, result, axios, setResponseError } = opContext;

  const projectList = structuredClone(user.projects);
  const project = projectList.find(listProject => listProject.id === result.draggableId);
  const positions = { old: result.source.index, new: result.destination.index };

  projectList.forEach(listProject => 
  {
    const isBetween =
      listProject.position >= Math.min(positions.old, positions.new) && 
      listProject.position <= Math.max(positions.old, positions.new)

    if (listProject.id === project.id) 
      listProject.position = positions.new;
    
    else if (listProject.id !== project.id && isBetween)
      listProject.position += positions.new > positions.old ? -1 : 1;
  });

  const userProjectsOld = structuredClone(user.projects);
  const userProjectsCopy = structuredClone(user.projects)
  userProjectsCopy.projects = projectList;

  setUser(userProjectsCopy);
  axios.post('/a/project/update/position', 
  {
    userID: user.id,
    params: 
    {
      sourcePosition: result.source.index,
      destinationPosition: result.destination.index,
    }
  })
  .catch(err => 
  {
    setResponseError(err, dispatch);
    setUser(userProjectsOld);
  });
}
