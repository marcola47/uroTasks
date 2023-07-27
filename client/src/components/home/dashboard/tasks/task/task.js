import React, { useContext, useRef } from 'react';
import { EditorContext } from 'pages/home';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisVertical } from '@fortawesome/free-solid-svg-icons';

export default function Task({ itemData })
{
  const taskRef = useRef();

  const { setEditorShown, setEditorParams, setEditorData } = useContext(EditorContext);

  function toggleOptions()
  { 
    let taskRect = taskRef.current.getBoundingClientRect();
    let offsetX = taskRect.left + window.scrollX + taskRef.current.scrollLeft;
    let offsetY = taskRect.top + window.scrollY + taskRef.current.scrollTop;
    let width = taskRef.current.clientWidth - 46;
    let height = taskRef.current.offsetHeight;
 
    setEditorShown(true);
    setEditorData(itemData);
    setEditorParams({ x: offsetX, y: offsetY, w: width, h: height })
  }

  return (
    <li className="task" id={ itemData?.id } ref={ taskRef }>
      <div className='task__position'>{ itemData?.position }</div>

      <div className='task__text'>{ itemData?.content }</div>
      
      <div className='task__options' onClick={ toggleOptions }>
        <div className='task__options__icon'><FontAwesomeIcon icon={ faEllipsisVertical }/></div>
      </div>
    </li>
  )
}