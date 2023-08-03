import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowsLeftRight } from '@fortawesome/free-solid-svg-icons';

export default function OptionMoveTasks()
{
  return (
    <div className="option">
      <FontAwesomeIcon icon={ faArrowsLeftRight }/>
      <span>Move all tasks</span>
    </div>
  )
}