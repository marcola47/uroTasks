import { useState, useContext, useEffect } from 'react';
import { ProjectsContext, UserContext, ReducerContext } from 'app';
import axios, { setResponseError } from 'utils/axiosConfig'

import formatDate from 'utils/formatDate';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock, faSquareCheck as faSquareCheckSolid } from '@fortawesome/free-solid-svg-icons';
import { faSquareCheck as faSquareCheckRegular } from '@fortawesome/free-regular-svg-icons';

export default function TaskDueDate({ task })
{
  const { projects, setProjects, activeProject } = useContext(ProjectsContext);
  const { user } = useContext(UserContext);
  const { dispatch } = useContext(ReducerContext);

  const [isHovered, setIsHovered] = useState(false);
  
  const dueDate = new Date(task.due_date);
  const dueDateYear = dueDate.getFullYear();
  let formattedDate = formatDate(task.due_date, user.settings.date_format)

  if (dueDateYear === new Date().getFullYear())
  {
    if (user.settings.date_format === 'd/m/y' || user.settings.date_format === 'm/d/y')
      formattedDate = formattedDate.substring(0, 5);

    else if (user.settings.date_format === 'y/m/d')
      formattedDate = formatDate.substring(5)
  }
  
  const curTimeStamp = new Date().setUTCHours(0, 0, 0, 0);
  const dueTImeStamp = dueDate.getTime();
  const dateDiff = (dueTImeStamp - curTimeStamp) / 1000 / 60 / 60 / 24;
  
  let className = '';

  switch (true) 
  {
    case task.completed === true: 
      className = 'completed'; break;
    
    case dateDiff < 0: 
      className = 'overdue'; break;
    
    case dateDiff === 0: 
      className = 'today'; break;
    
    case dateDiff === 1: 
      className = 'tomorrow'; break;
  
    default: className = 'far';
  }

  function toggleCompleteTask()
  {
    const taskList = structuredClone(activeProject.tasks).map(listTask => 
    {
      if (listTask.id === task.id)
      {
        task.completed = !listTask.completed
        listTask.completed = !listTask.completed;
      }

      return listTask;
    });

    const projectsOld = structuredClone(projects);
    const projectsCopy = structuredClone(projects).map(project => 
    {
      if (project.id === activeProject.id)
        project.taskList = taskList
        
      return project;
    });

    setProjects(projectsCopy)
    axios.post('/a/task/update?type=completed',
    {
      taskID: task.id,
      completed: task.completed
    })
    .catch(err => 
    {
      setProjects(projectsOld);
      setResponseError(err, dispatch)
    })
  }
  
  const icon = task.completed 
    ? faSquareCheckSolid
    : isHovered 
      ? faSquareCheckRegular 
      : faClock

  return (
    <div 
      className={`task__due-date task__due-date--${className}`} 
      onClick={ toggleCompleteTask }
      onMouseEnter={ () => {setIsHovered(true)} }
      onMouseLeave={ () => {setIsHovered(false)} }
    >
      <FontAwesomeIcon icon={ icon }/>
      <span>{ formattedDate }</span>
    </div>
  )
}