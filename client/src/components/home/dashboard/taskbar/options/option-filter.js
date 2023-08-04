import { useContext } from 'react';
import { ProjectsContext, ReducerContext } from "app";
import axios, { setResponseConfirmation, setResponseError } from 'utils/axiosConfig';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilter } from '@fortawesome/free-solid-svg-icons';

export default function OptionFilter()
{
  const { projects, setProjects, activeProject, setActiveProject } = useContext(ProjectsContext);
  const { dispatch } = useContext(ReducerContext);

  function filterProjectTasks()
  {
    return true;
  }
 
  return (
    <div className="taskbar__option taskbar__option--filter" onClick={ filterProjectTasks }>
      <FontAwesomeIcon icon={ faFilter }/>
    </div>
  )
}

// due dates, labels, keywords