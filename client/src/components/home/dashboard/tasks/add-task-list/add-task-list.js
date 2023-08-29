import React, { useState, useContext, useRef } from "react";
import { ProjectsContext, ReducerContext } from "app";
import axios, { setResponseError } from 'utils/axiosConfig';
import { v4 as uuid } from 'uuid';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

export default function AddTaskList({ typesOrdered })
{
  const { projects, setProjects, activeProject } = useContext(ProjectsContext);
  const { dispatch } = useContext(ReducerContext);

  const [editing, setEditing] = useState(false);
  const inputValueRef = useRef(null);

  function handleTextChange() 
  {     
    const newTypeName = inputValueRef.current.value;
    const newType = 
    {
      id: uuid(),
      name: newTypeName,
      position: typesOrdered.length,
      created_at: Date.now(),
      updated_at: Date.now()
    }

    const types = typesOrdered;
    types.push(newType);

    const projectsOld = structuredClone(projects);
    const projectsCopy = structuredClone(projects).map(project => 
    {
      if (project.id === activeProject.id)
      {
        project.types = types;
        project.updated_at = Date.now();
      }

      return project;
    })

    setProjects(projectsCopy)
    axios.post('/a/list/create', 
    { 
      projectID: activeProject.id, 
      newType: newType 
    })
    .catch(err => 
    {
      setResponseError(err, dispatch)
      setProjects(projectsOld)
    })

    inputValueRef.current.value = '';
  }

  function handleSave() 
  {
    setEditing(false);

    if (inputValueRef.current.value !== '')
      handleTextChange();
  }

  function handleKeyDown(e)
  {
    if (e.key === "Enter")
      handleSave();
    
    else if (e.key === "Escape")
      setEditing(false);
  }

  return (
    <div className="add-task-list">
    {
      editing 
      ? <input
          style={{ width: '100%', overflow: 'hidden' }} 
          id='input--column' 
          ref={ inputValueRef } 
          onBlur={ handleSave } 
          onKeyDown={ handleKeyDown }
          autoFocus
        />
      
      : <button onClick={ () => {setEditing(true)} }><FontAwesomeIcon icon={ faPlus }/><span> ADD TASK LIST</span></button>
    }
    </div>
  )
}