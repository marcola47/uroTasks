import { motion, AnimatePresence } from "framer-motion";

export function TransitionOpacity({ id, children, onClick, className = "overlay__bg--dark" })
{
  return (
    <motion.div
      key={ id }
      className={ className }
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.1, ease: "easeInOut" }}
      onClick={ onClick }
    >
      { children }
    </motion.div>
  );
}

export function TransitionOpacityHorizontal({ id, children, onClick, className = "overlay__bg--dark" })
{
  return (
    <motion.div
      key={ id }
      className={ className }
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, x: '400px' }}
      onClick={ onClick }
    >
      { children }
    </motion.div>
  );
}

export function AnimateTransit({ children })
{
  return (
    <AnimatePresence 
      initial={ false } 
      mode='wait' 
      onExitComplete={ () => null }
    >
      { children }
    </AnimatePresence>
  )
}