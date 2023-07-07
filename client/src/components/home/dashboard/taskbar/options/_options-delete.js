import { useContext } from 'react';
import { ReducerContext } from "../../../../../app";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan } from '@fortawesome/free-solid-svg-icons';

export default function TaskbarDelete()
{
  const { state, dispatch } = useContext(ReducerContext);

  return (
    <div className={`option option--delete ${state.isConfirmationShown ? 'option--delete--active' : ''}`} onClick={ () => {dispatch({ type: 'confirmationShown' })} }>
      <FontAwesomeIcon icon={ faTrashCan }/>  
    </div>
  )
}