import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSort } from '@fortawesome/free-solid-svg-icons';

export default function OptionSort()
{
  return (
    <div className="option">
      <FontAwesomeIcon icon={ faSort } />
      <span>Sort by</span>
    </div>
  )
}