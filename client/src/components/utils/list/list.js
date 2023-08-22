import React, { useRef, useLayoutEffect } from 'react';
import { v4 as uuid } from 'uuid';
import { Droppable } from 'react-beautiful-dnd';

export function List({ elements, ListItem, onClick, styles = null, classes = "", ids = "", unwrapped = false })
{
  const listRef = useRef(null);

  useLayoutEffect(() => 
  {
    const listElement = listRef.current;
    const storedScrollOffsetY = sessionStorage.getItem(`${ids}:y`);
    const storedScrollOffsetX = sessionStorage.getItem(`${ids}:x`);
    
    if (listElement)
    {
      listElement.scrollTop = Number(storedScrollOffsetY);
      listElement.scrollLeft = Number(storedScrollOffsetX);
    }

    // eslint-disable-next-line
  }, []);

  function handleScroll() 
  {
    const listElement = listRef.current;
    
    if (listElement)
    {
      const scrollOffsetY = listElement.scrollTop;
      const scrollOffsetX = listElement.scrollLeft;

      sessionStorage.setItem(`${ids}:y`, scrollOffsetY);
      sessionStorage.setItem(`${ids}:x`, scrollOffsetX);
    }
  }

  if (unwrapped)
    return <>{ elements.map(element => { return <ListItem itemData={ element } key={ element.id ?? uuid() }/> }) }</>

  return (
    <ul className={ classes } id={ ids } ref={ listRef } onScroll={ handleScroll } onClick={ onClick } styles={ styles }>
      { elements.map(element => { return <ListItem itemData={ element } key={ element.id ?? uuid() }/> }) }
    </ul>
  )
}

export function DroppableList({ droppableId, direction, type, extraChildren = null, onClick, elements, ListItem, className = '', styles = null })
{
  const listRef = useRef(null);

  useLayoutEffect(() => 
  {
    const listElement = listRef.current;
    const storedScrollOffsetY = sessionStorage.getItem(`${droppableId}:y`);
    const storedScrollOffsetX = sessionStorage.getItem(`${droppableId}:x`);
    
    if (listElement)
    {
      listElement.scrollTop = Number(storedScrollOffsetY);
      listElement.scrollLeft = Number(storedScrollOffsetX);
    }

    // eslint-disable-next-line
  }, []);

  function handleScroll() 
  {
    const listElement = listRef.current;
    
    if (listElement)
    {
      const scrollOffsetY = listElement.scrollTop;
      const scrollOffsetX = listElement.scrollLeft;

      sessionStorage.setItem(`${droppableId}:y`, scrollOffsetY);
      sessionStorage.setItem(`${droppableId}:x`, scrollOffsetX);
    }
  }

  return (
    <Droppable droppableId={ droppableId } direction={ direction } type={ type }>
    {
      (provided) =>
      (
        <div 
          className={ className }
          id={ droppableId } 
          ref={ el => {listRef.current = el; provided.innerRef(el)} }
          onScroll={ handleScroll } 
          onClick={ onClick } 
          styles={ styles }
          { ...provided.droppableProps }
        >
          { elements.map(element => { return <ListItem key={ element.id ?? uuid() } itemData={ element }/> }) }
          { provided.placeholder }
          { extraChildren }
        </div>
      )
    }
    </Droppable>
  )
}