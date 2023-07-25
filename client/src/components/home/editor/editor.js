import React, { useContext } from 'react';
import { EditorContext } from 'pages/home';

import { TransitionOpacity } from 'components/utils/transitions/transitions';
import EditorText from './_editor-text';
import Options from './options/options'

export const ToggleEditorContext = React.createContext();

export default function Editor()
{
  const { setEditorShown, editorParams, setEditorParams, editorData, setEditorData } = useContext(EditorContext);

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
    <TransitionOpacity onClick={ toggleEditor } id='editor'>
      <div className="editor" style={ style } onClick={ e => {e.stopPropagation()} }>
        <ToggleEditorContext.Provider value={{ toggleEditor }}>
        { 
          editorData 
            ? <><EditorText toggleEditor={ toggleEditor }/> <Options task={ editorData }/></>
            : null 
        }
        </ToggleEditorContext.Provider>
      </div>
    </TransitionOpacity>
  )
}