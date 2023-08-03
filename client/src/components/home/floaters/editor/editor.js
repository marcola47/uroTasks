import React, { useState, useContext, useEffect, useRef } from 'react';
import { ReducerContext } from 'app';

import { TransitionOpacity } from 'components/utils/transitions/transitions';
import EditorTags from './tags/tags';
import EditorText from './editor-text/editor-text';
import OptionEllipsis from './options/option-ellipsis'
import OptionTags from './options/option-tags';
import OptionType from './options/option-type';
import OptionPosition from './options/option-position';  
import OptionDelete from './options/option-delete';

export const SubMenusContext = React.createContext();

export default function Editor()
{
  const { state, dispatch } = useContext(ReducerContext);
  
  const [bottom, setBottom] = useState(0);
  const [subMenus, setSubMenus] = useState({ tags: false, types: false })
  
  const optionsRef = useRef(null);

  const editorStyle = 
  {
    left: state.editorParams?.x ?? 0, 
    top: state.editorParams?.y ?? 0,
    width: state.editorParams?.w ?? 0,
    minHeight: state.editorParams?.h ?? 0
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
      state.editorData && // many errors when not doing this
      <div className="editor" style={ editorStyle } onClick={ e => {e.stopPropagation()} }>
        <div className='editor__position'>{ state.editorData?.position }</div>

        <div className="editor__content">
          <EditorTags task={ state.editorData }/>
          <EditorText/> 
        </div>

        <div className="options" ref={ optionsRef } style={ optionsStyle }>
          <SubMenusContext.Provider value={{ subMenus, setSubMenus }}>
            <OptionEllipsis/>
            <OptionTags task={ state.editorData }/>
            <OptionType task={ state.editorData }/>
            <OptionPosition task={ state.editorData }/>
            <OptionDelete task={ state.editorData }/>
          </SubMenusContext.Provider>
        </div>
      </div>
    }
    </TransitionOpacity>
  )
}