import React, { useContext, useRef } from "react";
import { ProjectsContext, ReducerContext } from "app";
import { Droppable, Draggable } from "react-beautiful-dnd";

import TaskListHeader from "./task-list-header/task-list-header";
import Task from '../task/task'
import AddTask from "./add-task/add-task";

import filterTasks from "operations/tasks-filter";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsis } from '@fortawesome/free-solid-svg-icons';

export const OptionsContext = React.createContext();

function TaskList({ type })
{
  const { activeProject } = useContext(ProjectsContext); 
  const { state, dispatch } = useContext(ReducerContext);
  const optionsRef = useRef(null);

  const filteredTasks = filterTasks(activeProject.tasks, state.filters, type.id);

  function toggleOptions()
  { 
    if (state.taskListOptions.data)
      dispatch({ type: 'setTaskListOptions', payload: { params: null, data: null } })
    
    else
    {
      const params = {};

      let optionsRect = optionsRef.current.getBoundingClientRect();
      params.x = optionsRect.left + window.scrollX + optionsRef.current.scrollLeft - 166;
      params.y = optionsRect.top + window.scrollY + optionsRef.current.scrollTop + 46;
  
      dispatch(
      {
        type: 'setTaskListOptions',
        payload: 
        { 
          params: params, 
          data: type 
        }
      })
    }
  }

  return (
    <Draggable draggableId={ type.id } index={ type.position }>
    {
      (provided) => 
      (
        <div 
          className="task-list" 
          id={ type.name } 
          ref={ provided.innerRef }
          { ...provided.draggableProps }
          { ...provided.dragHandleProps }
        >
          <TaskListHeader type={ type }/>

          <div className='options' onClick={ toggleOptions } ref={ optionsRef }>
            <FontAwesomeIcon icon={ faEllipsis }/>
          </div>

          <Droppable droppableId={ type.id } type="task-list">
          {
            (provided) =>
            (
              activeProject?.tasks &&
              <div 
                className="task-list__list"
                ref={ provided.innerRef }
                { ...provided.droppableProps }
              >
                { filteredTasks.map(listTask => { return <Task itemData={ listTask } key={ listTask.id }/> }) }
                { provided.placeholder }
              </div>
            )
          }
          </Droppable>

          <AddTask type={ type }/>
        </div>
      )
    }
    </Draggable>
  )
}

const MemoizedTaskList = React.memo(TaskList);
export default MemoizedTaskList;