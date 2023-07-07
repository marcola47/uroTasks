import { useRef } from 'react';

import TaskOptions from './_options';

export default function TasksItem({ itemData })
{
  const taskRef = useRef();

  return (
    <li className="task" id={ itemData?.id } ref={ taskRef }>
      {/*<div className='task__position'>{ itemData?.position }</div> */}

      <div className='task__text'>{ itemData?.content }</div>
      <TaskOptions task={ itemData } taskRef={ taskRef }/>
    </li>
  )
}