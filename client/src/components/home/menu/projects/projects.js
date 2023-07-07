import { useContext } from 'react';
import { ProjectsContext, ReducerContext } from '../../../../app';
import { ToggleMenuContext } from '../../../../pages/home';

import { ButtonGlow } from '../../../utils/buttons';
import List from '../../../utils/list';
import Project from './_project';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronUp, faPlus } from '@fortawesome/free-solid-svg-icons';

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