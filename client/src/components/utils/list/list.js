import React, { useRef, useLayoutEffect } from 'react';
import { v4 as uuid } from 'uuid';

function List({ elements, ListItem, classes = "", ids = "" })
{
  const listRef = useRef(null);

  // don't judge me
  useLayoutEffect(() => 
  {
    const listElement = listRef.current;
    const storedScrollOffsetY = sessionStorage.getItem(`${ids}:scroll_y`);
    
    if (listElement)
      listElement.scrollTop = Number(storedScrollOffsetY);

  }, []);

  // don't judge me
  function handleScroll() 
  {
    const listElement = listRef.current;
    
    if (listElement)
    {
      const scrollOffsetY = listElement.scrollTop;
      sessionStorage.setItem(`${ids}:scroll_y`, scrollOffsetY);
    }
  };

  return (
    <ul className={ classes } id={ ids } ref={ listRef } onScroll={ handleScroll }>
      { elements.map(element => { return <ListItem itemData={ element } key={ element.id ?? uuid() }/> }) }
    </ul>
  )
}

const MemoizedList = React.memo(List);
export default MemoizedList;