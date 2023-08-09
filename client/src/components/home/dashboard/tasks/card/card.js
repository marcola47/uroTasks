import React, { useContext, useRef } from "react";
import { ProjectsContext, ReducerContext } from "app";

import CardHeader from "./card-header/card-header";
import Task from '../task/task'
import List from 'components/utils/list/list';
import AddTask from "./add-task/add-task";

import filterTasks from "functions/tasks-filter";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsis } from '@fortawesome/free-solid-svg-icons';

export const OptionsContext = React.createContext();

export default function Card({ type })
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
    <div className="card" id={ type.name }>
      <CardHeader type={ type }/>

      <div className='options' onClick={ toggleOptions } ref={ optionsRef }>
        <FontAwesomeIcon icon={ faEllipsis }/>
      </div>

      { 
        activeProject?.tasks && 
        <List 
          classes='card__list'
          ids={`list--${type.id}`} 
          elements={ filteredTasks } 
          ListItem={ Task }
        /> 
      }

      <AddTask type={ type }/>
    </div>
  )
}