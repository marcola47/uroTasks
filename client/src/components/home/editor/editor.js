import React, { useState, useContext } from 'react';
import { EditorContext } from '../../../pages/home';

import EditorText from './_editor-text';
import Options from './options/options'

export const ToggleEditorContext = React.createContext();

export default function EditableTask()
{
  const { editorShown, setEditorShown, editorParams, setEditorParams, editorData, setEditorData } = useContext(EditorContext);

  const style = 
  {
    left: editorParams?.x ?? 0, 
    top: editorParams?.y ?? 0,
    width: editorParams?.w ?? 0,
    minHeight: editorParams?.h ?? 0
  }

  function toggleEditor()
  {
    setEditorShown(false);
    setEditorParams(null);
    setEditorData(null);
  }

  return (
    <>
      <div className={`editable ${editorShown ? 'editable--shown' : ''}`} style={ style }>
        <ToggleEditorContext.Provider value={ toggleEditor }>
        { 
          editorData 
          ? <><EditorText toggleEditor={ toggleEditor }/> <Options task={ editorData }/> </>
          : null 
        }
        </ToggleEditorContext.Provider>
      </div>

      <div className={`editable__bg ${editorShown ? 'editable__bg--shown' : ''}`} onClick={ toggleEditor }/>
    </>
  )
}