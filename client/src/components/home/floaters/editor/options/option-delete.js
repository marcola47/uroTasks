import { useContext } from 'react';
import { ProjectsContext, ReducerContext } from 'app';
import axios, { setResponseError } from 'utils/axiosConfig';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMultiply } from '@fortawesome/free-solid-svg-icons';

export default function OptionDelete({ task })
{
  const { projects, setProjects, activeProject, setActiveProject } = useContext(ProjectsContext);
  const { dispatch } = useContext(ReducerContext);

  function deleteTask()
  {
    const taskList = structuredClone(activeProject.tasks);    
    const taskToDelete = taskList.find(listTask => listTask.id === task.id);
    const filteredTasks = taskList.filter(listTask => listTask.id !== taskToDelete.id);
    filteredTasks.forEach(listTask => 
    { 
      if (listTask.type === taskToDelete.type && listTask.position > taskToDelete.position) 
        listTask.position--;
    })
    
    const projectsCopy = structuredClone(projects).map(project => 
    {
      if (project.id === activeProject.id)
        project.tasks = taskList;

      return project;
    })

    dispatch(
    {
      type: 'setEditor',
      payload: { params: null, dat: null }
    })

    axios.post('/a/task/delete', 
    { 
      projectID: activeProject.id, 
      taskID: task.id, 
      taskType: task.type, 
      position: taskToDelete.position
    })
    .then(() => 
    {
      setActiveProject(prevActiveProject => ({ ...prevActiveProject, tasks: filteredTasks }));
      setProjects(projectsCopy);
    })
    .catch(err => setResponseError(err, dispatch))
  }

  return (
    <div className='option option--remove' onClick={ deleteTask }>
      <div className='option__icon'><FontAwesomeIcon icon={ faMultiply }/></div>
    </div>
  )
}