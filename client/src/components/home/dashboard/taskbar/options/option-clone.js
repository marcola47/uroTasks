import { useContext } from 'react';
import { ProjectsContext, UserContext, ReducerContext } from "app";

import cloneProject from 'operations/project-clone';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClone } from '@fortawesome/free-solid-svg-icons';

export default function OptionClone()
{
  const { user, setUser } = useContext(UserContext);
  const { projects, setProjects, activeProject } = useContext(ProjectsContext);
  const { state, dispatch } = useContext(ReducerContext);

  function callCloneProject()
  {
    const projectsContext = { projects, setProjects, activeProject }
    const userContext = { user, setUser };
    const reducerContext = { state, dispatch };

    cloneProject(projectsContext, userContext, reducerContext)
  }

  return (
    <div 
      className="taskbar__option taskbar__option--clone" 
      onClick={ callCloneProject }
      children={ <FontAwesomeIcon icon={ faClone }/> }
    />
  )
}