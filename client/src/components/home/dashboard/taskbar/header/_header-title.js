import { useState, useContext } from 'react';
import { ProjectsContext } from '../../../../../app';
import axios from 'axios';

export default function ItemText({ value }) 
{
  const { projects, setProjects, activeProject, setActiveProject } = useContext(ProjectsContext);
  
  const [editing, setEditing] = useState(false);
  const [inputValue, setInputValue] = useState(value);

  function handleNameChange(newName) 
  { 
    // not setting the activeProject directly makes the name flicker when changing
    const oldName = activeProject.name;

    if (newName === oldName)
      return;

    const projectsCopy = projects.map(project => 
    {
      if (project.id === activeProject.id)
        return { ...project, name: newName, tasks: activeProject.tasks }

      return project;
    });

    setActiveProject({ ...activeProject, name: newName });

    axios.post(`${process.env.REACT_APP_SERVER_ROUTE}/project-update?type=name`, [activeProject.id, newName])
    .then(res => 
    {
      console.log(res);
      setProjects(projectsCopy);
    })
    .catch(err => 
    {
      console.log(err);
      setActiveProject({ ...activeProject, name: oldName });
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
    <div className='header__text'>
    {
      editing 
      ? <input 
          autoFocus 
          type="text" 
          value={ inputValue } 
          style={ {width: '100%'} } 
          onChange={ e => {setInputValue(e.target.value)} } 
          onBlur={ handleSave } 
          onKeyDown={ handleKeyDown }
        />

      : <div style={{ width: '100%' }} onClick={ () => {setEditing(true)} }>{ value }</div>
    }
    </div>
  );
}