import React, { useContext, useState } from 'react';
import { ProjectsContext, ActiveProjectContext } from '../../app';

import { ChromePicker } from 'react-color';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSquare } from '@fortawesome/free-solid-svg-icons';

export default function TaskbarProjectColor()
{
  const { projects, setProjects } = useContext(ProjectsContext);
  const { activeProject, setActiveProject } = useContext(ActiveProjectContext);

  const [color, setColor] = useState(activeProject.color);
  const [pickerActive, setPickerActive] = useState(false);

  const handleColorChange = (color) =>
  {
    setColor(color.hex);

    const placeholderProjects = projects.map(project => 
      {
        if (project.id === activeProject.id)
          return { ...project, color: color.hex }

        return project;
      });

    setProjects(placeholderProjects);
  }

  function toggleColorPicker()
  {
    setPickerActive(!pickerActive);
  }

  function ColorPicker()
  {
    return (
      <div>
        <div onClick={toggleColorPicker} className='color-picker-background'/>
        <ChromePicker color={ color } onChangeComplete={ handleColorChange }/> 
      </div>
    )
  }

  return (
    <>
      <div className='title-color' onClick={toggleColorPicker} style={{ color: color }}><FontAwesomeIcon icon={ faSquare }/></div>
      {pickerActive ? <ColorPicker/> : null}
    </>
  )
}