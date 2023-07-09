/** dependencies **/
import React, { useState, useEffect, useReducer } from 'react';
import { Route, Routes, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

import './css/app.css';

import NotFoundPage from './pages/404'
import HomePage from './pages/home'
import LoginPage from './pages/login'
import RegisterPage from './pages/register'
import SettingsPage from './pages/settings'

export const UserContext = React.createContext();
export const ProjectsContext = React.createContext();

export const FlagsContext = React.createContext();
export const ReducerContext = React.createContext();

export default function App() 
{
  const location = useLocation();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [fetchTasks, setFetchTasks] = useState(true);

  const [user, setUser] = useState(null);
  const [projects, setProjects] = useState([]);
  const [activeProject, setActiveProject] = useState(null);

  useEffect(() => 
  {
    if (user !== null && user.activeProject !== '0' && projects.length > 0)
    {
      const activeProjectIndex = projects.findIndex(project => project.id === user.activeProject);

      activeProjectIndex !== -1 
      ? setActiveProject(projects[activeProjectIndex]) 
      : setActiveProject(null);
    }

    else
      setActiveProject(null);
  }, [user, projects]);

  useEffect(() => 
  {
    if (localStorage.getItem("token") !== null && user === null)
    {
      axios.get(`${process.env.REACT_APP_SERVER_ROUTE}/loginFromToken`, { headers: { "x-access-token": localStorage.getItem("token") } })
      .then(res => setUser(res.data))
      .catch(err => console.log(err))
    }

    else
    {
      if (location.pathname !== '/register' && user === null)
      navigate('/login')

      else if (user !== null && projects.length === 0)
      {
        axios.post(`${process.env.REACT_APP_SERVER_ROUTE}/project-get`, [user.projects])
        .then(res => setProjects(res.data))
        .catch(err => console.log(err))
      }
    }

    // eslint-disable-next-line
  }, [user])

  const [state, dispatch] = useReducer(reducer, 
  {
    isMenuHidden: false,
    isDashboardMoved: false,
    isSearchbarSpaced: false,
    isProjCreatorShown: false,
    isConfirmationShown: false
  });
      
  function reducer(state, action)
  {
    switch (action.type)
    {
      // ui
      case 'menuHidden': return { ...state, isMenuHidden: !state.isMenuHidden };
      case 'dashboardMoved': return { ...state, isDashboardMoved: !state.isDashboardMoved };
      case 'searchbarSpaced': return { ...state, isSearchbarSpaced: !state.isSearchbarSpaced };
      case 'projCreatorShown': return { ...state, isProjCreatorShown: !state.isProjCreatorShown };
      case 'confirmationShown': return { ...state, isConfirmationShown: !state.isConfirmationShown };

      default: return state;
    }
  }

  return (
    <div className="app" id='app'>
      <ProjectsContext.Provider value={{ projects, setProjects, activeProject, setActiveProject }}>
        <UserContext.Provider value={{ user, setUser }}>
          <ReducerContext.Provider value={{ state, dispatch }}>
            <FlagsContext.Provider value={{ loading, setLoading, fetchTasks, setFetchTasks }}>
              <Routes>
                <Route exact path='/' element={ <HomePage/> }/>
                <Route path='/login' element={ <LoginPage/> }/>
                <Route path='/register' element={ <RegisterPage/> }/>
                <Route path='/settings' element={ <SettingsPage/> }/>
      
                <Route path='/404' element={ <NotFoundPage/> }/>
                <Route path='*' element={ <useNavigate to='/404'/> }/>
              </Routes>
            </FlagsContext.Provider>
          </ReducerContext.Provider>
        </UserContext.Provider>
      </ProjectsContext.Provider>
    </div>
  );
}
