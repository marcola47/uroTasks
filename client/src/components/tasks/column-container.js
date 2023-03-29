import React, { useState, useContext, useRef } from "react";
import { ActiveProjectContext } from "../../app";
import { v4 } from 'uuid';

import TasksList from './list';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisVertical, faPlus } from '@fortawesome/free-solid-svg-icons';

export default function ColumnContainer({ taskType })
{
  const { activeProject, setActiveProject } = useContext(ActiveProjectContext);
  const [editing, setEditing] = useState(false);
  const [inputValue, setInputValue] = useState("");

  const taskTextRef = useRef();

  let taskTypeName;
  switch(taskType)
  {
    case "todo":  taskTypeName = "TO-DO"; break;
    case "doing": taskTypeName = "DOING"; break;
    case "done":  taskTypeName = "DONE";  break;
    default: break;
  }

  function handleTextChange(newText) 
  { 
    const activeProjectCopy = { ...activeProject }
    activeProjectCopy[taskType].push({ id: v4(), text: newText });
    setActiveProject(activeProjectCopy);
  }

  function handleInputChange(e) 
  {
    setInputValue(e.target.value);
  }

  function handleSave() 
  {
    setEditing(false);

    if (taskTextRef.current.value !== '')
      handleTextChange(inputValue);
  }

  function handleKeyDown(e)
  {
    if (e.key === "Enter")
      handleSave();
    
    else if (e.key === "Escape")
    {
      setEditing(false);
      setInputValue('');
    }

  }

  return (
    <div className="dashboard-tasks-item">
      <h2 className="tasks-item-header">{taskTypeName}</h2>
      <div className="tasks-item-options"><FontAwesomeIcon icon={ faEllipsisVertical }/></div>
      <TasksList tasks={ activeProject[taskType] }/>
      <div className="add-task-container">
        {
          editing ? (<input autoFocus type="text" ref={taskTextRef} value={inputValue} onChange={handleInputChange} onBlur={handleSave} onKeyDown={handleKeyDown} />)
                  : (<button onClick={ () => {setEditing(true)} } className="btn-add-task"><FontAwesomeIcon icon={faPlus}/><span> Add task</span></button>)
        }
      </div>
    </div>
  )
}