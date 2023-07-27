import React, { useContext } from "react";
import { ProjectsContext } from "app";

import AddTask from "./add-task/add-task";
import Task from '../task/task'
import List from 'components/utils/list/list';

export default function Card({ type })
{
  const { activeProject } = useContext(ProjectsContext); 

  const tasksFiltered = Array.isArray(activeProject.tasks) 
    ? activeProject.tasks.filter(task => task.type === type.id).sort((a, b) => {return a.position - b.position})
    : [];

  return (
    <div className="card" id={ type.name }>
      <h2 className="card__header">{ type.name.toUpperCase() }</h2>  
      { activeProject?.tasks && <List classes='card__list' ids={`list--${type.id}`} elements={ tasksFiltered } ListItem={ Task } /> }
      <AddTask type={ type }/>
    </div>
  )
}