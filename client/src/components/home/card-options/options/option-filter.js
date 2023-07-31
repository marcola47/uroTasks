import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilter } from '@fortawesome/free-solid-svg-icons';

export default function OptionFilter()
{
  return (
    <div className="option">
      <FontAwesomeIcon icon={ faFilter } />
      <span>Filter by</span>
    </div>
  )
}