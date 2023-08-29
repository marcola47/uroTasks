import { useContext } from "react"
import { ReducerContext } from "app"

export function Screensaver()
{
  return (
    <div className="screensaver">
      <img 
        className="spinning" 
        src="img/logo--circle.svg" 
        alt=""
      />
    </div>
  )
}

export function NoActiveProject()
{
  const { dispatch } = useContext(ReducerContext);

  function showProjects()
  { dispatch({ type: 'menuShown', payload: true }) }

  function showProjectCreator()
  { dispatch({ type: 'projCreatorShown', payload: true }) }

  return (
    <div className="screensaver">
      <div 
        className="screensaver__header"
        children="No active project"
      />
      
      <div className="screensaver__btns">
        <div 
          className="screensaver__btn screensaver__btn--choose" 
          onClick={ showProjects }
          children="CHOOSE A PROJECT"
        />

        <div 
          className="screensaver__btn screensaver__btn--create" 
          onClick={ showProjectCreator }
          children="CREATE A NEW PROJECT"
        /> 
        </div>

      <img 
        className="static" 
        src="img/logo--circle--name--dark.svg" 
        alt=""
      />
    </div>
  )
}