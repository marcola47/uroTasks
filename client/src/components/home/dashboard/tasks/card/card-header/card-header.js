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
    const typesList = activeProject.types.map(listType => 
    {
      if (listType.id === type.id)
        return { ...listType, name: newName }

      else
        return listType;
    })

    const projectsCopy = [...projects].map(project => 
    {
      if (project.id === activeProject.id)
        project.types = typesList;

      return project;
    });

    axios.post('/a/project/update?type=types&crud=updateName', 
    {
      projectID: activeProject.id,
      typeID: type.id,
      typeName: newName,
      accessToken: localStorage.getItem("accessToken"),
      refreshToken: localStorage.getItem("refreshToken")
    })
    .then(_ => 
    {
      setProjects(projectsCopy);
      setActiveProject((prevActiveProject) => ({ ...prevActiveProject, types: typesList }))
    })
    .catch(err => setResponseError(err, dispatch))

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