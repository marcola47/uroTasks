import { useContext } from 'react';
import { ReducerContext } from 'app';

import { TransitionOpacity, TransitionOpacityHorizontal } from '../transitions/transitions';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleXmark, faCircleCheck } from '@fortawesome/free-solid-svg-icons';

export function Notification()
{
  const { state, dispatch } = useContext(ReducerContext);
  
  const classes = state.notification.type === "confirmation" 
    ? 'notification notification--confirmation'
    : 'notification notification--error' 

  const icon = state.notification.type === "confirmation"
    ? faCircleCheck
    : faCircleXmark

  return (
    <TransitionOpacityHorizontal className={ classes } id="notification">
      <div className="notification__close" onClick={ () => {dispatch({ type: 'notificationShown', payload: false })} }>x</div>

      <div className="notification__icon">
        <FontAwesomeIcon icon={ icon }/>
      </div>
      
      <div className="notification__data">
        <p className="notification__header">{ state.notification.header }</p>
        { state.notification.message !== '' && <p className="notification__msg">{ state.notification.message }</p> }
      </div>
    </TransitionOpacityHorizontal>
  )
}

export function Confirmation()
{
  const { state, dispatch } = useContext(ReducerContext);

  return (
    <TransitionOpacity onClick={ () => {dispatch({ type: 'confirmationShown', payload: false })} } id="cofirmation">
      <div className="confirmation" onClick={ e => {e.stopPropagation()} }>
        <div className="confirmation__data">
          <p className="confirmation__header">{ state.confirmation?.header }</p>
          <p className="confirmation__msg">{ state.confirmation?.message }</p>
        </div>

        <div className="confirmation__btns">
          <div className={`btn ${state.confirmation?.className}`} onClick={ state.confirmation?.function }>{ state.confirmation?.confirmation }</div>
          <div className="btn btn--rejection" onClick={ () => {dispatch({ type: 'confirmationShown', payload: false })} }>{ state.confirmation?.rejection }</div>
        </div>
      </div>
    </TransitionOpacity>
  )
}