/** dependencies **/
import React, { useState, useEffect, useReducer } from 'react';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import axios from 'axios';

import './css/app.css';

import Notification from './components/utils/notification/notification'
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

  useEffect(() => // get and set projects 
  {
    if (user !== null && user.activeProject !== '0')
    {
      if (projects.length <= 0)
      {
        axios.post(`${process.env.REACT_APP_SERVER_ROUTE}/project/get`, 
        {
          projectIDs: user.projects,
          accessToken: localStorage.getItem("accessToken"),
          refreshToken: localStorage.getItem("refreshToken")
        })
        .then(res => setProjects(res.data))
        .catch(err => console.log(err))
      }

      else if (projects.length > 0)
      {
        const activeProjectIndex = projects.findIndex(project => project.id === user.activeProject);

        activeProjectIndex !== -1 
        ? setActiveProject(projects[activeProjectIndex]) 
        : setActiveProject(null);
      }
    }
  }, [user, projects]);

  useEffect(() => // get and set user
  {
    if (user === null)
    {
      const accessToken = localStorage.getItem("accessToken");
      const refreshToken = localStorage.getItem("refreshToken");

      if (accessToken || refreshToken)
      {
        axios.post(`${process.env.REACT_APP_SERVER_ROUTE}/user/token`, 
        { 
          accessToken: accessToken,
          refreshToken: refreshToken,
          reqType: 'login'
        })
        .then(res => 
        { 
          localStorage.setItem("accessToken", res.data.accessToken);
          setUser(res.data.result);
        })
        .catch(err => 
        {
          console.log(err)
  
          navigate('login');
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
        })
      }

      else if (location.pathname !== '/register' || location.pathname !== '/login')
        navigate('/login')
    }

    // eslint-disable-next-line
  }, [user])

  const [state, dispatch] = useReducer(reducer, 
  {
    isMenuHidden: false,
    isDashboardMoved: false,
    isSearchbarSpaced: false,
    isProjCreatorShown: false,
    isConfirmationShown: false,

    notification: null,
    notificationShown: false
  });
      
  function reducer(state, action)
  {
    switch (action.type)
    {
      // ui
      case 'menuHidden': 
        return { ...state, isMenuHidden: !state.isMenuHidden };
      
      case 'dashboardMoved': 
        return { ...state, isDashboardMoved: !state.isDashboardMoved };

      case 'searchbarSpaced': 
        return { ...state, isSearchbarSpaced: !state.isSearchbarSpaced };

      case 'projCreatorShown': 
        return { ...state, isProjCreatorShown: !state.isProjCreatorShown };

      case 'confirmationShown': 
        return { ...state, isConfirmationShown: !state.isConfirmationShown };

      case 'setNotification': 
        return { ...state, notification: action.payload };

      case 'toggleNotification':
        return { ...state, notificationShown: !state.notificationShown }

      case 'showNotification':
        return { ...state, notificationShown: true }

      case 'hideNotification':
        return { ...state, notificationShown: false }

      default: return state;
    }
  }

  useEffect(() => 
  {
    const timer = setTimeout(() => 
    {
      if (state.notification)
        dispatch({ type: 'hideNotification' })

    }, 5000);
    
    return () => {clearTimeout(timer)};
  }, [state.notification])

  return (
    <div className="app" id='app'>
      <ProjectsContext.Provider value={{ projects, setProjects, activeProject, setActiveProject }}>
        <UserContext.Provider value={{ user, setUser }}>
          <ReducerContext.Provider value={{ state, dispatch }}>
            <FlagsContext.Provider value={{ loading, setLoading, fetchTasks, setFetchTasks }}>
              
              <AnimatePresence initial={ false } mode='wait' onExitComplete={ () => null }>
                { state.notificationShown && <Notification/> }
              </AnimatePresence>

              <Routes>
                <Route exact path='/' element={ <HomePage/> }/>
                <Route path='/login' element={ <LoginPage/> }/>
                <Route path='/register' element={ <RegisterPage/> }/>
                <Route path='/settings' element={ <SettingsPage/> }/>
      
                <Route path='*' element={ <NotFoundPage/> }/>
              </Routes>

            </FlagsContext.Provider>
          </ReducerContext.Provider>
        </UserContext.Provider>
      </ProjectsContext.Provider>
    </div>
  );
}
