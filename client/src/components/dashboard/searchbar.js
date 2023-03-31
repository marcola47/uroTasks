import { useContext } from 'react';
import { UIReducerContext } from '../../app';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';

export default function Searchbar()
{
  const { state_ui } = useContext(UIReducerContext);

  return (
    <>
      <div className={`dashboard-searchbar ${state_ui.isSearchbarSpaced ? '' : 'searchbar-when-menu-shown'}`} id="dashboard-searchbar"> 
        <FontAwesomeIcon icon={ faMagnifyingGlass }/> 
        <input type="text" placeholder="Seach tasks, tags or projects"/>
      </div> 
    </>
  )
}