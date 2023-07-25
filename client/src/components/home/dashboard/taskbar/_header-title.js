import { useState, useContext } from 'react';
import { ProjectsContext, ReducerContext } from 'app';
import axios, { setResponseError } from 'utils/axiosConfig';

export default function HeaderTitle({ title }) 
{
  const { projects, setProjects, activeProject, setActiveProject } = useContext(ProjectsContext);
  const { dispatch } = useContext(ReducerContext);
  
  const [editing, setEditing] = useState(false);
  const [inputValue, setInputValue] = useState(title);

  function handleNameChange(newName) 
  { 
    // not setting the activeProject directly makes the name flicker when changing
    const oldName = activeProject.name;

    if (newName === oldName)
      return;

    const projectsCopy = [...projects].map(project => 
    {
      if (project.id === activeProject.id)
        return { ...project, name: newName, tasks: activeProject.tasks }

      return project;
    });

    setActiveProject(prevActiveProject => ({ ...prevActiveProject, name: newName }));

    axios.post('/a/project/update?type=name', 
    {
      projectID: activeProject.id, 
      newName: newName,
      accessToken: localStorage.getItem("accessToken"),
      refreshToken: localStorage.getItem("refreshToken")
    })
    .then(res => setProjects(projectsCopy))
    .catch(err => 
    {
      setResponseError(err, dispatch);
      setActiveProject(prevActiveProject => ({ ...prevActiveProject, name: oldName }));
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
          onChange={ e => {setInputValue(e.target.value)} } 
          onBlur={ handleSave } 
          onKeyDown={ handleKeyDown }
        />

      : <div style={{ width: '100%' }} onClick={ () => {setEditing(true)} }>{ title }</div>
    }
    </div>
  );
}