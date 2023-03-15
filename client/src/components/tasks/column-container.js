import TasksList from './list';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisVertical } from '@fortawesome/free-solid-svg-icons';

export default function ColumnContainer({ activeProject, taskType })
{
  return (
    <div className="dashboard-tasks-item">
      <h2 className="tasks-item-header">TO-DO</h2>
      <div className="tasks-item-options"><FontAwesomeIcon icon={ faEllipsisVertical }/></div>
      <TasksList tasks={ activeProject[taskType] }/>
    </div>
  )
}