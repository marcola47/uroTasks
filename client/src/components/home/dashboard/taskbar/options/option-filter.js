import { useContext } from 'react';
import { ReducerContext } from "app";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilter, faXmark } from '@fortawesome/free-solid-svg-icons';

export function OptionFilterActive()
{
  const { dispatch } = useContext(ReducerContext);

  return (
    <div className="taskbar__filter-active">
      <div 
        className='show' 
        onClick={ () => dispatch({ type: 'setProjOptions', payload: 'filter' }) }
        children={ <FontAwesomeIcon icon={ faFilter }/> }
      /> 
      
      <div 
        className='clear' 
        onClick={ () => dispatch({ type: 'setFilters', payload: { keywords: '', date: null, tags: [] } }) }
        children={ <FontAwesomeIcon icon={ faXmark }/> }
      /> 
    </div>
  )
}

export default function OptionFilter()
{
  const { dispatch } = useContext(ReducerContext);

  return (
    <div 
      className="taskbar__option taskbar__option--filter" 
      onClick={ () => dispatch({ type: 'setProjOptions', payload: 'filter' }) }
      children={ <FontAwesomeIcon icon={ faFilter }/> }
    /> 
  )
}