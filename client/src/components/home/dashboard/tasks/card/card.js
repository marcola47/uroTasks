import React, { useContext, useRef } from "react";
import { ProjectsContext, ReducerContext } from "app";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import axios, { setResponseError } from 'utils/axiosConfig';

import CardHeader from "./card-header/card-header";
import Task from '../task/task'
import AddTask from "./add-task/add-task";

import filterTasks from "operations/tasks-filter";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsis } from '@fortawesome/free-solid-svg-icons';

export const OptionsContext = React.createContext();

function Card({ type })
{
  const { activeProject } = useContext(ProjectsContext); 
  const { state, dispatch } = useContext(ReducerContext);
  const optionsRef = useRef(null);

  const filteredTasks = filterTasks(activeProject.tasks, state.filters, type.id);

  function toggleOptions()
  { 
    if (state.cardOptions.data)
      dispatch({ type: 'setCardOptions', payload: { params: null, data: null } })
    
    else
    {
      const params = {};

      let optionsRect = optionsRef.current.getBoundingClientRect();
      params.x = optionsRect.left + window.scrollX + optionsRef.current.scrollLeft - 166;
      params.y = optionsRect.top + window.scrollY + optionsRef.current.scrollTop + 46;
  
      dispatch(
      {
        type: 'setCardOptions',
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
          className="card" 
          id={ type.name } 
          ref={ provided.innerRef }
          { ...provided.draggableProps }
          { ...provided.dragHandleProps }
        >
          <CardHeader type={ type }/>

          <div className='options' onClick={ toggleOptions } ref={ optionsRef }>
            <FontAwesomeIcon icon={ faEllipsis }/>
          </div>

          <Droppable droppableId={ type.id } type="task-list">
          {
            (provided) =>
            (
              activeProject?.tasks &&
              <div 
                className="card__list"
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

const MemoizedCard = React.memo(Card);
export default MemoizedCard;