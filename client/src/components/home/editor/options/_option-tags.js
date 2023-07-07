/*import { useContext } from 'react';
import { ScrollContext } from '../../../../pages/home';
import { ToggleEditorContext } from '../editable-task';*/

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTag } from '@fortawesome/free-solid-svg-icons';

export default function OptionTags({ task })
{
  return (
    <div className='option option--tags'>
      <div className='option__icon'><FontAwesomeIcon icon={ faTag }/></div>
    </div>
  )
}