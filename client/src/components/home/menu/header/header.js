import { useContext } from 'react';
import { ToggleMenuContext } from '../../../../pages/home';

import { ButtonGlow } from '../../../utils/buttons';

import { faXmark } from '@fortawesome/free-solid-svg-icons';

export default function MenuHeader()
{
  const { toggleMenu } = useContext(ToggleMenuContext);

  return (
    <div className='menu__header'>
      <a className='menu__logo' href='/'><img src='img/logo--dark_theme.svg' alt='urotasks_logo'/></a>  
      <ButtonGlow onClick={ toggleMenu } icon={ faXmark }/>
    </div>
  )
}