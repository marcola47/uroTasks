import { useEffect } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleXmark, faCircleCheck } from '@fortawesome/free-solid-svg-icons';

export function Error({ header, error, setError })
{
  useEffect(() => 
  {
    const timer = setTimeout(() => {setError(null)}, 5000);
    return () => {clearTimeout(timer)};
  }, [error, setError]);

  return (
    <div className={`popup popup--error ${error ? 'popup--shown' : ''}`}>
      <div className="popup__close" onClick={ () => {setError(null)} }>x</div>

      <div className="popup__icon"><FontAwesomeIcon icon={ faCircleXmark }/></div>
      
      <div className="popup__data">
        <p className="popup__header">{ header }</p>
        <p className="popup__msg">{ error }</p>
      </div>
    </div>
  )
}

export function Confirmation({ header, confirmation, setConfirmation })
{
  useEffect(() => 
  {
    const timer = setTimeout(() => {setConfirmation(null)}, 5000);
    return () => {clearTimeout(timer)};
  }, [confirmation, setConfirmation]);

  return (
    <div className={`popup popup--confirmation ${confirmation ? 'popup--shown' : ''}`}>
      <div className="popup__close" onClick={ () => {setConfirmation(null)} }>x</div>

      <div className="popup__icon"><FontAwesomeIcon icon={ faCircleCheck }/></div>
      
      <div className="popup__data">
        <p className="popup__header">{ header }</p>
        <p className="popup__msg">{ confirmation }</p>
      </div>
    </div>
  )
}