import axios, { setResponseConfirmation, setResponseError } from 'utils/axiosConfig';
import { v4 as uuid } from 'uuid';

export default function showConfirmation(projectsContext, userContext, reducerContext)
{
  const { projects, setProjects, activeProject, setActiveProject } = projectsContext;
  const { user, setUser } = userContext;
  const { state, dispatch } = reducerContext;

  function cloneProject()
  {
    dispatch({ type: 'confirmationShown', payload: false })

    if (state.projOptions)
      dispatch({ type: 'setProjOptions', payload: null })

    const taskList = JSON.parse(JSON.stringify(activeProject.tasks));
    const newProject = JSON.parse(JSON.stringify(activeProject));

    newProject.tasks = taskList.map(task => { return { ...task, id: uuid() } });
    newProject.name = newProject.name + ' copy';
    newProject.id = uuid();
    
    axios.post(`/a/project/clone`, 
    {
      userID: user.id, 
      newProject: { ...newProject, tasks: newProject.tasks.map(task => task.id) },
      tasks: newProject.tasks
    })
    .then(() => 
    {
      console.log(activeProject)
      console.log(newProject)
      setProjects(prevProjects => ([...prevProjects, newProject]));
      setUser(prevUser => ({ ...prevUser, activeProject: newProject.id, projects: [...projects, newProject.id] }))
      setResponseConfirmation("Successfully cloned project", "", dispatch)
    })
    .catch(err => setResponseError(err, dispatch))
  }

  dispatch(
  { 
    type: 'setConfirmation',
    payload: 
    {
      header: "Are you sure you want to clone this project?",
      message: "",
      className: 'btn--confirmation--positive',
      confirmation: "Yes, I want to clone this project",
      rejection: "No, I'm not going to clone this project",
      function: cloneProject
    } 
  })

  dispatch({ type: 'confirmationShown', payload: true })
}