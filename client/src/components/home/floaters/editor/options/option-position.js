import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUp, faArrowDown } from '@fortawesome/free-solid-svg-icons';

export default function OptionPosition({ task })
{
  return (
    <>
      <div className='option option--position option--position--up'>
        <div className='option__icon'><FontAwesomeIcon icon={ faArrowUp }/></div>
      </div>

      <div className='option option--position option--position--down'>
        <div className='option__icon'><FontAwesomeIcon icon={ faArrowDown }/></div>
      </div>
    </>
  )
}