import React, { useState } from 'react';
import { v4 } from 'uuid';
import './css/common.css';

import Menu from './components/menu';
import Dashboard from './components/dashboard';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';

export const ProjectsContext = React.createContext();

export default function App() 
{
  const [projectItems, setProjectItems] = useState([
    {id: v4(), name: "Work", color: "#00ff94"},
    {id: v4(), name: "College", color: "#F75C5C"},
    {id: v4(), name: "Online 'Business'", color: "#FAF570"},
    {id: v4(), name: "Tutorial Education Program", color: "#189AD1"}
  ]);

  function toggleMenu()
  {
    const btnElement = document.getElementById('dashboard-burguer-btn');
    if (btnElement) btnElement.classList.toggle('show-dashboard-burguer-btn');

    const menuElement = document.getElementById('burguer-menu');
    if (menuElement) menuElement.classList.toggle('burguer-menu-is-hidden');

    const dashboardElement = document.getElementById('dashboard');
    if (dashboardElement) dashboardElement.classList.toggle('move-dashboard');
  }

  return (
    <div className="app" id='app'>
      <div className='dashboard-burguer-btn' id="dashboard-burguer-btn" onClick={toggleMenu}><FontAwesomeIcon icon={faBars}/></div>
      <ProjectsContext.Provider value={{projectItems, setProjectItems}}>
        <Menu onClick={toggleMenu}/>
        <Dashboard onClick={toggleMenu}/>
      </ProjectsContext.Provider>
    </div>
  );
}
