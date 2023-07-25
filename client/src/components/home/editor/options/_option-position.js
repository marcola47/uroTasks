import { useContext } from 'react';
import { ProjectsContext, ReducerContext } from 'app';
import { ToggleEditorContext } from '../editor';
import axios, { setResponseError } from 'utils/axiosConfig';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUp, faArrowDown } from '@fortawesome/free-solid-svg-icons';

export default function OptionPosition({ task })
{
  const { projects, setProjects, activeProject, setActiveProject } = useContext(ProjectsContext);
  const { toggleEditor } = useContext(ToggleEditorContext);
  const { dispatch } = useContext(ReducerContext);
 
  function updateTaskPosition(direction)
  { 
    const tasksFiltered = activeProject.tasks.filter(taskObj => taskObj.type === task.type);
    const lastTaskPos = Math.max(...tasksFiltered.map(taskObj => taskObj.position));
    const updatedTask = tasksFiltered.find(taskObj => taskObj.id === task.id);
  
    if (direction === 'up' && updatedTask.position === 1)
      return

    if (direction === 'down' && updatedTask.position === lastTaskPos) 
      return 

    const offset = direction === 'up' ? -1 : 1; 
    const otherOffset = offset * -1;

    const otherTask = tasksFiltered.find(taskObj => taskObj.position === updatedTask.position + offset);
    
    const taskList = activeProject.tasks.map(taskObj => 
    {
      if (taskObj.id === updatedTask.id)
        taskObj.position = taskObj.position + offset;

      else if (taskObj.id === otherTask.id)
        taskObj.position = taskObj.position + otherOffset;
      
      return taskObj;
    })

    const projectsCopy = [...projects].map(project => 
    {
      if (project.id === activeProject.id)
        project.tasks = taskList;
    
      return project;
    });

    toggleEditor();

    axios.post('/a/task/update?type=position', 
    {
      updatedTaskID: updatedTask.id, 
      otherTaskID: otherTask.id, 
      direction: direction,
      accessToken: localStorage.getItem("accessToken"),
      refreshToken: localStorage.getItem("refreshToken")
    })
    .then(_ => 
    {
      setActiveProject(prevActiveProject => ({ ...prevActiveProject, tasks: taskList }));
      setProjects(projectsCopy);
    })
    .catch(err => setResponseError(err, dispatch));
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