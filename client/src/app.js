import React, { useState } from 'react';
import './css/common.css';

import Menu from './components/menu';
import ProjectsCreator from './components/menu-projects-creator';
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
    if (btnElement) btnElement.classList.toggle('show-dashboard-burguer-btn');

    const menuElement = document.getElementById('menu');
    if (menuElement) menuElement.classList.toggle('menu-hidden');

    const dashboardElement = document.getElementById('dashboard');
    if (dashboardElement) dashboardElement.classList.toggle('move-dashboard');
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
        <ProjectsCreator/>
        <Menu onClick={toggleMenu}/>
        <Dashboard/>
      </ProjectsContext.Provider>
    </div>
  );
}
