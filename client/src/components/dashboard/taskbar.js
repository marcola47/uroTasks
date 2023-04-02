import { useContext } from 'react';
import { ProjectsContext, ActiveProjectContext } from "../../app";

import TaskbarTitle from './taskbar-title';
import TaskbarProjectColor from './taskbar-color';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowDownWideShort, faTrashCan } from '@fortawesome/free-solid-svg-icons';

export default function UpperSection()
{
  const { activeProject } = useContext(ActiveProjectContext);
  const { projects, setProjects } = useContext(ProjectsContext);

  function deleteProject()
  {
    let placeholderProjects;

    if (projects.length > 1)
    {
      placeholderProjects = projects.filter(project => project.id !== activeProject.id);
      placeholderProjects[0].active = true;
      
      setProjects(placeholderProjects);
    }

    else
      setProjects([]);
  }

  return (
    <div className="dashboard-upper">
      <h1 className="dashboard-upper-title" id="dashboard-project-title">
        <TaskbarProjectColor/>
        <TaskbarTitle value={ activeProject.name }/>
      </h1>
      
      <div className="upper-controls-sort">
        <FontAwesomeIcon icon={ faArrowDownWideShort }/>
        <span className='controls-big'> Sort</span>
        <span className='controls-small'></span>
      </div>

      <div className="upper-controls-delete_project" onClick={ deleteProject }>
        <FontAwesomeIcon icon={ faTrashCan }/> 
        <span className='controls-big'> Delete</span>
        <span className='controls-small'></span>
      </div>
    </div>
  )
}