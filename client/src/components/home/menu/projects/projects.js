import { useContext } from 'react';
import { ProjectsContext, ReducerContext, UserContext } from 'app';
import { ToggleMenuContext } from 'pages/home';
import axios, { setResponseError } from 'utils/axiosConfig';

import { ButtonGlow } from 'components/utils/buttons/buttons';
import List from 'components/utils/list/list';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronUp, faPlus, faSquare } from '@fortawesome/free-solid-svg-icons';

function Project({ itemData })
{ 
  const { user, setUser } = useContext(UserContext);
  const { state, dispatch } = useContext(ReducerContext);

  function activateProject()
  {
    if (itemData.id !== user.activeProject)
    {
      if (window.innerWidth < 1337 && state.isMenuShown === false)
      {
        dispatch({ type: 'menuHidden'      });
        dispatch({ type: 'dashboardMoved'  });
        dispatch({ type: 'searchbarSpaced' });  
      }  
  
      axios.post(`${process.env.REACT_APP_SERVER_ROUTE}/user/update?type=activeProject`, 
      {
        userID: user.id, 
        projectID: itemData.id,
        accessToken: localStorage.getItem("accessToken"),
        refreshToken: localStorage.getItem("refreshToken")
      })
      .then(_ => setUser({ ...user, activeProject: itemData.id }))
      .catch(err => setResponseError(err, dispatch))
    }
  }

  return (
    <li className='project' onClick={ activateProject }>
      <div className='project__data'>
        <span style={{ color: itemData?.color }}><FontAwesomeIcon icon={ faSquare }/></span> 
        <div className='project__name'>{ itemData?.name }</div>
      </div> 
  
      <div className='project__total-tasks'>{ itemData?.activeTasks < 100 ? itemData?.activeTasks : 99 }</div>
    </li>
  )
}

export default function MenuProjects()
{
  const { projects } = useContext(ProjectsContext);
  const { dispatch } = useContext(ReducerContext);
  const { toggleMenu } = useContext(ToggleMenuContext);

  function toggleProjCreator()
  {
    toggleMenu();
    dispatch({ type: 'projCreatorShown' });
  }
  
  function toggleProjectList()
  {
    const chevronElement = document.querySelectorAll('.fa-chevron-up')[0];
    chevronElement.classList.toggle('chevron-rotate');
  
    const projectsListElement = document.getElementById('projects__list');
    projectsListElement.classList.toggle('projects__list--hidden')
  }

  return (
    <div className='projects'>
      <h2 className='projects__header' onClick={ toggleProjectList }>Projects <FontAwesomeIcon icon={ faChevronUp }/></h2>
      <ButtonGlow onClick={ toggleProjCreator } icon={ faPlus } fontSize='1.5rem'/>
      <List elements={ projects } ListItem={ Project } classes="projects__list" ids="projects__list"/>
    </div>
  )
}