import React, { useContext } from 'react';
import { EditorContext } from 'pages/home';

import { TransitionOpacity } from 'components/utils/transitions/transitions';
import EditorText from './editor-text/editor-text';


export const ToggleEditorContext = React.createContext();

export default function Editor()
{
  const { setEditorShown, editorParams, setEditorParams, editorData, setEditorData } = useContext(EditorContext);

  const EditorStyle = 
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

  const [bottom, setBottom] = useState(0);
  const optionsRef = useRef(null);

  useEffect(() => // make options never be out of bounds
  {
    const optionsRect = optionsRef.current.getBoundingClientRect();
    setBottom(window.innerHeight - optionsRect.bottom);
  }, [task, optionsRef])

  const optionsStyle = bottom < 0 
    ? { top: (bottom - 16) } 
    : {}

  return (
    <TransitionOpacity onClick={ toggleEditor } id='editor'>
      <div className="editor" style={ editorStyle } onClick={ e => {e.stopPropagation()} }>
        <ToggleEditorContext.Provider value={{ toggleEditor }}>
          { 
            editorData && 
            <>
              <EditorText toggleEditor={ toggleEditor }/> 
              <div className="options" ref={ optionsRef } style={ optionsStyle }>
                <OptionEllipsis/>
                <OptionTags task={ task }/>
                <OptionType task={ task }/>
                <OptionPosition task={ task }/>
                <OptionDelete task={ task }/>
              </div>
            </> 
          }
        </ToggleEditorContext.Provider>
      </div>
    </TransitionOpacity>
  )
}