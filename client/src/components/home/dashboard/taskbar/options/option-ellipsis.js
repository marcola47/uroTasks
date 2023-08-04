import { useContext } from 'react';
import { ReducerContext } from "app";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisVertical } from '@fortawesome/free-solid-svg-icons';

export default function OptionFilter()
{
  const { dispatch } = useContext(ReducerContext);

  return (
    <div className="taskbar__option taskbar__option--filter" onClick={ () => {dispatch({ type: 'setProjOptions', payload: 'start' })} }>
      <FontAwesomeIcon icon={ faEllipsisVertical }/>
    </div>
  )
}