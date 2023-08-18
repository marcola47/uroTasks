import React, { useContext, useRef, useLayoutEffect } from "react";
import { ProjectsContext } from "app";
import { DragDropContext, Droppable } from "react-beautiful-dnd";

import AddCard from "./add-card/add-card";
import Card from './card/card';

export default function Tasks()
{
  const { activeProject } = useContext(ProjectsContext);
  const typesOrdered = structuredClone(activeProject.types).sort((a, b) => {return a.position - b.position})
  const listRef = useRef(null);

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

  function onDragEnd() 
  {
    
    const sortedTypes = structuredClone(activeProject.types).sort((a, b) => { return a.position - b.position })
    console.log(sortedTypes)
    return true
  }

  return (
    <DragDropContext onDragEnd={ onDragEnd }>
      <Droppable droppableId="tasks" direction="horizontal">
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
            {/* change to an unwrapped list */}
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