import React, { useContext, useRef, useLayoutEffect } from "react";
import { ProjectsContext } from "app";

import AddCard from "./add-card/add-card";
import Card from './card/card';

export default function Tasks()
{
  const { activeProject } = useContext(ProjectsContext);
  const typesOrdered = activeProject.types.sort((a, b) => {return a.position - b.position})

  const listRef = useRef(null);

  // don't judge me
  useLayoutEffect(() => 
  {
    const listElement = listRef.current;
    const storedScrollOffsetX = sessionStorage.getItem(`list--${activeProject.id}:x`);
    
    if (listElement)
      listElement.scrollLeft = Number(storedScrollOffsetX);

  }, []);

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

  return (
    <div className="tasks" id="tasks" ref={ listRef } onScroll={ handleScroll }>
      { typesOrdered ? typesOrdered.map(type => {return <Card key={ type.id } type={ type }/>}) : null }
      <AddCard typesOrdered={ typesOrdered }/>
    </div>
  )
}