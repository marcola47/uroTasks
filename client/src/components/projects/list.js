import { useContext } from 'react';
import { ProjectsContext } from '../../app';

import ProjectsItem from '../projects/list-item';

function ProjectsItemsList({ projects })
{
  return projects.map(project => {return <ProjectsItem projectsItem={ project } key={ project.id }/>})
}

export default function ProjectsList()
{
  const { projects } = useContext(ProjectsContext);

  return (
    <ul className='menu-projects-list' id='menu-projects-list'>
      <ProjectsItemsList projects={ projects }/>
    </ul>
  )
}