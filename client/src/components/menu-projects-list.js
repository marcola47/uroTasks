import React, { useContext } from 'react';
import ProjectsItem from './menu-projects-item';

import { ProjectsContext } from '../app';

function ProjectsItemsList({ projects })
{
  return projects.map(project => {return <ProjectsItem projectsItem={project} key={project.id}/>})
}

export default function ProjectsList()
{
  const {projects, setProjects} = useContext(ProjectsContext);

  return (
    <ul className='menu-projects-list' id='menu-projects-list'>
      <ProjectsItemsList projects={projects}/>
    </ul>
  )
}