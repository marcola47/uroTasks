import { useContext } from 'react';
import { ReducerContext } from 'app';

import { ButtonGlow } from 'components/utils/buttons/buttons';

import { faXmark } from '@fortawesome/free-solid-svg-icons';

export default function MenuHeader()
{
  const { dispatch } = useContext(ReducerContext);

  return (
    <div className='menu__header'>
      <a 
        className='menu__logo' 
        href='/'
        children={ <img src='img/logo--written--dark.svg' alt='urotasks_logo'/> }
      />
      
      <ButtonGlow 
        onClick={ () => {dispatch({ type: 'menuShown', payload: false })} } 
        icon={ faXmark }
      />
    </div>
  )
}