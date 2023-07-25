import { useContext } from 'react';
import { ReducerContext } from 'app';

import { ButtonGlow } from 'components/utils/buttons/buttons';

import { faXmark } from '@fortawesome/free-solid-svg-icons';

export default function MenuHeader()
{
  const { dispatch } = useContext(ReducerContext);

  return (
    <div className='menu__header'>
      <a className='menu__logo' href='/'><img src='img/logo--dark_theme.svg' alt='urotasks_logo'/></a>  
      <ButtonGlow onClick={ () => {dispatch({ type: 'menuShown', payload: false })} } icon={ faXmark }/>
    </div>
  )
}