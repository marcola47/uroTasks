import { useContext } from 'react';
import { ProjectsContext, ReducerContext } from 'app';
import { OptionsContext } from '../card';
import axios, { setResponseError, setResponseConfirmation } from 'utils/axiosConfig'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

export default function OptionDeleteTasks({ type })
{
  const { projects, setProjects, activeProject, setActiveProject } = useContext(ProjectsContext);
  const { dispatch } = useContext(ReducerContext);
  const { setOptionsShown } = useContext(OptionsContext);

  function deleteTasks()
  {
    const taskList = structuredClone(activeProject.tasks).filter(listTask => { return listTask.project !== activeProject.id || listTask.type !== type.id });

    const projectsCopy = structuredClone(projects).map(project => 
    {
      if (project.id === activeProject.id)
        project.tasks = taskList;

      return project;
    });

    axios.post('/a/project/update?type=types&crud=deleteTasks', 
    {
      projectID: activeProject.id,
      typeID: type.id
    })
    .then(() => 
    {
      setResponseConfirmation("Successfully deleted tasks", "", dispatch);
      setProjects(projectsCopy);
      setActiveProject(prevActiveProject => ({ ...prevActiveProject, tasks: taskList }))
    })
    .catch(err => setResponseError(err, dispatch))

    dispatch({ type: 'confirmationShown', payload: false })
    setOptionsShown(false);
  }

  function showConfirmation()
  {
    dispatch(
    { 
      type: 'setConfirmation',
      payload: 
      {
        header: "Are you sure you want to delete all task from this list?",
        message: "This action is not reversible and all tasks will be lost forever.",
        className: 'btn--confirmation--danger',
        confirmation: "Yes, I want to delete all tasks",
        rejection: "No, I'm keeping these tasks",
        function: deleteTasks
      } 
    })

    dispatch({ type: 'confirmationShown', payload: true })
  }

  return (
    <div className="option option--danger" onClick={ showConfirmation }>
      <FontAwesomeIcon icon={ faTrash }/>
      <span>Delete all tasks</span>
    </div>
  )
}