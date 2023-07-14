import { useEffect, useContext } from 'react';
import { ReducerContext } from '../../../app';
import { motion, AnimatePresence } from 'framer-motion';

import List from '../list/list';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleXmark, faCircleCheck } from '@fortawesome/free-solid-svg-icons';

export function Notification({ itemData })
{
  const { dispatch } = useContext(ReducerContext);

  const classes = itemData.type === "confirmation" 
    ? 'popup popup--confirmation popup--shown'
    : 'popup popup--error popup--shown'

  const icon = itemData.type === "confirmation"
    ? faCircleCheck
    : faCircleXmark


  return (
    <AnimatePresence>
      <motion.div className={ classes } initial={{ opacity: 0, x: 400 }} animate={{ opacity: 1, x: 0 }}  exit={{ opacity: 0, x: 400 }}>
        <div className="popup__close" onClick={ () => {dispatch({ type: 'removeNotification', payload: itemData.index })} }>x</div>

        <div className="popup__icon">
          <FontAwesomeIcon icon={ icon }/>
        </div>
        
        <div className="popup__data">
          <p className="popup__header">{ itemData.header }</p>
          <p className="popup__msg">{ itemData.message }</p>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}

export default function Notifications()
{
  const { state } = useContext(ReducerContext);

  return (
    <List 
      elements={ state.notifications } 
      ListItem={ Notification }
      classes='notifications'
    />
  )
}