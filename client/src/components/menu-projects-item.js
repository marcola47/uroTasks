import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSquare } from '@fortawesome/free-solid-svg-icons';

export default function projectsItem({ menuProjectsItem })
{
  return (
    <li className='menu-projects-list-item'>
      <div className='item-name'>
        <span style={{color: menuProjectsItem.color}}><FontAwesomeIcon icon={faSquare}/></span> 
        <span>{menuProjectsItem.name}</span>
      </div> 
  
      <div className='total-tasks'>99</div>
    </li>
  )
}