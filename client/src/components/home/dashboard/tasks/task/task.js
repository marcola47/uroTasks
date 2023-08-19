import React, { useContext, useRef } from 'react';
import { ReducerContext } from 'app';
import { Draggable } from 'react-beautiful-dnd';

import TaskTags from './tags/tags';
import TaskDueDate from './badges/due-date';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisVertical } from '@fortawesome/free-solid-svg-icons';

export default function Task({ itemData })
{
  const { dispatch } = useContext(ReducerContext);
  const taskRef = useRef();
 
  function toggleOptions(e)
  { 
    e.preventDefault();
    const params = {};

    let taskRect = taskRef.current.getBoundingClientRect();
    params.x = taskRect.left + window.scrollX + taskRef.current.scrollLeft;
    params.y = taskRect.top + window.scrollY + taskRef.current.scrollTop;
    params.w = taskRef.current.clientWidth - 46;
    params.h = taskRef.current.offsetHeight;
 
    dispatch(
    {
      type: 'setEditor',
      payload: { params: params, data: itemData.id }
    })
  }

  return (
    <Draggable draggableId={ itemData.id } index={ itemData.position }>
    {
      (provided) => 
      (
        <li 
          className="task" 
          id={ itemData?.id } 
          onContextMenu={ e => {toggleOptions(e)} }
          ref={ el => {taskRef.current = el; provided.innerRef(el)} } 
          { ...provided.draggableProps }
          { ...provided.dragHandleProps }
        >
           <div className='task__position'>{ itemData?.position }</div>
          <TaskTags task={ itemData }/>
    
          <div className='task__text'>
            { itemData?.content }
          </div>
          
          <div className='task__options' onClick={ e => {toggleOptions(e)} }>
            <FontAwesomeIcon icon={ faEllipsisVertical }/>
          </div>
    
          {
            itemData.due_date && // refactor to account for other badges
            <div className="task__badges">
              <TaskDueDate task={ itemData }/>
            </div>
          }
        </li>
      )
    }
    </Draggable>
  )
}