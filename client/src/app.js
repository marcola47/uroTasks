import React, { useState, useEffect, useReducer } from 'react';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import axios from 'utils/axiosConfig';

import 'css/app.css';

import { Notification, Confirmation } from 'components/utils/modals/modals'
import NotFoundPage from 'pages/404'
import HomePage from 'pages/home'
import LoginPage from 'pages/login'
import RegisterPage from 'pages/register'
import SettingsPage from 'pages/settings'

export const UserContext = React.createContext();
export const ProjectsContext = React.createContext();
export const ReducerContext = React.createContext();

export default function App() 
{
  const location = useLocation();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [projects, setProjects] = useState([]);
  const [activeProject, setActiveProject] = useState(null);

  const [state, dispatch] = useReducer(reducer, 
  {
    menuShown: window.innerWidth > 1336 ? true : false,
    projCreatorShown: false,

    notification: null,
    notificationShown: false,

    confirmation: null,
    confirmationShown: false,

    editorParams: null,
    editorData: null
  });
      
  function reducer(state, action)
  {
    switch (action.type)
    {
      // ui
      case 'menuShown': 
        return { ...state, menuShown: action.payload };

      case 'projCreatorShown': 
        return { ...state, projCreatorShown: action.payload };

      case 'confirmationShown':
        return { ...state, confirmationShown: action.payload }

      case 'setConfirmation': 
        return { ...state, confirmation: action.payload };

      case 'notificationShown':
        return { ...state, notificationShown: action.payload }

      case 'setNotification': 
        return { ...state, notification: action.payload };

      case 'setEditor':
        return { ...state, editorParams: action.payload.params, editorData: action.payload.data }

      default: return state;
    }
  }

  useEffect(() => // get and set projects 
  {
    if (user !== null)
    {
      if (projects.length <= 0)
      {
        axios.post(`/a/project/get`, 
        {
          projectIDs: user.projects,
          accessToken: localStorage.getItem("accessToken"),
          refreshToken: localStorage.getItem("refreshToken")
        })
        .then(res => setProjects(res.data.projectsMeta))
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

    // eslint-disable-next-line
  }, [user, projects]);

  useEffect(() => // get and set user
  {
    if (user === null)
    {
      const accessToken = localStorage.getItem("accessToken");
      const refreshToken = localStorage.getItem("refreshToken");

      if (accessToken || refreshToken)
      {
        axios.post(`/a/user/token`, 
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
        .catch(_ => 
        {
          navigate('login');
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
        })
      }

      else if (location.pathname !== '/register' && location.pathname !== '/login')
        navigate('/login')
    }
 
    // eslint-disable-next-line
  }, [user])

  useEffect(() => // hide notification
  {
    const timer = setTimeout(() => 
    {
      if (state.notificationShown)
        dispatch({ type: 'notificationShown', payload: false })
    }, 5000);
    
    return () => {clearTimeout(timer)};
  }, [state.notificationShown])

  return (
    <div className="app" id='app'>
      <UserContext.Provider value={{ user, setUser }}>
        <ProjectsContext.Provider value={{ projects, setProjects, activeProject, setActiveProject }}>
          <ReducerContext.Provider value={{ state, dispatch }}>
              <AnimatePresence initial={ false } mode='wait' onExitComplete={ () => null }>
                { state.notificationShown && <Notification/> } 
                { state.confirmationShown && <Confirmation/> }
              </AnimatePresence>

              <Routes>
                <Route exact path='/' element={ <HomePage/> }/>
                <Route path='/login' element={ <LoginPage/> }/>
                <Route path='/register' element={ <RegisterPage/> }/>
                <Route path='/settings' element={ <SettingsPage/> }/>
                <Route path='*' element={ <NotFoundPage/> }/>
              </Routes>
          </ReducerContext.Provider>
        </ProjectsContext.Provider>
      </UserContext.Provider>
    </div>
  );
}
