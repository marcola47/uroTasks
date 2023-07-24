import { useContext } from 'react';
import { ReducerContext } from 'app';
import { motion } from 'framer-motion';

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
    <motion.div key="nf" className={ classes } initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, x: '400px' }}>
      <div className="notification__close" onClick={ () => {dispatch({ type: 'hideNotification' })} }>x</div>

      <div className="notification__icon">
        <FontAwesomeIcon icon={ icon }/>
      </div>
      
      <div className="notification__data">
        <p className="notification__header">{ state.notification.header }</p>
        <p className="notification__msg">{ state.notification.message }</p>
      </div>
    </motion.div>
  )
}

export function Confirmation()
{
  const { state, dispatch } = useContext(ReducerContext);

  return (
    <motion.div key="cf" className="confirmation" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <div className="confirmation__bg" onClick={ () => {dispatch({ type: 'hideConfirmation' })} } />

      <div className="confirmation__content">
        <div className="confirmation__data">
          <p className="confirmation__header">{ state.confirmation?.header }</p>
          <p className="confirmation__msg">{ state.confirmation?.message }</p>
        </div>

        <div className="confirmation__btns">
          <div className={`btn ${state.confirmation?.className}`} onClick={ state.confirmation?.function }>{ state.confirmation?.confirmation }</div>
          <div className="btn btn--rejection" onClick={ () => {dispatch({ type: 'hideConfirmation' })} }>{ state.confirmation?.rejection }</div>
        </div>
      </div>
    </motion.div>
  )
}