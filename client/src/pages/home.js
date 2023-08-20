import { useContext } from 'react'
import { ReducerContext } from 'app';

import { AnimateTransit } from 'components/utils/transitions/transitions';
import Menu from '../components/home/menu/menu';
import Dashboard from '../components/home/dashboard/dashboard';
import Editor from '../components/home/floaters/editor/editor';
import TaskListOptions from 'components/home/floaters/task-list-options/task-list-options';
import ProjCreator from '../components/home/floaters/proj-creator/proj-creator';
import ProjOptions from 'components/home/floaters/proj-options/proj-options';
import { Screensaver } from 'components/home/dashboard/screensaver/screensaver';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';

export default function HomePage()
{
  const { state, dispatch } = useContext(ReducerContext);

  if (state.fetchingProjects)
    return <Screensaver/>

  return (
    <>
      <Menu/>
      <Dashboard/>

      <AnimateTransit children={ state.projCreatorShown && <ProjCreator/> }/>
      <AnimateTransit children={ state.projOptions && <ProjOptions/> }/>
      <AnimateTransit children={ state.editor.params && <Editor/> }/>
      <AnimateTransit children={ state.taskListOptions.params && <TaskListOptions/> }/>

      <div className='dashboard__burger' onClick={ () => {dispatch({ type: 'menuShown', payload: true })} }>
        <FontAwesomeIcon icon={ faBars }/>
      </div>
    </>
  )
}