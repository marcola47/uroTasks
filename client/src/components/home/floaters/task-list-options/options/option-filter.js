import { useContext } from 'react';
import { ReducerContext } from 'app';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilter } from '@fortawesome/free-solid-svg-icons';

export default function OptionFilter()
{
  const { dispatch } = useContext(ReducerContext);

  function toggleFilterMenu()
  {
    dispatch(
    { 
      type: 'setTaskListOptions', 
      payload: 
      { 
        params: null, 
        data: null 
      } 
    })
    
    dispatch(
    {
      type: 'setProjOptions', 
      payload: 'filter' 
    })
  }

  return (
    <div 
      className="option" 
      onClick={ toggleFilterMenu }
    >
      <FontAwesomeIcon icon={ faFilter } />
      <span>Filter by</span>
    </div>
  )
}