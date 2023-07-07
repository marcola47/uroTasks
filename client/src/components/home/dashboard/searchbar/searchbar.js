import { useContext } from 'react';
import { ReducerContext } from '../../../../app';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';

export default function Searchbar()
{
  const { state } = useContext(ReducerContext);

  return (
    <>
      <div className={`searchbar ${state.isSearchbarSpaced ? '' : 'searchbar--menu-shown'}`} id="searchbar"> 
        <FontAwesomeIcon icon={ faMagnifyingGlass }/> 
        <input type="text" placeholder="Looking for something?"/>
      </div> 
    </>
  )
}