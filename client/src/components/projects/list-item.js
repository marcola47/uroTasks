import { useEffect, useContext } from "react";
import { ProjectsContext, ActiveProjectContext } from "../../app";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSquare } from '@fortawesome/free-solid-svg-icons';

export default function ProjectsItem({ projectsItem })
{
  const { projects, setProjects } = useContext(ProjectsContext);
  const { setActiveProject } = useContext(ActiveProjectContext);

  function activateProject()
  {
    projects.forEach(project => {project.active = false});
    
    const placeholderProjects = projects.map(project => 
    {
      if (project.id === projectsItem.id && project.active === false)
        return { ...project, active: true }

      return project;
    })

    setProjects(placeholderProjects);  
  }

  useEffect(() => {setActiveProject(projects.filter(project => project.active === true)[0])}
  , [projects, setActiveProject])

  return (
    <li className='menu-projects-list-item' onClick={ activateProject }>
      <div className='item-data'>
        <span style={{ color: projectsItem.color }}><FontAwesomeIcon icon={ faSquare }/></span> 
        <div className='item-name'>{ projectsItem.name }</div>
      </div> 
  
      <div className='total-tasks'>{ projectsItem.todo.length + projectsItem.doing.length }</div>
    </li>
  )
}