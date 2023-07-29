import React, { useContext } from 'react'
import { ReducerContext } from 'app';
import { AnimatePresence } from 'framer-motion';

import Menu from '../components/home/menu/menu';
import Dashboard from '../components/home/dashboard/dashboard';
import ProjCreator from '../components/home/proj-creator/proj-creator';
import Editor from '../components/home/editor/editor';
import Screensaver from 'components/home/dashboard/screensaver/screensaver';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';

export const EditorContext = React.createContext();
export const ScrollContext = React.createContext();

export default function HomePage()
{
  const { state, dispatch } = useContext(ReducerContext);

  if (state.fetchingProjects)
    return <Screensaver/>

  return (
    <>
      <div className='dashboard__burger' id="dashboard__burger" onClick={ () => {dispatch({ type: 'menuShown', payload: true })} }>
        <FontAwesomeIcon icon={ faBars }/>
      </div>

      <Menu/>
      <Dashboard/>

      <AnimatePresence initial={ false } mode='wait' onExitComplete={ () => null }>
        { state.projCreatorShown && <ProjCreator/> }
        { state.editorParams && state.editorData && <Editor/> }
      </AnimatePresence>
    </>
  )
}