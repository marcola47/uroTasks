import { useContext } from 'react';
import { ReducerContext } from '../../../app';

import Header from './header/header';
import Projects from './projects/projects'
import User from './user/user';

export default function Menu()
{
  const { state } = useContext(ReducerContext);

  return (
    <div className={`menu ${state.isMenuHidden ? 'menu--hidden' : ''}`} id='menu'>
      <Header/>
      <Projects/>
      <User/>
    </div>
  )
}