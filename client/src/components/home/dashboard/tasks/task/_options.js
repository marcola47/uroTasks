import React, { useState, useContext } from 'react';
import { ReducerContext } from '../../../../../app';
import { EditorContext } from '../../../../../pages/home';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisVertical } from '@fortawesome/free-solid-svg-icons';

export default function TaskOptions({ task, taskRef })
{
  const { setEditorShown, setEditorParams, setEditorData } = useContext(EditorContext);
  const { state } = useContext(ReducerContext);

  function toggleOptions()
  { 
    let offsetX = taskRef.current.offsetLeft;
    let offsetY = taskRef.current.offsetTop;
    let width = taskRef.current.clientWidth - 46;
    let height = taskRef.current.offsetHeight;

    if (!state.isMenuHidden)
      offsetX += 420;

    setEditorShown(true);
    setEditorData(task);
    setEditorParams({ x: offsetX, y: offsetY, w: width, h: height })
  }

  return (
    <div className='task__options' onClick={ toggleOptions }>
      <div className='task__options__icon'><FontAwesomeIcon icon={ faEllipsisVertical }/></div>
    </div>
  )
}