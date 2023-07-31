import React, { useState, useEffect, useReducer } from 'react';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import axios, { setResponseError } from 'utils/axiosConfig';

import 'css/app.css';

import { AnimateTransit } from 'components/utils/transitions/transitions';
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
    fetchingProjects: true,
    fetchTasks: false,

    menuShown: JSON.parse(localStorage.getItem("menuOpen")),
    projCreatorShown: false,

    notification: null,
    notificationShown: false,

    confirmation: null,
    confirmationShown: false,

    editorParams: null,
    editorData: null,

    cardParams: null,
    cardData: null,
  });
      
  function reducer(state, action)
  {
    switch (action.type)
    {
      case 'fetchingProjects':
        return { ...state, fetchingProjects: action.payload }

      case 'fetchingTasks':
        return { ...state, fetchingTasks: action.payload }

      // ui
      case 'menuShown':
        localStorage.setItem("menuOpen", action.payload)
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

      case 'setCardOptions':
        return { ...state, cardParams: action.payload.params, cardData: action.payload.data }

      default: return state;
    }
  }

  function fetchUser()
  {
    if (user === null)
    {
      const accessToken = localStorage.getItem("accessToken");
      const refreshToken = localStorage.getItem("refreshToken");

      if (accessToken && refreshToken)
      {
        axios.post(`/a/user/token`, { reqType: 'login' })
        .then(res => 
        { 
          localStorage.setItem("accessToken", res.data.accessToken);
          setUser(res.data.result);
        })
        .catch(err => 
        {
          navigate('login');
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          setResponseError(err, dispatch)
        })
      }

      else if (location.pathname !== '/register' && location.pathname !== '/login')
        navigate('/login')
    }
  }

  function fetchProjects()
  {
    if (user !== null)
    {
      if (state.fetchingProjects)
      {
        axios.post(`/a/project/get`, { projectIDs: user.projects })
        .then(res =>
        {
          setProjects(res.data.projectsMeta); 
          dispatch({ type: 'fetchingProjects', payload: false })
        })
        .catch(err => setResponseError(err, dispatch))
      }

      else if (projects.length > 0)
      {
        const activeProjectIndex = projects.findIndex(project => project.id === user.activeProject);

        activeProjectIndex !== -1 
          ? setActiveProject(projects[activeProjectIndex]) 
          : setActiveProject(null);
      }
    }
  }

  function fetchTasks()
  {
    if (activeProject)
    {
      if (activeProject.tasks === undefined)
        dispatch({ type: 'fetchingTasks', payload: true })
        
      if (state.fetchingTasks)
      {
        axios.post(`/a/task/get?projectID=${activeProject.id}`)
        .then(res => 
        {
          const projectsCopy = [...projects].map(project => 
          {
            if (project.id === activeProject.id)
              project.tasks = res.data.tasks;
  
            return project;
          });
          
          setProjects(projectsCopy);
          setActiveProject(prevActiveProject => ({ ...prevActiveProject, tasks: res.data.tasks }));
          dispatch({ type: 'fetchingTasks', payload: false })
        })
        .catch(err => setResponseError(err, dispatch))
      }
    }
  }

  // eslint-disable-next-line
  useEffect(() => { fetchUser()     }, [user])  // eslint-disable-next-line
  useEffect(() => { fetchProjects() }, [user, state.fetchingProjects]); // eslint-disable-next-line
  useEffect(() => { fetchTasks()    }, [activeProject, state.fetchingTasks]);

  useEffect(() => // hide notification
  {
    const timer = setTimeout(() => { if (state.notificationShown) dispatch({ type: 'notificationShown', payload: false }) }, 5000);
    return () => {clearTimeout(timer)};
  }, [state.notificationShown])

  return (
    <div className="app" id='app'>
      <UserContext.Provider value={{ user, setUser }}>
        <ProjectsContext.Provider value={{ projects, setProjects, activeProject, setActiveProject }}>
          <ReducerContext.Provider value={{ state, dispatch }}>
              <AnimateTransit children={ state.notificationShown && <Notification/> }/>
              <AnimateTransit children={ state.confirmationShown && <Confirmation/> }/>
              
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
