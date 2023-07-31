import React, { useState, useContext, useEffect, useRef } from "react";
import { ProjectsContext } from "app";

import Task from '../task/task'
import CardHeader from "./card-header/card-header";
import OptionSort from "./options/option-sort";
import OptionFilter from "./options/option-filter";
import OptionMoveTasks from "./options/option-tasks-move";
import OptionCopyTasks from "./options/option-tasks-copy";
import OptionArchiveTasks from "./options/option-tasks-archive";
import OptionDeleteTasks from "./options/option-tasks-delete";
import OptionMoveList from "./options/option-list-move";
import OptionCopyList from "./options/option-list-copy";
import OptionArchiveList from "./options/option-list-archive";
import OptionDeleteList from "./options/option-list-delete";
import List from 'components/utils/list/list';
import AddTask from "./add-task/add-task";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsis } from '@fortawesome/free-solid-svg-icons';

export const OptionsContext = React.createContext();

export default function Card({ type })
{
  const [optionsShown, setOptionsShown] = useState(false);
  const { activeProject } = useContext(ProjectsContext); 
  const optionsRef = useRef(null);

  const tasksFiltered = Array.isArray(activeProject.tasks) 
    ? activeProject.tasks.filter(task => task.type === type.id).sort((a, b) => {return a.position - b.position})
    : [];

  // useEffect(() => 
  // {
  //   function handleClickOutside(event)
  //   {
  //     if (optionsRef.current && !optionsRef.current.contains(event.target))
  //       setOptionsShown(false);
  //   }

  //   if (optionsShown) 
  //     document.addEventListener("click", handleClickOutside);
    
  //   return () => { document.removeEventListener("click", handleClickOutside) }
  // }, [optionsShown]);

  return (
    <div className="card" id={ type.name }>
      <CardHeader type={ type }/>

      <div className="options__container" ref={ optionsRef }>
        <div className='options__toggle' onClick={ () => {setOptionsShown(!optionsShown)} }>
          <div><FontAwesomeIcon icon={ faEllipsis }/></div>
        </div>

        <div className={`options ${optionsShown ? 'options--shown' : ''}`} >
          <OptionsContext.Provider value={{ optionsShown, setOptionsShown }}>
            <OptionSort type={ type }/>
            <OptionFilter type={ type }/>
            <div className="separator"/>
            <OptionMoveTasks type={ type }/>
            <OptionCopyTasks type={ type }/>
            <OptionArchiveTasks type={ type }/>
            <OptionDeleteTasks type={ type }/>
            <div className="separator"/>
            <OptionMoveList type={ type }/>
            <OptionCopyList type={ type }/>
            <OptionArchiveList type={ type }/>
            <OptionDeleteList type={ type }/>
          </OptionsContext.Provider>
        </div>
      </div>

      { 
        activeProject?.tasks && 
        <List 
          classes='card__list'
          ids={`list--${type.id}`} 
          elements={ tasksFiltered } 
          ListItem={ Task } 
        /> 
      }

      <AddTask type={ type }/>
    </div>
  )
}