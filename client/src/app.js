import React, { useState } from 'react';
import './css/common.css';

import Menu from './components/menu';
import Dashboard from './components/dashboard';
import ProjectSeeds from './project-seeds';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';

// I'll often pull unused variables from this context, but it's better than setting up 3 different contexts.
export const ProjectsContext = React.createContext();
export const ActiveProjectContext = React.createContext();

export const ShowProjectCreatorContext = React.createContext();

export default function App() 
{
  const [projects, setProjects] = useState(ProjectSeeds);
  const [activeProject, setActiveProject] = useState(projects[0]);

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
    const projectCreatorElement = document.getElementById('projects-creator');
    projectCreatorElement.classList.toggle('projects-creator-shown')

    const projectCreatorBackgroundElement = document.getElementById('projects-creator-background');
    projectCreatorBackgroundElement.classList.toggle('projects-creator-background-shown')       
  }


  return (
    <div className="app" id='app'>
      <div className='dashboard-burguer-btn' id="dashboard-burguer-btn" onClick={toggleMenu}><FontAwesomeIcon icon={faBars}/></div>
      
      <ShowProjectCreatorContext.Provider value={showProjectCreator}>
        <ProjectsContext.Provider value={{ projects, setProjects}}>
          <ActiveProjectContext.Provider value={{ activeProject, setActiveProject }}>
            <Menu onClick={toggleMenu}/>
            <Dashboard/>
          </ActiveProjectContext.Provider>
        </ProjectsContext.Provider>
      </ShowProjectCreatorContext.Provider>
    </div>
  );
}
