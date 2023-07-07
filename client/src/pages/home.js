import React, { useState, useContext } from 'react'
import { ReducerContext, FlagsContext } from '../app';

import Menu from '../components/home/menu/menu';
import Dashboard from '../components/home/dashboard/dashboard';
import ProjCreator from '../components/home/proj-creator/proj-creator';
import Editor from '../components/home/editor/editor';
import Confirmation from '../components/home/confirmation/confirmation';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';

export const ToggleMenuContext = React.createContext();
export const EditorContext = React.createContext();
export const ScrollContext = React.createContext();

export default function HomePage()
{
  const { dispatch } = useContext(ReducerContext);
  const { loading } = useContext(FlagsContext);

  const [editorParams, setEditorParams] = useState({ x: 0, y: 0, w: 0, h: 0 });
  const [editorData, setEditorData] = useState(null);
  const [editorShown, setEditorShown] = useState(false);
  const [scrollTo, setScrollTo] = useState(0);

  function toggleMenu()
  { 
    dispatch({ type: 'menuHidden'      });
    dispatch({ type: 'dashboardMoved'  });
    dispatch({ type: 'searchbarSpaced' });  
  }

  if (loading)
  {
    return (
      <div className="loading">
        <img src="img/loading.svg" alt=""/>
      </div>
    )
  }

  else
  {
    return (
      <>
        <div className='dashboard__burger' id="dashboard__burger" onClick={ toggleMenu }>
          <FontAwesomeIcon icon={ faBars }/>
        </div>

        <Confirmation/>

        <ToggleMenuContext.Provider value={{ toggleMenu }}>
          <ProjCreator/>
          <Menu/>

           <EditorContext.Provider value={{ editorShown, setEditorShown, editorParams, setEditorParams, editorData, setEditorData }}>
            <ScrollContext.Provider value={{ scrollTo, setScrollTo }}>
              <Dashboard/>
              <Editor/>
            </ScrollContext.Provider>
          </EditorContext.Provider>
        </ToggleMenuContext.Provider>
      </>
    )
  }
}