import { useContext } from 'react';
import { ProjectsContext, ReducerContext } from 'app';
import axios, { setResponseError, setResponseConfirmation } from 'utils/axiosConfig'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

export default function OptionDeleteList({ type })
{
  const { projects, setProjects, activeProject, setActiveProject } = useContext(ProjectsContext);
  const { dispatch } = useContext(ReducerContext);

  function deleteList()
  {
    const taskList = activeProject.tasks.filter(listTask => { return listTask.project !== activeProject.id || listTask.type !== type.id });
    const typesList = activeProject.types.filter(listType => { return listType.id !== type.id });

    const projectsCopy = [...projects].map(project => 
    {
      if (project.id === activeProject.id)
      {
        project.tasks = taskList;
        project.types = typesList;
      }

      return project;
    });

    axios.post('/a/project/update?type=types&crud=delete', 
    {
      projectID: activeProject.id,
      typeID: type.id,
      accessToken: localStorage.getItem("accessToken"),
      refreshToken: localStorage.getItem("refreshToken")
    })
    .then(_ => 
    {
      setResponseConfirmation("Successfully deleted list", "", dispatch);
      setProjects(projectsCopy);
      setActiveProject((prevActiveProject) => ({ ...prevActiveProject, tasks: taskList, types: typesList }))
    })
    .catch(err => setResponseError(err, dispatch))

    dispatch({ type: 'confirmationShown', payload: false })
  }

  function showConfirmation()
  {
    dispatch(
    { 
      type: 'setConfirmation',
      payload: 
      {
        header: "Are you sure you want to delete this task list?",
        message: "This action is not reversible and all tasks inside this list will be lost forever.",
        className: 'btn--confirmation--danger',
        confirmation: "Yes, I want to delete this list",
        rejection: "No, I'm keeping this list",
        function: deleteList
      } 
    })

    dispatch({ type: 'confirmationShown', payload: true })
  }
  
  return (
    <div className="option option--danger" onClick={ showConfirmation }>
      <FontAwesomeIcon icon={ faTrash }/>
      <span>Delete list</span>
    </div>
  )
}