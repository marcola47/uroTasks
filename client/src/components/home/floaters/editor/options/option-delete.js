import { useContext } from 'react';
import { ProjectsContext, ReducerContext } from 'app';
import axios, { setResponseError } from 'utils/axiosConfig';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMultiply } from '@fortawesome/free-solid-svg-icons';

export default function OptionDelete({ task })
{
  const { projects, setProjects, activeProject } = useContext(ProjectsContext);
  const { dispatch } = useContext(ReducerContext);

  function deleteTask()
  {
    const taskList = structuredClone(activeProject.tasks);    
    const filteredTasks = taskList.filter(listTask => listTask.id !== task.id);
    filteredTasks.forEach(listTask => 
    { 
      if (listTask.type === task.type && listTask.position > task.position) 
        listTask.position--;
    })
    
    const projectsOld = structuredClone(projects);
    const projectsCopy = structuredClone(projects).map(project => 
    {
      if (project.id === activeProject.id)
      {
        project.tasks = filteredTasks;
        project.updated_at = Date.now();
      }

      return project;
    })

    dispatch(
    {
      type: 'setEditor',
      payload: { params: null, data: null }
    })

    setProjects(projectsCopy);
    axios.post('/a/task/delete', 
    { 
      projectID: activeProject.id, 
      taskID: task.id, 
      taskType: task.type, 
      position: task.position
    })
    .catch(err =>
    {
      setResponseError(err, dispatch);
      setProjects(projectsOld);
    })
  }

  return (
    <div className='option option--remove' onClick={ deleteTask }>
      <div className='option__icon'><FontAwesomeIcon icon={ faMultiply }/></div>
    </div>
  )
}