import { useContext } from 'react';
import { ProjectsContext } from '../../../../app';
import { ScrollContext } from '../../../../pages/home';
import { ToggleEditorContext } from '../editor';
import axios from 'axios';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUp, faArrowDown } from '@fortawesome/free-solid-svg-icons';

export default function OptionChangeType({ task })
{
  const { projects, setProjects, activeProject, setActiveProject } = useContext(ProjectsContext);
  const { setScrollTo } = useContext(ScrollContext);
  const toggleEditor = useContext(ToggleEditorContext);
 
  function updateTaskPosition(direction)
  { 
    const scrollOffset = document.getElementById(task.type).offsetLeft;
    setScrollTo(scrollOffset);

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

    const projectsCopy = projects.map(project => 
    {
      if (project.id === activeProject.id)
        project.tasks = taskList;

      return project;
    })

    toggleEditor();

    axios.post(`${process.env.REACT_APP_SERVER_ROUTE}/task-update?type=position`, [updatedTask.id, otherTask.id, direction])
      .then(res => 
      {
        console.log(res);
        setActiveProject({ ...activeProject, tasks: taskList });
        setProjects(projectsCopy);
      })
      .catch( err => {console.log(err)} );
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