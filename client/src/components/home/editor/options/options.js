import { useState, useEffect, useRef } from 'react';

import OptionEllipsis from './_option-ellipsis'
import OptionTags from './_option-tags';
import OptionType from './_option-type';
import OptionPosition from './_option-position';  
import OptionDelete from './_option-delete';

export default function TaskOptions({ task })
{
  const [bottom, setBottom] = useState(0);
  const optionsRef = useRef(null);

  useEffect(() => 
  {
    const optionsRect = optionsRef.current.getBoundingClientRect();
    setBottom(window.innerHeight - optionsRect.bottom);
  }, [task, optionsRef])

  const style = bottom < 0 
    ? { top: (bottom - 16) } 
    : {}

  return (
    <div className="options" ref={ optionsRef } style={ style }>
      <OptionEllipsis/>
      <OptionTags task={ task }/>
      <OptionType task={ task }/>
      <OptionPosition task={ task }/>
      <OptionDelete task={ task }/>
    </div>
  )
}