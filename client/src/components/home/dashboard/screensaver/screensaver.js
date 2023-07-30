export function Screensaver()
{
  return (
    <div className="screensaver">
      <img className="spinning" src="img/logo--circle.svg" alt=""/>
    </div>
  )
}

export function NoActiveProject()
{
  return (
    <div className="screensaver">
      <div>No active project.<br/>Select one from the menu!</div>
      <img className="static" src="img/logo--circle--name--dark.svg" alt=""/>
    </div>
  )
}