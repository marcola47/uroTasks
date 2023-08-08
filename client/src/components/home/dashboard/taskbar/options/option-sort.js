import { useContext } from 'react';
import { ReducerContext } from "app";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowDownWideShort } from '@fortawesome/free-solid-svg-icons';

export default function OptionSort()
{
  const { dispatch } = useContext(ReducerContext);

  return (
    <div className="taskbar__option taskbar__option--sort" onClick={ () => {dispatch({ type: 'setProjOptions', payload: 'sort' })} }>
      <FontAwesomeIcon icon={ faArrowDownWideShort }/>
    </div>
  )
}