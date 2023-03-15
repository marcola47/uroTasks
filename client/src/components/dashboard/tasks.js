import TasksColumnContainer from '../tasks/column-container';

export default function Tasks({ activeProject })
{
  return (
    <div className="dashboard-tasks" id="dashboard-tasks">
      <TasksColumnContainer activeProject={ activeProject } taskType="todo"/>
      <TasksColumnContainer activeProject={ activeProject } taskType="doing"/>
      <TasksColumnContainer activeProject={ activeProject } taskType="done"/>
    </div>
  )
}