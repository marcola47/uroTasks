import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

function ButtonGlow({ onClick, icon, fontSize = "2.3rem" })
{
  return (
    <div 
      className='btn btn--glow' 
      onClick={ onClick } 
      style={{ fontSize: fontSize }}
      children={ <FontAwesomeIcon icon={ icon }/> }
    />
  )
}

export { ButtonGlow };