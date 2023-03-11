import React, { useContext } from 'react';
import MenuProjectsItem from './menu-projects-item';

import { ProjectsContext } from '../app';

function ItemsList({ menuProjectItems })
{
  return menuProjectItems.map(menuProjectsItem => {return <MenuProjectsItem menuProjectsItem={menuProjectsItem} key={menuProjectsItem.id}/>})
}

export default function ProjectsList()
{
  const {projectItems, setProjectItems} = useContext(ProjectsContext);

  return (
    <ul className='menu-projects-list' id='menu-projects-list'>
      <ItemsList menuProjectItems={projectItems}/>
    </ul>
  )
}