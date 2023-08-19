import React, { useContext, useRef, useLayoutEffect } from "react";
import { ProjectsContext, ReducerContext } from "app";
import axios, { setResponseError } from 'utils/axiosConfig'
import { DragDropContext, Droppable } from "react-beautiful-dnd";

import AddCard from "./add-card/add-card";
import Card from './card/card';

import repositionLists from "operations/lists-reposition";
import repositionTasks from "operations/tasks-reposition";

function Tasks()
{
  const { projects, setProjects, activeProject } = useContext(ProjectsContext);
  const { dispatch } = useContext(ReducerContext);

  const listRef = useRef(null);

  const typesOrdered = structuredClone(activeProject.types).sort((a, b) => {return a.position - b.position})

  // don't judge me
  useLayoutEffect(() => 
  {
    const listElement = listRef.current;
    const storedScrollOffsetX = sessionStorage.getItem(`list--${activeProject.id}:x`);
    
    if (listElement)
      listElement.scrollLeft = Number(storedScrollOffsetX);

  }, [activeProject.id]);

  // don't judge me
  function handleScroll() 
  {
    const listElement = listRef.current;
    
    if (listElement)
    {
      const scrollOffsetX = listElement.scrollLeft;
      sessionStorage.setItem(`list--${activeProject.id}:x`, scrollOffsetX);
    }
  };

  const onDragEnd = result =>
  {
    if (!result.destination || (result.destination.droppableId === result.source.droppableId && result.destination.index === result.source.index))
      return;

    const projectsContext = { projects, setProjects, activeProject };
    const opContext = { dispatch, result, axios, setResponseError }

    if (result.type === "type-list")
      repositionLists(projectsContext, opContext)

    else if (result.type === "task-list")
      repositionTasks(projectsContext, opContext)
  }

  return (
    <DragDropContext onDragEnd={ onDragEnd }>
      <Droppable droppableId="tasks" direction="horizontal" type="type-list">
      {
        (provided) => 
        (
          <div 
            className="tasks" 
            id="tasks" 
            ref={ el => {listRef.current = el; provided.innerRef(el)} }
            onScroll={ handleScroll }
            { ...provided.droppableProps }
          >
            { typesOrdered && typesOrdered.map(type => {return <Card key={ type.id } type={ type }/>}) }
            { provided.placeholder }
            <AddCard typesOrdered={ typesOrdered }/>
          </div>
        )
      }
      </Droppable>
    </DragDropContext>
  )
}

const MemoizedTasks = React.memo(Tasks);
export default MemoizedTasks;