import { useContext } from 'react';
import { ProjectsContext, ActiveProjectContext } from '../../app';

import { useState } from 'react';

export default function ItemText({ value }) 
{
  const [editing, setEditing] = useState(false);
  const [inputValue, setInputValue] = useState(value);
  
  const { projects, setProjects } = useContext(ProjectsContext);
  const { activeProject } = useContext(ActiveProjectContext);

  function handleNameChange(newName) 
  { 
    const placeholderProjects = projects.map(project => 
      {
        if (project.id === activeProject.id)
          return { ...project, name: newName }

        return project;
      });

    setProjects(placeholderProjects);
  }

  function handleInputChange(e) 
  {
    setInputValue(e.target.value);
  }

  function handleEdit() 
  {
    setEditing(true);
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
    <div className='taskbar-title-text'>
      {
        editing ? (<input style={{width: '100%'}} autoFocus type="text" value={inputValue} onChange={handleInputChange} onBlur={handleSave} onKeyDown={handleKeyDown}/>) 
                : (<div style={{width: '100%'}} onClick={handleEdit}>{value}</div>)
      }
    </div>
  );
}