import TaskbarHeader from './header/header';
import TaskbarOptions from './options/options';

export default function Taskbar()
{
  return (
    <div className="taskbar">
      <TaskbarHeader/>
      <TaskbarOptions/>
    </div>
  )
}