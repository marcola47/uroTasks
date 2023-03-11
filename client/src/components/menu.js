//import { useState } from 'react';
import ProjectsList from './menu-projects';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark, faClock, faGear, faChevronDown, faPlus, faRightFromBracket } from '@fortawesome/free-solid-svg-icons';

export default function BurguerMenu({ onClick })
{
  function toggleProjects()
  {
    const chevronElement = document.querySelectorAll('.fa-chevron-down');
    chevronElement[0].classList.toggle('chevron-rotate');

    const projectsListElement = document.getElementById('menu-projects-list');
    projectsListElement.classList.toggle('menu-projects-list-shown')
  }

  return (
    <div className='burguer-menu' id='burguer-menu'>
      <div className='menu-header'>
        <h1 className='app-logo'><a href='/'><span className='highlight'>uro</span><span className="normal">Tasks</span></a></h1>
        <div className='menu-header-burguer-btn' onClick={onClick}><FontAwesomeIcon icon={faXmark}/></div>
      </div>
      
      <ul className='menu-upper'>
        <li className='menu-upper-item'><a href='/'><FontAwesomeIcon icon={faClock}/>Active Tasks</a></li>
        <li className='menu-upper-item'><a href='/'><FontAwesomeIcon icon={faGear}/>Settings</a></li>
      </ul>

      <div className='menu-projects'>
        <h2 className='menu-projects-header' onClick={toggleProjects}>Projects <FontAwesomeIcon icon={faChevronDown}/></h2>
        <div className='menu-projects-add'><FontAwesomeIcon icon={faPlus}/></div>
        
        <ProjectsList />
      </div>

      <div className='menu-user'>
        <div className='menu-user-pic'><img src='img/capybara.jpg' alt='user_pic'></img></div>
        <div className='menu-user-name'>Capybara</div>
        <div className='menu-user-signout'><FontAwesomeIcon icon={faRightFromBracket}/></div>
      </div>
    </div>
  )
}