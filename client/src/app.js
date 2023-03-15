/** dependencies **/
import React, { useState } from 'react';
import './css/common.css';

/** components **/
import Menu from './components/menu';
import Dashboard from './components/dashboard';
import ProjectSeeds from './project-seeds';

/** font-awesome **/
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';

/** contexts **/
export const ToggleMenuContext = React.createContext();

export const ProjectsContext = React.createContext();
export const ActiveProjectContext = React.createContext();

export const ShowTaskCreatorContext = React.createContext();
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
    projectCreatorBackgroundElement.classList.toggle('tasks-creator-background-shown')     
  }

  function showTaskCreator()
  {
    const taskCreatorElement = document.getElementById('tasks-creator');
    taskCreatorElement.classList.toggle('tasks-creator-shown')

    const taskCreatorBackgroundElement = document.getElementById('tasks-creator-background');
    taskCreatorBackgroundElement.classList.toggle('tasks-creator-background-shown')     
  }

  return (
    <div className="app" id='app'>
      <div className='dashboard-burguer-btn' id="dashboard-burguer-btn" onClick={toggleMenu}><FontAwesomeIcon icon={faBars}/></div>
      
      <ActiveProjectContext.Provider value={{ activeProject, setActiveProject }}>
        <ProjectsContext.Provider value={{ projects, setProjects }}>
          <ToggleMenuContext.Provider value={ toggleMenu }>
            <ShowTaskCreatorContext.Provider value={ showTaskCreator }>
              <ShowProjectCreatorContext.Provider value={ showProjectCreator }>
                <Menu/>
                <Dashboard/>
              </ShowProjectCreatorContext.Provider>
            </ShowTaskCreatorContext.Provider>
          </ToggleMenuContext.Provider>
        </ProjectsContext.Provider>
      </ActiveProjectContext.Provider>

    </div>
  );
}
