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

    axios.post(`/a/project/delete`, 
    { 
      userID: user.id, 
      projectID: activeProject.id
    })
    .then(() => 
    {
      setProjects(projects.filter(project => project.id !== activeProject.id));
      setUser(prevUser => ({ ...prevUser, activeProject: "0" }));
      setResponseConfirmation("Succesfully deleted project", "", dispatch)
    })
    .catch(err => setResponseError(err, dispatch))
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