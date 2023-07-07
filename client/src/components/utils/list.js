import { v4 as uuid } from 'uuid';

// list that maps an array to components, the array can be of anything, even though this was made to work with objects
export default function List({ elements, ListItem, classes = "", ids = "" })
{
  return (
    <ul className={ classes } id={ ids }>
      { elements.map(element => {return <ListItem itemData={ element } key={ element.id ?? uuid() }/>}) }
    </ul>
  )
}