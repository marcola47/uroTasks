import { useState, useContext, useRef } from "react"
import { ProjectsContext, ReducerContext } from "app";
import axios, { setResponseError } from 'utils/axiosConfig';

export default function CardHeader({ type })
{
  const { projects, setProjects, activeProject, setActiveProject } = useContext(ProjectsContext);
  const { dispatch } = useContext(ReducerContext);

  const [editing, setEditing] = useState(false);
  const [inputValue, setInputValue] = useState(type.name);
  const inputRef = useRef(null);

  function handleNameChange(newName) 
  { 
    const oldTypes = structuredClone(activeProject.types);
    const typesList = structuredClone(activeProject.types).map(listType => 
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
        project.types = typesList;
        project.updated_at = Date.now();
      }

      return project;
    });

    setProjects(projectsCopy)
    axios.post('/a/project/update?type=types&crud=updateName', 
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
    <div className='card__header'>
    {
      editing 
      ? <input 
          autoFocus 
          type="text" 
          value={ inputValue } 
          ref={ inputRef } 
          style={ {width: '100%'} } 
          onChange={ e => {setInputValue(e.target.value)} } 
          onBlur={ handleSave } 
          onKeyDown={ handleKeyDown }
        />

      : <div onClick={ () => {setEditing(true)} }>{ type.name }</div>
    }
    </div>
  )
}