import { useContext } from 'react';
import { UIReducerContext } from '../app';

import ProjectsList from './projects/list';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark, faChevronUp, faPlus, faRightFromBracket } from '@fortawesome/free-solid-svg-icons';

export default function BurguerMenu()
{
  const { state_ui, dispatch_ui } = useContext(UIReducerContext);

  function toggleMenu()
  { 
    dispatch_ui({ type: 'menuHidden'      });
    dispatch_ui({ type: 'dashboardMoved'  });
    dispatch_ui({ type: 'searchbarSpaced' });  
  }

  function toggleProjects()
  {
    const chevronElement = document.querySelectorAll('.fa-chevron-up')[0];
    chevronElement.classList.toggle('chevron-rotate');

    const projectsListElement = document.getElementById('menu-projects-list');
    projectsListElement.classList.toggle('menu-projects-list-hidden')
  }

  return (
    <div className={`menu ${state_ui.isMenuHidden ? 'menu-hidden' : ''}`} id='menu'>
      <div className='menu-header'>
        <h1 className='app-logo'><a href='/'><span className='highlight'>uro</span><span className="normal">Tasks</span></a></h1>
        <div className='btn-close' onClick={ toggleMenu }><FontAwesomeIcon icon={ faXmark }/></div>
      </div>

      <div className='menu-projects'>
        <h2 className='menu-projects-header' onClick={ toggleProjects }>Projects <FontAwesomeIcon icon={ faChevronUp }/></h2>
        <div className='menu-projects-add' onClick={ () => {dispatch_ui({ type: 'projectCreatorShown' })} }><FontAwesomeIcon icon={ faPlus }/></div>
        
        <ProjectsList />
      </div>

      <div className='menu-user'>
        <a className='menu-user-data' href='/'>
          <div className='menu-user-pic'><img src='img/capybara.jpg' alt='user_pic'></img></div>
          <div className='menu-user-name'>Capybara</div>
        </a>
        <div className='menu-user-signout'><FontAwesomeIcon icon={ faRightFromBracket }/></div>
      </div>
    </div>
  )
}