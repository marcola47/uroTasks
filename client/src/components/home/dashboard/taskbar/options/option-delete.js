import { useContext } from 'react';
import { ProjectsContext, UserContext, ReducerContext } from "app";

import deleteProject from 'operations/project-delete';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan } from '@fortawesome/free-solid-svg-icons';

export default function OptionDelete()
{
  const { user, setUser } = useContext(UserContext);
  const { projects, setProjects, activeProject } = useContext(ProjectsContext);
  const { state, dispatch } = useContext(ReducerContext);

  function callDeleteProject()
  {
    const projectsContext = { projects, setProjects, activeProject }
    const userContext = { user, setUser };
    const reducerContext = { state, dispatch };

    deleteProject(projectsContext, userContext, reducerContext)
  }

  return (
    <div 
      className="taskbar__option taskbar__option--delete" 
      onClick={ callDeleteProject }
      children={ <FontAwesomeIcon icon={ faTrashCan }/> }
    />   
  )
}