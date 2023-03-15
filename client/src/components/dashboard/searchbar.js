import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';

export default function Searchbar()
{
  return (
    <div className="dashboard-searchbar searchbar-when-menu-shown" id="dashboard-searchbar">
      <FontAwesomeIcon icon={ faMagnifyingGlass }/>
      <input type="text" placeholder="Seach tasks, tags or projects"/>
    </div>
  )
}