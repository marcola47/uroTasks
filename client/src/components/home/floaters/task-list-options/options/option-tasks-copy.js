import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClone } from '@fortawesome/free-solid-svg-icons';

export default function OptionCopyTasks()
{
  return (
    <div className="option">
      <FontAwesomeIcon icon={ faClone }/>
      <span>Copy all tasks</span>
    </div>
  )
}