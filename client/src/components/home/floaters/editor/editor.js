import React, { useState, useContext, useEffect, useRef } from 'react';
import { ProjectsContext, ReducerContext } from 'app';

import { TransitionOpacity } from 'components/utils/transitions/transitions';
import EditorTags from './tags/tags';
import EditorText from './editor-text/editor-text';
import EditorDueDate from './badges/due-date';

import OptionEllipsis from './options/option-ellipsis'
import OptionTags from './options/option-tags';
import OptionType from './options/option-type';
import OptionPosition from './options/option-position';  
import OptionDates from './options/option-dates';
import OptionDelete from './options/option-delete';

export const SubMenusContext = React.createContext();

export default function Editor()
{
  const { activeProject } = useContext(ProjectsContext);
  const { state, dispatch } = useContext(ReducerContext);
  const task = activeProject.tasks.find(task => task.id === state.editor.data)
  
  const [bottom, setBottom] = useState(0);
  const [subMenus, setSubMenus] = useState({ tags: false, types: false, dates: false })
  
  const optionsRef = useRef(null);

  const editorStyle = 
  {
    left: state.editor.params?.x ?? 0, 
    top: state.editor.params?.y ?? 0,
    width: state.editor.params?.w ?? 0,
    minHeight: state.editor.params?.h ?? 0
  } 

  useEffect(() => // make options never be out of bounds
  {
    if (optionsRef)
    {
      const optionsRect = optionsRef.current.getBoundingClientRect();
      setBottom(window.innerHeight - optionsRect.bottom);
    }
  }, [optionsRef])

  const optionsStyle = bottom < 0 
    ? { top: (bottom - 16) } 
    : {}

  return (
    <TransitionOpacity onClick={ () => {dispatch({ type: 'setEditor', payload: { params: null, data: null } })} } id='editor'>
    {
      state.editor.data && // many errors when not doing this
      <div className="editor" style={ editorStyle } onClick={ e => {e.stopPropagation()} }>
        <div className="editor__content">
          <EditorTags task={ task }/>
          <EditorText task={ task }/> 
        </div>

        <div className="editor__badges">
          { task.due_date && <EditorDueDate task={ task }/> }
        </div>

        <div className="options" ref={ optionsRef } style={ optionsStyle }>
          <SubMenusContext.Provider value={{ subMenus, setSubMenus }}>
            <OptionEllipsis/>
            <OptionTags task={ task }/>
            <OptionType task={ task }/>
            <OptionPosition task={ task }/>
            <OptionDates task={ task }/>
            <OptionDelete task={ task }/>
          </SubMenusContext.Provider>
        </div>
      </div>
    }
    </TransitionOpacity>
  )
}