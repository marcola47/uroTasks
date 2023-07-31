import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArchive } from '@fortawesome/free-solid-svg-icons';

export default function OptionArchiveTasks()
{
  return (
    <div className="option option--caution">
      <FontAwesomeIcon icon={ faArchive }/>
      <span>Archive all tasks</span>
    </div>
  )
}