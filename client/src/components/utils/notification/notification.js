import { useContext } from 'react';
import { ReducerContext } from '../../../app';
import { motion } from 'framer-motion';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleXmark, faCircleCheck } from '@fortawesome/free-solid-svg-icons';

export default function Notification()
{
  const { state, dispatch } = useContext(ReducerContext);
  
  const classes = state.notification.type === "confirmation" 
    ? 'notification notification--confirmation'
    : 'notification notification--error' 

  const icon = state.notification.type === "confirmation"
    ? faCircleCheck
    : faCircleXmark

  return (
    <motion.div key="notification" className={ classes } initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, x: '400px' }}>
      <div className="notification__close" onClick={ () => {dispatch({ type: 'toggleNotification' })} }>x</div>

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