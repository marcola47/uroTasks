import React, { useState } from 'react';
import './css/common.css';

import Menu from './components/menu';
import Dashboard from './components/dashboard';
import ProjectSeeds from './project-seeds';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';

// I'll often pull unused variables from this context, but it's better than setting up 3 different contexts.
export const ProjectsContext = React.createContext();

export default function App() 
{
  const [projects, setProjects] = useState(ProjectSeeds);

  function toggleMenu()
  {
    const btnElement = document.getElementById('dashboard-burguer-btn');
    btnElement.classList.toggle('show-dashboard-burguer-btn');

    const menuElement = document.getElementById('menu');
    menuElement.classList.toggle('menu-hidden');

    const dashboardElement = document.getElementById('dashboard');
    dashboardElement.classList.toggle('move-dashboard');

    const searchbarElement = document.getElementById('dashboard-searchbar');
    
    if (!menuElement.classList.contains('menu-hidden'))
      searchbarElement.classList.add('searchbar-when-menu-shown');

    else
      searchbarElement.classList.remove('searchbar-when-menu-shown');
  }

  function showProjectCreator()
  {
    const projectCreatorElement = document.getElementById('projects-creator-background');
    projectCreatorElement.classList.toggle('projects-creator-shown')       
  }

  return (
    <div className="app" id='app'>
      <div className='dashboard-burguer-btn' id="dashboard-burguer-btn" onClick={toggleMenu}><FontAwesomeIcon icon={faBars}/></div>
      
      <ProjectsContext.Provider value={{projects, setProjects, showProjectCreator}}>
        <Menu onClick={toggleMenu}/>
        <Dashboard/>
      </ProjectsContext.Provider>
    </div>
  );
}
