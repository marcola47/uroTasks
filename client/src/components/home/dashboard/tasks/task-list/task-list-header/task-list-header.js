import { useState, useContext, useRef } from "react"
import { ProjectsContext, ReducerContext } from "app";
import axios, { setResponseError } from 'utils/axiosConfig';

export default function TaskListHeader({ type })
{
  const { projects, setProjects, activeProject } = useContext(ProjectsContext);
  const { dispatch } = useContext(ReducerContext);

  const [editing, setEditing] = useState(false);
  const [inputValue, setInputValue] = useState(type.name);
  const inputRef = useRef(null);

  function handleNameChange(newName) 
  { 
    const typeList = structuredClone(activeProject.types).map(listType => 
    {
      if (listType.id === type.id)
        listType.name = newName;

      return listType;
    })

    const projectsOld = structuredClone(projects);
    const projectsCopy = structuredClone(projects).map(project => 
    {
      if (project.id === activeProject.id)
      {
        project.types = typeList;
        project.updated_at = Date.now();
      }

      return project;
    });

    setProjects(projectsCopy)
    axios.patch('/a/list/update/name', 
    { 
      projectID: activeProject.id, 
      typeID: type.id, 
      typeName: newName 
    })
    .catch(err => 
    {
      setResponseError(err, dispatch)
      setProjects(projectsOld)
    })

    dispatch({ type: 'confirmationShown', payload: false })
  }

  function handleSave() 
  {
    setEditing(false);

    if (inputRef.current.value !== type.name)
      handleNameChange(inputValue);
  }

  function handleKeyDown(e)
  {
    if (e.key === "Enter")
      handleSave();
  }

  return (
    <div className='task-list__header'>
    {
      editing 
      ? <input 
          autoFocus 
          type="text" 
          value={ inputValue } 
          ref={ inputRef } 
          style={ {width: '100%'} } 
          onChange={ e => setInputValue(e.target.value) } 
          onBlur={ handleSave } 
          onKeyDown={ handleKeyDown }
        />

      : <div 
          onClick={ () => {setEditing(true)} } 
          children={ type.name }
        />
    }
    </div>
  )
}