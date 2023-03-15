import { useContext, useRef } from 'react';
import { ActiveProjectContext, ShowTaskCreatorContext } from "../../app";
import { v4 } from 'uuid';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark, faBarsProgress } from "@fortawesome/free-solid-svg-icons";

export default function GetTaskData()
{
  const {activeProject, setActiveProject} = useContext(ActiveProjectContext);
  const showTaskCreator = useContext(ShowTaskCreatorContext);
  
  const taskTextRef = useRef();
  const taskTypeRef = useRef();

  function createTask()
  {
    let text = taskTextRef.current.value;
    let type = taskTypeRef.current.value;
    if (text === '') return;

    const activeProjectCopy = { ...activeProject };
    const newTask = { id: v4(), text: text };

    activeProjectCopy[type].push(newTask)

    setActiveProject(activeProjectCopy);
    showTaskCreator();

    taskTextRef.current.value = '';
  }

  return (
    <div className="tasks-creator-background" id="tasks-creator-background">
      <div className="tasks-creator" id="tasks-creator">
        <h2 className="creator-title">CREATE TASK <FontAwesomeIcon icon={ faBarsProgress }/> </h2>
        <div className='btn-close' onClick={ showTaskCreator }> <FontAwesomeIcon icon={ faXmark }/> </div>

        <input className="creator-input" id="input-1" ref={ taskTextRef } type="text" placeholder="Name of the task"/>
        <div id="input-2" type="text" placeholder="Color (#f0f0f0)">
          <select name='location' className="creator-input" defaultValue={"todo"} ref={ taskTypeRef }>
            <option value="todo">To-do</option>
            <option value="doing">Doing</option>
            <option value="done">Done</option>
          </select>
        </div>
        <button className="creator-btn" onClick={ createTask }>CONFIRM</button>
      </div>
    </div>
  )
}