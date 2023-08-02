import React, { useContext, useRef } from 'react';
import { ReducerContext } from 'app';

import TaskTags from './tags/tags';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisVertical } from '@fortawesome/free-solid-svg-icons';

export default function Task({ itemData })
{
  const { dispatch } = useContext(ReducerContext);
  const taskRef = useRef();
 
  function toggleOptions()
  { 
    const params = {};

    let taskRect = taskRef.current.getBoundingClientRect();
    params.x = taskRect.left + window.scrollX + taskRef.current.scrollLeft;
    params.y = taskRect.top + window.scrollY + taskRef.current.scrollTop;
    params.w = taskRef.current.clientWidth - 46;
    params.h = taskRef.current.offsetHeight;
 
    dispatch(
    {
      type: 'setEditor',
      payload: { params: params, data: itemData }
    })
  }

  return (
    <li className="task" id={ itemData?.id } ref={ taskRef }>
      <div className='task__position'>{ itemData?.position }</div>

      <TaskTags task={ itemData }/>

      <div className='task__text'>{ itemData?.content }</div>
      
      <div className='task__options' onClick={ toggleOptions }>
        <div className='task__options__icon'><FontAwesomeIcon icon={ faEllipsisVertical }/></div>
      </div>
    </li>
  )
}