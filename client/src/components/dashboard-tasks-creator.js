import { useContext, useRef } from 'react';
import { ProjectsContext } from "../app";
import { v4 } from 'uuid';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark, faBarsProgress } from "@fortawesome/free-solid-svg-icons";

export default function GetTaskData({ activeProject, showTaskCreator })
{
  const {projects, setProjects, showProjectCreator} = useContext(ProjectsContext);
  
  const taskNameRef = useRef();

  function createTask()
  {
    let name = taskNameRef.current.value;
    if (name === '') return;
  }

  return (
    <div className="tasks-creator-background" id="tasks-creator-background">
      <div className="tasks-creator">
        <h2 className="creator-title">CREATE TASK <FontAwesomeIcon icon={faBarsProgress}/> </h2>
        <div className='btn-close' onClick={showTaskCreator}> <FontAwesomeIcon icon={faXmark}/> </div>

        <input className="creator-input" id="input-1" ref={taskNameRef} type="text" placeholder="Name of the task"/>
        <div id="input-2" ref={taskNameRef} type="text" placeholder="Color (#f0f0f0)">
          <select name='location' className="creator-input" defaultValue={"todo"}>
            <option value="todo">To-do</option>
            <option value="doing">Doing</option>
            <option value="done">Done</option>
          </select>
        </div>
        <button className="creator-btn" onClick={createTask}>CONFIRM</button>
      </div>
    </div>
  )
}