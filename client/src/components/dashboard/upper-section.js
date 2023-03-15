import { useContext } from 'react';
import { ProjectsContext, ShowTaskCreatorContext } from "../../app";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faArrowDownWideShort, faTrashCan } from '@fortawesome/free-solid-svg-icons';

export default function UpperSection({ activeProject })
{
  const { projects, setProjects } = useContext(ProjectsContext);
  const showTaskCreator = useContext(ShowTaskCreatorContext);

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
      <h1 className="dashboard-upper-title" id="dashboard-project-title">{ activeProject.name }</h1>
      <div className="upper-controls-sort"><FontAwesomeIcon icon={ faArrowDownWideShort }/></div>
      <div className="upper-controls-delete_project" onClick={ deleteProject }><FontAwesomeIcon icon={ faTrashCan }/></div>
      <div className="upper-controls-add_task" onClick={ showTaskCreator }><FontAwesomeIcon icon={ faPlus }/></div>
    </div>
  )
}