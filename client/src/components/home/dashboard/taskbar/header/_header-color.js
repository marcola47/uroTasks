import React, { useContext, useState } from 'react';
import { ProjectsContext } from '../../../../../app';
import axios from 'axios';

import { ChromePicker } from 'react-color';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSquare } from '@fortawesome/free-solid-svg-icons';

export default function TaskbarProjectColor()
{
  const { projects, setProjects, activeProject, setActiveProject } = useContext(ProjectsContext); 
  
  const [newColor, setNewColor] = useState(activeProject?.color);
  const [pickerActive, setPickerActive] = useState(false);

  function toggleColorPicker()
  {
    setPickerActive(!pickerActive);
    const oldColor = activeProject.color;
    
    if (!pickerActive || newColor === oldColor)
      return;
    
    const projectsCopy = projects.map(project => 
    {
      if (project.id === activeProject.id)
        project.color = newColor;

      return project;
    });

    setActiveProject({ ...activeProject, color: newColor });

    axios.post(`${process.env.REACT_APP_SERVER_ROUTE}/project-update?type=color`, [activeProject.id, newColor])
      .then(res => 
      {
        console.log(res);
        setProjects(projectsCopy);
      })
      .catch(err => 
      {
        console.log(err);
        setActiveProject({ ...activeProject, color: oldColor })
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
      <div className='header__color' onClick={ toggleColorPicker } style={{ color: newColor }}><FontAwesomeIcon icon={ faSquare }/></div>
      {pickerActive ? <ColorPicker/> : null}
    </>
  )
}