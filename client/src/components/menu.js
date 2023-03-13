import { useContext } from 'react';
import { ProjectsContext } from '../app';

import ProjectsList from './menu-projects-list';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark, faGear, faChevronDown, faPlus, faRightFromBracket } from '@fortawesome/free-solid-svg-icons';

export default function BurguerMenu({ onClick })
{
  const {projects, setProjects, showProjectCreator} = useContext(ProjectsContext);

  function toggleProjects()
  {
    const chevronElement = document.querySelectorAll('.fa-chevron-down');
    chevronElement[0].classList.toggle('chevron-rotate');

    const projectsListElement = document.getElementById('menu-projects-list');
    projectsListElement.classList.toggle('menu-projects-list-hidden')
  }

  return (
    <div className='menu' id='menu'>
      <div className='menu-header'>
        <h1 className='app-logo'><a href='/'><span className='highlight'>uro</span><span className="normal">Tasks</span></a></h1>
        <div className='btn-close' onClick={onClick}><FontAwesomeIcon icon={faXmark}/></div>
      </div>
      
      <ul className='menu-upper'>
        <li className='menu-upper-item'><a href='/'><FontAwesomeIcon icon={faGear}/>Settings</a></li>
      </ul>

      <div className='menu-projects'>
        <h2 className='menu-projects-header' onClick={toggleProjects}>Projects <FontAwesomeIcon icon={faChevronDown}/></h2>
        <div className='menu-projects-add' onClick={showProjectCreator}><FontAwesomeIcon icon={faPlus}/></div>
        
        <ProjectsList />
      </div>

      <div className='menu-user'>
        <a className='menu-user-data' href='/'>
          <div className='menu-user-pic'><img src='img/capybara.jpg' alt='user_pic'></img></div>
          <div className='menu-user-name'>Capybara</div>
        </a>
        <div className='menu-user-signout'><FontAwesomeIcon icon={faRightFromBracket}/></div>
      </div>
    </div>
  )
}