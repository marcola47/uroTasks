import { useContext } from 'react';
import { ProjectsContext, ReducerContext } from "app";
import axios, { setResponseConfirmation, setResponseError } from 'utils/axiosConfig';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowDownWideShort } from '@fortawesome/free-solid-svg-icons';

export default function OptionSort()
{
  const { projects, setProjects, activeProject, setActiveProject } = useContext(ProjectsContext);
  const { dispatch } = useContext(ReducerContext);

  function sortProjectTasks()
  {
    return true;
  }
 
  return (
    <div className="taskbar__option taskbar__option--sort" onClick={ sortProjectTasks }>
      <FontAwesomeIcon icon={ faArrowDownWideShort }/>
    </div>
  )
}