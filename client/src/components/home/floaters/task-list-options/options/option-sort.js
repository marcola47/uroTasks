import { useContext } from 'react';
import { ReducerContext } from 'app';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSort } from '@fortawesome/free-solid-svg-icons';

export default function OptionSort()
{
  const { dispatch } = useContext(ReducerContext);

  function toggleSortMenu()
  {
    dispatch(
    { 
      type: 'setTaskListOptions', 
      payload: { params: null, data: null } 
    })
    
    dispatch(
    {
      type: 'setProjOptions', 
      payload: 'sort' 
    })
  }

  return (
    <div 
      className="option" 
      onClick={ toggleSortMenu }
    >
      <FontAwesomeIcon icon={ faSort } />
      <span>Sort by</span>
    </div>
  )
}