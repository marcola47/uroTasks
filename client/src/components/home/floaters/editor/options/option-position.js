import { useContext } from 'react';
import { ProjectsContext, ReducerContext } from 'app';
import axios, { setResponseError } from 'utils/axiosConfig';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUp, faArrowDown } from '@fortawesome/free-solid-svg-icons';

export default function OptionPosition({ task })
{
  const { projects, setProjects, activeProject, setActiveProject } = useContext(ProjectsContext);
  const { dispatch } = useContext(ReducerContext);
 
  function updateTaskPosition(direction)
  { 
    const tasksFiltered = structuredClone(activeProject.tasks).filter(taskObj => taskObj.type === task.type);
    const lastTaskPos = Math.max(...tasksFiltered.map(taskObj => taskObj.position));
    const updatedTask = tasksFiltered.find(taskObj => taskObj.id === task.id);
  
    if (direction === 'up' && updatedTask.position === 1)
      return

    if (direction === 'down' && updatedTask.position === lastTaskPos) 
      return 

    const offset = direction === 'up' ? -1 : 1; 
    const otherOffset = offset * -1;

    const otherTask = tasksFiltered.find(taskObj => taskObj.position === updatedTask.position + offset);
    
    const taskList = structuredClone(activeProject.tasks).map(taskObj => 
    {
      if (taskObj.id === updatedTask.id)
        taskObj.position = taskObj.position + offset;

      else if (taskObj.id === otherTask.id)
        taskObj.position = taskObj.position + otherOffset;
      
      return taskObj;
    })

    const projectsOld = structuredClone(projects);
    const projectsCopy = structuredClone(projects).map(project => 
    {
      if (project.id === activeProject.id)
      {
        project.tasks = taskList;
        project.updated_at = Date.now();
      }
    
      return project;
    });

    dispatch(
    { 
      type: 'setEditor', 
      payload: { params: null, dat: null } 
    })

    setProjects(projectsCopy);
    axios.post('/a/task/update?type=position', 
    {
      updatedTaskID: updatedTask.id, 
      otherTaskID: otherTask.id, 
      direction: direction
    })
    .catch(err => 
    {
      setResponseError(err, dispatch);
      setProjects(projectsOld);
    });
  }

  return (
    <>
      <div className='option option--position option--position--up' onClick={ () => {updateTaskPosition('up')} }>
        <div className='option__icon'><FontAwesomeIcon icon={ faArrowUp }/></div>
      </div>

      <div className='option option--position option--position--down' onClick={ () => {updateTaskPosition('down')} }>
        <div className='option__icon'><FontAwesomeIcon icon={ faArrowDown }/></div>
      </div>
    </>
  )
}