import { useContext } from "react";
import { ProjectsContext } from "../app";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSquare } from '@fortawesome/free-solid-svg-icons';

export default function ProjectsItem({ projectsItem })
{
  const {projects, setProjects, showProjectCreator} = useContext(ProjectsContext);

  function activateProject()
  {
    projects.forEach(project => {project.active = false});
    
    const placeholderProjects = projects.map(project => 
    {
      if (project.id === projectsItem.id && project.active === false)
        return {...project, active: true }

      return project;
    })

    setProjects(placeholderProjects);
  }

  return (
    <li className='menu-projects-list-item' onClick={activateProject}>
      <div className='item-data'>
        <span style={{color: projectsItem.color}}><FontAwesomeIcon icon={faSquare}/></span> 
        <div className='item-name'>{projectsItem.name}</div>
      </div> 
  
      <div className='total-tasks'>{projectsItem.doing.length}</div>
    </li>
  )
}