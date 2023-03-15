import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencil } from '@fortawesome/free-solid-svg-icons';

export default function ProjectsItem({ tasksItem })
{
  return (
    <li className="tasks-list-item">
      <div className="list-item-text">{ tasksItem.text }</div>
      <div className="list-item-options"><FontAwesomeIcon icon={ faPencil }/></div>
    </li>
  )
}