import { useState, useContext } from 'react';
import { ProjectsContext, ReducerContext } from 'app';
import { ToggleEditorContext } from '../editor';
import axios, { setResponseError } from 'utils/axiosConfig';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowsLeftRight, faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons';

export default function OptionType({ task })
{
  const [changeTypeOpen, setChangeTypeOpen] = useState(false)

  const { projects, setProjects, activeProject, setActiveProject } = useContext(ProjectsContext);
  const { toggleEditor } = useContext(ToggleEditorContext);
  const { dispatch } = useContext(ReducerContext);
  
  let taskTypeLeft, taskTypeRight, changeTypeIcon;
  switch (task?.type)
  {
    case 'todo' : taskTypeLeft = "doing"; taskTypeRight = "done" ; changeTypeIcon = faArrowRight;      break;
    case 'doing': taskTypeLeft = "todo" ; taskTypeRight = "done" ; changeTypeIcon = faArrowsLeftRight; break;
    case 'done' : taskTypeLeft = "todo" ; taskTypeRight = "doing"; changeTypeIcon = faArrowLeft;       break;
    default: break;
  }
 
  function formatTaskType(taskTypeName)
  {
    if (taskTypeName === undefined)
      return;

    if (taskTypeName === 'todo')
      taskTypeName = taskTypeName.slice(0, 2) + '-' + taskTypeName.slice(2)

    return taskTypeName.toUpperCase();
  }

  function updateTaskType(newType)
  { 
    const taskList = activeProject.tasks;
    const taskToMove = taskList.find(taskItem => taskItem.id === task.id);
    
    const tasksFiltered = taskList.filter(taskObj => taskObj.type === newType);
    let lastTaskPos = Math.max(...tasksFiltered.map(taskObj => taskObj.position));

    if (lastTaskPos === -Infinity)
      lastTaskPos = 0;

    const types = { old: task.type, new: newType };
    const positions = { old: taskToMove.position, new: lastTaskPos + 1 };
    
    taskList.map(taskObj => 
    {
      if (taskObj.id === taskToMove.id)
      {
        taskObj.type = types.new;
        taskObj.position = positions.new;
      }

      else if (taskObj.type === task.type && taskObj.position > positions.old)
        taskObj.position = taskObj.position - 1;
        
      return taskObj;
    })

    const projectsCopy = [...projects].map(project => 
    {
      if (project.id === activeProject.id)
      {
        if (types.new === 'done')
          project.activeTasks = project.activeTasks - 1;

        else if (types.old === 'done')
          project.activeTasks = project.activeTasks + 1;

        project.tasks = taskList;
      }

      return project;
    })

    toggleEditor();

    axios.post(`/task/update?type=type`, 
    {
      projectID: activeProject.id, 
      taskID: task.id, 
      types: types, 
      positions: positions,
      accessToken: localStorage.getItem("accessToken"),
      refreshToken: localStorage.getItem("refreshToken")
    })
    .then(_ => 
    { 
      setActiveProject(prevActiveProject => ({ ...prevActiveProject, tasks: taskList }));
      setProjects(projectsCopy);
    })
    .catch(err => setResponseError(err, dispatch))
  }

  return (
    <>
      <div className='option option--type'>
        <div className='option__icon' onClick={ () => {setChangeTypeOpen(!changeTypeOpen)} }><FontAwesomeIcon icon={ changeTypeIcon }/></div>
      </div>

      <div className={ `options__select ${changeTypeOpen ? 'options__select--shown' : ''}` }>
        <div className='options__location' onClick={ () => {updateTaskType(taskTypeLeft)} }>{ formatTaskType(taskTypeLeft) }</div>
        <div className='options__location' onClick={ () => {updateTaskType(taskTypeRight)} }>{ formatTaskType(taskTypeRight) }</div>
      </div>
    </>
  )
}