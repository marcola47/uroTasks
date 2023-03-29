import TasksColumnContainer from '../tasks/column-container';

export default function Tasks()
{
  return (
    <div className="dashboard-tasks" id="dashboard-tasks">
      <TasksColumnContainer taskType="todo"/>
      <TasksColumnContainer taskType="doing"/>
      <TasksColumnContainer taskType="done"/>
    </div>
  )
}