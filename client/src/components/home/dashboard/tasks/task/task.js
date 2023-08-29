import React, { useContext, useRef } from 'react';
import { ReducerContext } from 'app';
import { Draggable } from 'react-beautiful-dnd';

import TaskTags from './tags/tags';
import TaskDueDate from './badges/due-date';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisVertical } from '@fortawesome/free-solid-svg-icons';

export default function Task({ itemData: task })
{
  const { dispatch } = useContext(ReducerContext);
  const taskRef = useRef(null);
  const badgesRef = useRef(null);
 
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
      payload: { params: params, data: task.id }
    })
  }

  return (
    <Draggable draggableId={ task.id } index={ task.position }>
    {
      (provided) => 
      (
        <li 
          className="task" 
          id={ task?.id } 
          onContextMenu={ e => {toggleOptions(e)} }
          ref={ el => {taskRef.current = el; provided.innerRef(el)} } 
          { ...provided.draggableProps }
          { ...provided.dragHandleProps }
        >
           <div className='task__position'>{ task?.position + 1 }</div>
          <TaskTags task={ task }/>
    
          <div className='task__text'>
            { task?.content }
          </div>
          
          <div className='task__options' onClick={ e => {toggleOptions(e)} }>
            <FontAwesomeIcon icon={ faEllipsisVertical }/>
          </div>

          <div className="task__badges" ref={ badgesRef } style={ badgesRef.current?.children.length > 0 ? { marginBottom: '8px' } : {} }>
            { task.due_date && <TaskDueDate task={ task }/> }
          </div>
        </li>
      )
    }
    </Draggable>
  )
}