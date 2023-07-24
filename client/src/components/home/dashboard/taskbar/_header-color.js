import React, { useContext, useState } from 'react';
import { ProjectsContext, ReducerContext } from 'app';
import axios, { setResponseError } from 'utils/axiosConfig';

import { ChromePicker } from 'react-color';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSquare } from '@fortawesome/free-solid-svg-icons';

export default function HeaderColor()
{
  const { projects, setProjects, activeProject, setActiveProject } = useContext(ProjectsContext); 
  const { dispatch } = useContext(ReducerContext);
  
  const [newColor, setNewColor] = useState(activeProject?.color);
  const [pickerActive, setPickerActive] = useState(false);

  function toggleColorPicker()
  {
    setPickerActive(!pickerActive);
    const oldColor = activeProject.color;
    
    if (!pickerActive || newColor === oldColor)
      return;
    
    const projectsCopy = [...projects].map(project => 
    {
      if (project.id === activeProject.id)
        project.color = newColor;

      return project;
    });

    setActiveProject({ ...activeProject, color: newColor });

    axios.post('/project/update?type=color', 
    {
      projectID: activeProject.id, 
      newColor: newColor,
      accessToken: localStorage.getItem("accessToken"),
      refreshToken: localStorage.getItem("refreshToken")
    })
    .then(_ => setProjects(projectsCopy))
    .catch(err => 
    {
      setResponseError(err, dispatch)
      setActiveProject(prevActiveProject => ({ ...prevActiveProject, color: oldColor }))
    })
  }

  function ColorPicker()
  {
    return (
      <div>
        <div onClick={ toggleColorPicker } className='chrome-picker__bg'/>
        <ChromePicker color={ newColor } onChangeComplete={ (color) => {setNewColor(color.hex)} }/> 
      </div>
    )
  }

  return (
    <>
      <div className='taskbar__color' onClick={ toggleColorPicker } style={{ color: newColor }}><FontAwesomeIcon icon={ faSquare }/></div>
      {pickerActive ? <ColorPicker/> : null}
    </>
  )
}