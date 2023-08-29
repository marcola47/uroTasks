import React, { useState, useContext, useEffect } from 'react';
import { ProjectsContext, ReducerContext } from 'app';
import axios, { setResponseError } from 'utils/axiosConfig';

import { ChromePicker } from 'react-color';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSquare } from '@fortawesome/free-solid-svg-icons';

export function HeaderColor()
{
  const { projects, setProjects, activeProject } = useContext(ProjectsContext); 
  const { dispatch } = useContext(ReducerContext);
  
  const [newColor, setNewColor] = useState(activeProject.color);
  const [pickerActive, setPickerActive] = useState(false);

  //would not change the fucking color unless I do this
  useEffect(() => { setNewColor(activeProject.color) }, [activeProject])

  function toggleColorPicker()
  {
    setPickerActive(!pickerActive);
    const oldColor = activeProject.color;
    
    if (!pickerActive || newColor === oldColor)
      return;
    
    const projectsOld = structuredClone(projects);
    const projectsCopy = structuredClone(projects).map(project => 
    {
      if (project.id === activeProject.id)
      {
        project.color = newColor;
        project.updated_at = Date.now();
      }

      return project;
    });

    setProjects(projectsCopy)
    axios.post('/a/project/update/color', 
    { 
      projectID: activeProject.id, 
      newColor: newColor 
    })
    .catch(err => 
    {
      setResponseError(err, dispatch)
      setProjects(projectsOld);
    })
  }

  return (
    <>
      <div 
        className='taskbar__color' 
        onClick={ toggleColorPicker } 
        style={{ color: newColor }}
      >
        <FontAwesomeIcon icon={ faSquare }/>
      </div>
      
      {
        pickerActive && 
        <div>
          <div 
            onClick={ toggleColorPicker } 
            className='chrome-picker__bg'
          />

          <ChromePicker 
            color={ newColor } 
            onChange={ color => {setNewColor(color.hex)} }
          />
        </div>
      }
    </>
  )
}

export function HeaderTitle() 
{
  const { projects, setProjects, activeProject } = useContext(ProjectsContext);
  const { dispatch } = useContext(ReducerContext);
  
  const [editing, setEditing] = useState(false);
  const [inputValue, setInputValue] = useState(activeProject.name);

  //would not change the fucking name unless I do this
  useEffect(() => { setInputValue(activeProject.name) }, [activeProject])

  function handleNameChange(newName) 
  { 
    const oldName = activeProject.name;

    if (newName === oldName)
      return;

    const projectsOld = structuredClone(projects);
    const projectsCopy = structuredClone(projects).map(project => 
    {
      if (project.id === activeProject.id)
      {
        project.name = newName;
        project.updated_at = Date.now();
      }

      return project;
    });

    setProjects(projectsCopy)
    axios.post('/a/project/update/name', 
    { 
      projectID: activeProject.id, 
      newName: newName 
    })
    .catch(err => 
    {
      setResponseError(err, dispatch);
      setProjects(projectsOld)
    })
  }

  function handleSave() 
  {
    setEditing(false);
    handleNameChange(inputValue);
  }

  function handleKeyDown(e)
  {
    if (e.key === "Enter")
      handleSave();
  }

  return (
    <div className='taskbar__text'>
    {
      editing 
      ? <input 
          autoFocus 
          type="text" 
          value={ inputValue } 
          style={ {width: '100%'} } 
          onChange={ e => setInputValue(e.target.value) } 
          onBlur={ handleSave } 
          onKeyDown={ handleKeyDown }
        />

      : <div 
          style={{ width: '100%' }} 
          children={ inputValue }
        />
    }
    </div>
  );
}