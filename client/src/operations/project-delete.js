import axios, { setResponseConfirmation, setResponseError } from 'utils/axiosConfig';

export default function showConfirmation(projectsContext, userContext, reducerContext)
{
  const { projects, setProjects, activeProject } = projectsContext;
  const { user, setUser } = userContext;
  const { state, dispatch } = reducerContext;

  function deleteProject()
  { 
    dispatch({ type: 'confirmationShown', payload: false })

    if (state.projOptions)
      dispatch({ type: 'setProjOptions', payload: null })

    const userProjectsOld = structuredClone(user.projects);
    const userProjectsCopy = structuredClone(user.projects).filter(project => 
    {
      if (project.id !== activeProject.id) 
      {
        if (project.position > activeProject.position) 
          project.position--;
        
        return true;
      }

      return false;
    });

    const projectsOld = structuredClone(projects);
    const projectsCopy = structuredClone(projects).filter(project => 
    {
      if (project.id !== activeProject.id) 
      {
        if (project.position > activeProject.position) 
          project.position--;

        return true;
      }

      return false;
    });

    setProjects(projectsCopy);
    setUser(prevUser => ({ ...prevUser, activeProject: "0", projects: userProjectsCopy }));
    axios.delete(`/a/project/delete/${user.id}/${activeProject.id}/${activeProject.position}`)
    .then(() => setResponseConfirmation("Succesfully deleted project", "", dispatch))
    .catch(err => 
    {
      setResponseError(err, dispatch);
      setProjects(projectsOld);
      setUser(prevUser => ({ ...prevUser, projects: userProjectsOld }));
    })
  }

  dispatch(
  { 
    type: 'setConfirmation',
    payload: 
    {
      header: "Are you sure you want to delete this project?",
      message: "This action is not reversible and all project data will be lost forever.",
      className: 'btn--confirmation--danger',
      confirmation: "Yes, I want to delete this project",
      rejection: "No, I'm keeping this project",
      function: deleteProject
    } 
  })

  dispatch({ type: 'confirmationShown', payload: true })
}