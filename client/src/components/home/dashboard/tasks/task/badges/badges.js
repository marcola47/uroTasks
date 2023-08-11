import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock } from '@fortawesome/free-solid-svg-icons';

export default function TaskBadges({ task })
{
  function DueDate()
  {
    let className = '';

    return (
      <div className={`task__due-date ${className}`}>
        <FontAwesomeIcon icon={ faClock }/>
      </div>
    )
  }

  return (
    <div className="task__badges">

    </div>
  )
}

