import TasksItem from './list-item';

function TasksItemsList({ tasks })
{
  return tasks.map(task => {return <TasksItem tasksItem={ task } key={ task.id }/>})
}

export default function TasksList({ tasks })
{
  return (
    <ul className='dashboard-tasks-list'>
      {(tasks.length > 0) ? <TasksItemsList tasks={ tasks }/>  : <li className='tasks-list-item'></li>}
    </ul>
  )
}