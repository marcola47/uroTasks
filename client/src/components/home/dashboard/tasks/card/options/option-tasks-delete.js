import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

export default function OptionDeleteTasks()
{
  return (
    <div className="option option--danger">
      <FontAwesomeIcon icon={ faTrash }/>
      <span>Delete all tasks</span>
    </div>
  )
}