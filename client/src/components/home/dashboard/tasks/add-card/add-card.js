import React, { useState, useContext, useRef } from "react";
import { ProjectsContext, ReducerContext } from "app";
import axios, { setResponseError } from 'utils/axiosConfig';
import { v4 as uuid } from 'uuid';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

export default function AddCard({ typesOrdered })
{
  const { projects, setProjects, activeProject, setActiveProject } = useContext(ProjectsContext);
  const { dispatch } = useContext(ReducerContext);

  const [editing, setEditing] = useState(false);
  const inputValueRef = useRef();

  function handleTextChange() 
  {     
    const newTypeName = inputValueRef.current.value;
    const newType = 
    {
      id: uuid(),
      name: newTypeName,
      position: typesOrdered.length + 1
    }

    const types = typesOrdered;
    types.push(newType);

    const projectsCopy = [...projects].map(project => 
    {
      if (project.id === activeProject.id)
        project.types = types;

      return project;
    })

    axios.post('/a/project/update?type=types&crud=create', 
    {
      projectID: activeProject.id,
      newType: newType,
      accessToken: localStorage.getItem("accessToken"),
      refreshToken: localStorage.getItem("refreshToken")
    })
    .then(_ => 
    {
      setActiveProject((prevActiveProject) => ({ ...prevActiveProject, types: types }))
      setProjects(projectsCopy);
    })
    .catch(err => setResponseError(err, dispatch))

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
    <div className="tasks__add-card">
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