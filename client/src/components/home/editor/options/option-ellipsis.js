import { useContext } from 'react';
import { ReducerContext } from 'app';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisVertical } from '@fortawesome/free-solid-svg-icons';

export default function OptionEllipsis()
{
  const { dispatch } = useContext(ReducerContext);

  return (
    <div className='option option--ellipsis' onClick={ () => {dispatch({ type: 'setEditor', payload: { params: null, dat: null } })} }>
      <div className='option__icon'><FontAwesomeIcon icon={ faEllipsisVertical }/></div>
    </div>
  )
}