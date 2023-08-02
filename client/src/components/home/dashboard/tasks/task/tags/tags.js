import { useContext } from 'react'
import { ProjectsContext } from 'app'

import getTextColor from 'utils/getTextColor';
import List from 'components/utils/list/list'

export default function TaskTags({ task })
{
  const { activeProject } = useContext(ProjectsContext);
  const taskTagsList = activeProject.tasks.filter(listTask => listTask.id === task.id)[0].tags ?? [];
  
  const tags = JSON.parse(JSON.stringify(activeProject.tags));
  const filteredTags = tags.filter(tag => taskTagsList.includes(tag.id));
  
  function TaskTag({ itemData })
  {
    const style = 
    {
      backgroundColor: itemData.color,
      color: getTextColor(itemData.color)
    };

    return <li className='task__tag' style={ style }>{ itemData.name }</li>
  }

  if (filteredTags.length < 1)
    return null;

  return (
    <List
      classes='task__tags'
      ids={`list--${task.id}:display-tags`}
      elements={ filteredTags }
      ListItem={ TaskTag }
    />
  )
}