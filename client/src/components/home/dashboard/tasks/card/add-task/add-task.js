import React, { useState, useContext, useRef } from "react";
import { ProjectsContext, ReducerContext } from "app";
import { v4 as uuid } from 'uuid';
import axios, { setResponseError } from 'utils/axiosConfig';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

export default function AddTask({ type })
{
  const { projects, setProjects, activeProject } = useContext(ProjectsContext); 
  const { dispatch } = useContext(ReducerContext);
  
  const [editing, setEditing] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const inputValueRef = useRef();

  const tasksFiltered = Array.isArray(activeProject.tasks) 
    ? structuredClone(activeProject.tasks).filter(task => task.type === type.id)
    : [];

  function handleTextChange(content) 
  {     
    const taskList = structuredClone(activeProject.tasks) ?? [];
    
    const newPosition = tasksFiltered.length > 0 
      ? Math.max(...tasksFiltered.map(taskObj => taskObj.position)) + 1 
      : 1;

    const newTask = 
    { 
      id: uuid(), 
      type: type.id,
      position: newPosition,
      content: content, 
      project: activeProject.id,
      tags: [],
      created_at: Date.now(), 
      updated_at: Date.now() 
    }

    taskList.push(newTask);

    const projectsOld = structuredClone(projects);
    const projectsCopy = structuredClone(projects).map(project => 
    {
      if (project.id === activeProject.id)
      {
        project.tasks = taskList;
        project.updated_at = Date.now();
      }

      return project;
    })
      
    setProjects(projectsCopy)
    axios.post('/a/task/create', 
    {
      projectID: activeProject.id, 
      newTask: newTask
    })
    .catch(err => 
    {
      setResponseError(err, dispatch);
      setProjects(projectsOld)
    })

    setInputValue('');
  }

  async function handleSave() 
  {
    if (inputValueRef.current.value !== '')
      await handleTextChange(inputValue);

    setEditing(false);
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
    <div className="card__add-task">
    {
      editing 
      ? <textarea 
          style={{ width: '100%', overflow: 'hidden' }} 
          id='text-area' 
          ref={ inputValueRef } 
          value={ inputValue } 
          onChange={ e => setInputValue(e.target.value) } 
          onBlur={ handleSave } 
          onKeyDown={ handleKeyDown }
          onInput={ handleInputGrowth }
          autoFocus
        />
      
      : <button onClick={ () => {setEditing(true)} }><FontAwesomeIcon icon={ faPlus }/><span> Add task</span></button>
    }
    </div>
  )
}