import React, { useState, useContext, useRef } from "react";
import { ProjectsContext, ReducerContext } from "app";
import { v4 as uuid } from 'uuid';
import axios, { setResponseError } from 'utils/axiosConfig';

import Task from './task/task'
import List from 'components/utils/list/list';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

export const TaskTypeContext = React.createContext();

export default function TasksContainer({ taskType })
{
  const { projects, setProjects, activeProject, setActiveProject } = useContext(ProjectsContext); 
  const { dispatch } = useContext(ReducerContext);
  
  const [editing, setEditing] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const inputValueRef = useRef();

  let taskTypeName;
  switch(taskType)
  {
    case "todo" : taskTypeName = "TO-DO"; break;
    case "doing": taskTypeName = "DOING"; break;
    case "done" : taskTypeName = "DONE" ; break;
    default: break;
  }

  const tasksFiltered = Array.isArray(activeProject.tasks) 
    ? activeProject.tasks.filter(task => task.type === taskType)
    : [];

  function handleTextChange(content) 
  {     
    const tasksOld = activeProject.tasks ?? [];
    
    const newPosition = tasksFiltered.length > 0 
      ? Math.max(...tasksFiltered.map(taskObj => taskObj.position)) + 1 
      : 1;

    const newTask = 
    { 
      id: uuid(), 
      type: taskType,
      position: newPosition,
      content: content, 
      project: activeProject.id,
      created_at: new Date(), 
      updated_at: new Date() 
    }

    tasksFiltered.push(newTask);
    const tasksUpdated = [...tasksOld, newTask];

    const projectsCopy = [...projects].map(project => 
    {
      if (project.id === activeProject.id)
      {
        project.tasks = [...tasksOld, newTask];
        
        if (taskType !== 'done')
          project.activeTasks = project.activeTasks + 1;
      }

      return project;
    })

    if (taskType !== 'done')
      setActiveProject(prevActiveProject => ({ ...prevActiveProject, tasks: tasksUpdated, activeTasks: prevActiveProject.activeTasks + 1 }));

    else
      setActiveProject(prevActiveProject => ({ ...prevActiveProject, tasks: tasksUpdated }));

    axios.post('/task/create', 
    {
      projectID: activeProject.id, 
      newTask: newTask,
      accessToken: localStorage.getItem("accessToken"),
      refreshToken: localStorage.getItem("refreshToken")
    })
    .then(_ => setProjects(projectsCopy))
    .catch(err => 
    {
      setResponseError(err, dispatch);
      setActiveProject(prevActiveProject => ({ ...prevActiveProject, tasks: tasksOld }));
    })
  }

  function handleSave() 
  {
    setEditing(false);

    if (inputValueRef.current.value !== '')
      handleTextChange(inputValue);
  }

  function handleKeyDown(e)
  {
    if (e.key === "Enter")
      handleSave();
    
    else if (e.key === "Escape")
    {
      setEditing(false);
      setInputValue('');
    }
  }

  function handleInputGrowth()
  {
    const textArea = document.getElementById('text-area');

    textArea.addEventListener('input', () => 
    {
      textArea.style.height = 'auto';
      textArea.style.height = `${textArea.scrollHeight}px`;
    });
  }

  return (
    <div className="tasks" id={ taskType }>
      <h2 className="tasks__header">{ taskTypeName }</h2>
      {/* <div className="tasks__options"><FontAwesomeIcon icon={ faEllipsisVertical }/></div> */}
      
      <TaskTypeContext.Provider value={ taskType }>
      {
        activeProject?.tasks &&
        <List 
          classes='tasks__list' 
          ids={ `list--${taskType}` }
          elements={ tasksFiltered.sort((a, b) => {return a.position - b.position}) } 
          ListItem={ Task } 
        /> 
      }
      </TaskTypeContext.Provider>
      
      <div className="tasks__add">
      {
        editing 
        ? <textarea 
            style={{ width: '100%', overflow: 'hidden' }} 
            id='text-area' 
            ref={ inputValueRef } 
            value={ inputValue } 
            onChange={ e => {setInputValue(e.target.value)} } 
            onBlur={ handleSave } 
            onKeyDown={ handleKeyDown }
            onInput={ handleInputGrowth }
            autoFocus
          />
        
        : (<button onClick={ () => {setEditing(true)} }><FontAwesomeIcon icon={faPlus}/><span> Add task</span></button>)
      }
      </div>
    </div>
  )
}