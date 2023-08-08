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
        <div className='editor__position'>{ state.editor.data?.position }</div>

        <div className="editor__content">
          <EditorTags task={ state.editor.data }/>
          <EditorText/> 
        </div>

        <div className="options" ref={ optionsRef } style={ optionsStyle }>
          <SubMenusContext.Provider value={{ subMenus, setSubMenus }}>
            <OptionEllipsis/>
            <OptionTags task={ state.editor.data }/>
            <OptionType task={ state.editor.data }/>
            <OptionPosition task={ state.editor.data }/>
            <OptionDelete task={ state.editor.data }/>
          </SubMenusContext.Provider>
        </div>
      </div>
    }
    </TransitionOpacity>
  )
}