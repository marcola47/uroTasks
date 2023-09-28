import { useContext } from 'react';
import { ProjectsContext, ReducerContext } from 'app';
import axios, { setResponseError, setResponseConfirmation } from 'utils/axiosConfig'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

export default function OptionDeleteList({ type })
{
  const { projects, setProjects, activeProject } = useContext(ProjectsContext);
  const { dispatch } = useContext(ReducerContext);

  function deleteList()
  {
    const taskList = structuredClone(activeProject.tasks)
      .filter(listTask => { return listTask.project !== activeProject.id || listTask.type !== type.id });
    
    const typeList = structuredClone(activeProject.types)
      .filter(listType => listType.id !== type.id)
      .map(listType => ({ ...listType, position: listType.position > type.position ? listType.position - 1 : listType.position }));

    const projectsOld = structuredClone(projects);
    const projectsCopy = structuredClone(projects).map(project => 
    {
      if (project.id === activeProject.id)
      {
        project.tasks = taskList;
        project.types = typeList;
        project.updated_at = Date.now();
      }

      return project;
    });

    setProjects(projectsCopy);
    axios.delete(`/a/list/delete/list/${activeProject.id}/${type.id}`)
    .then(() => setResponseConfirmation("Successfully deleted list", "", dispatch))
    .catch(err =>
    {
      setResponseError(err, dispatch);
      setProjects(projectsOld);
    })

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
    dispatch({ type: 'setTaskListOptions', payload: { params: null, data: null } })
  }
  
  return (
    <div 
      className="option option--danger" 
      onClick={ showConfirmation }
    >
      <FontAwesomeIcon icon={ faTrash }/>
      <span>Delete list</span>
    </div>
  )
}