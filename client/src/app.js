/** dependencies **/
import React, { useState, useReducer } from 'react';
import './css/common.css';

/** components **/
import Menu from './components/menu';
import Dashboard from './components/dashboard';
import ProjectSeeds from './components/utility/project-seeds';

/** font-awesome **/
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';

/** contexts **/
export const ProjectsContext = React.createContext();
export const ActiveProjectContext = React.createContext();

export const UIReducerContext = React.createContext();
export const ProjectsReducerContext = React.createContext();

function reducerUI(state, action)
{
  switch (action.type)
  {
    case 'menuHidden'     : return { ...state, isMenuHidden     : !state.isMenuHidden      };
    case 'dashboardMoved' : return { ...state, isDashboardMoved : !state.isDashboardMoved  };
    case 'searchbarSpaced': return { ...state, isSearchbarSpaced: !state.isSearchbarSpaced };

    case 'projectCreatorShown': return { ...state, isProjectCreatorShown: !state.isProjectCreatorShown };
    
    default: return state;
  }
}

function reducerProjects(state, action)
{

}

export default function App() 
{
  const [projects, setProjects] = useState(ProjectSeeds);
  const [activeProject, setActiveProject] = useState(projects[0]);

  const [state_ui, dispatch_ui] = useReducer(reducerUI, 
  {
    isMenuHidden: false,
    isDashboardMoved: false,
    isSearchbarSpaced: false,
    isProjectCreatorShown: false
  });

  function toggleMenu()
  { 
    dispatch_ui({ type: 'menuHidden'      });
    dispatch_ui({ type: 'dashboardMoved'  });
    dispatch_ui({ type: 'searchbarSpaced' });  
  }

  return (
    <div className="app" id='app'>
      <div className='dashboard-burguer-btn' id="dashboard-burguer-btn" onClick={toggleMenu}><FontAwesomeIcon icon={faBars}/></div>
      
      <ActiveProjectContext.Provider value={{ activeProject, setActiveProject }}>
        <ProjectsContext.Provider value={{ projects, setProjects }}>
          <UIReducerContext.Provider value={{ state_ui, dispatch_ui }}>
            <Menu/>
            <Dashboard/>
          </UIReducerContext.Provider>
        </ProjectsContext.Provider>
      </ActiveProjectContext.Provider>
    </div>
  );
}
