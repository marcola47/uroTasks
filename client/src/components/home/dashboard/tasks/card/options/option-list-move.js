import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowsLeftRight } from '@fortawesome/free-solid-svg-icons';

export default function OptionMoveList()
{
  return (
    <div className="option">
      <FontAwesomeIcon icon={ faArrowsLeftRight }/>
      <span>Move list</span>
    </div>
  )
}