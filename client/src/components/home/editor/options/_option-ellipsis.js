import { useContext } from 'react';
import { ToggleEditorContext } from '../editor';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisVertical } from '@fortawesome/free-solid-svg-icons';

export default function OptionTags()
{
  const toggleEditor = useContext(ToggleEditorContext);

  return (
    <div className='option option--ellipsis' onClick={ toggleEditor }>
      <div className='option__icon'><FontAwesomeIcon icon={ faEllipsisVertical }/></div>
    </div>
  )
}