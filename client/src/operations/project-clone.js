import axios, { setResponseConfirmation, setResponseError } from 'utils/axiosConfig';
import { v4 as uuid } from 'uuid';

export default function showConfirmation(projectsContext, userContext, reducerContext)
{
  const { projects, setProjects, activeProject } = projectsContext;
  const { user, setUser } = userContext;
  const { state, dispatch } = reducerContext;

  function cloneProject()
  {
    dispatch({ type: 'confirmationShown', payload: false })

    if (state.projOptions)
      dispatch({ type: 'setProjOptions', payload: null })

    const taskList = structuredClone(activeProject.tasks);
    const newProject = structuredClone(activeProject);

    newProject.tasks = taskList.map(task => { return { ...task, id: uuid(), created_at: Date.now(), updated_at: Date.now() } });
    newProject.created_at = Date.now();
    newProject.updated_at = Date.now();
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