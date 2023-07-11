import { v4 as uuid } from 'uuid';

export default function List({ elements, ListItem, classes = "", ids = "" })
{
  return (
    <ul className={ classes } id={ ids }>
      { 
        elements.map(element => 
        {
          return <ListItem itemData={ element } key={ element.id ?? uuid() }/>
        }) 
      }
    </ul>
  )
}