import React, { useContext } from 'react';
import TasksItem from './dashboard-tasks-item';

function TasksItemsList({ tasks })
{
  return tasks.map(task => {return <TasksItem tasksItem={task} key={task.id}/>})
}

export default function TasksList({ tasks })
{
  return (
    <ul className='dashboard-tasks-list'>
      <TasksItemsList tasks={tasks}/>
    </ul>
  )
}