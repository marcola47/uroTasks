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
    <TransitionOpacityHorizontal 
      className={ classes } 
      id="notification"
    >
      <div 
        className="notification__close" 
        onClick={ () => {dispatch({ type: 'notificationShown', payload: false })} }
        children="x"
      />

      <div 
        className="notification__icon"
        children={ <FontAwesomeIcon icon={ icon }/> }
      />
      
      <div className="notification__data">
        <p 
          className="notification__header"
          children={ state.notification.header }
        />
        
        { 
          state.notification.message !== '' && 
          <p 
            className="notification__msg" 
            children={ state.notification.message }
          />
        }
      </div>
    </TransitionOpacityHorizontal>
  )
}

export function Confirmation()
{
  const { state, dispatch } = useContext(ReducerContext);

  return (
    <TransitionOpacity 
      onClick={ () => {dispatch({ type: 'confirmationShown', payload: false })} } 
      id="confirmation"
    >
      <div 
        className="confirmation" 
        onClick={ e => {e.stopPropagation()} }
      >
        <div className="confirmation__data">
          <p 
            className="confirmation__header"
            children={ state.confirmation?.header }
          />
          
          <p 
            className="confirmation__msg"
            children={ state.confirmation?.message }
          />
        </div>

        <div className="confirmation__btns">
          <div 
            className={`btn ${state.confirmation?.className}`} 
            onClick={ state.confirmation?.function }
            children={ state.confirmation?.confirmation }
          />

          <div 
            className="btn btn--rejection" 
            onClick={ () => {dispatch({ type: 'confirmationShown', payload: false })} }
            children={ state.confirmation?.rejection }
          />
        </div>
      </div>
    </TransitionOpacity>
  )
}