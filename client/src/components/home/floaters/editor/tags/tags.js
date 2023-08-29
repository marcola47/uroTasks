import { useContext } from 'react'
import { ProjectsContext } from 'app'

import getTextColor from 'utils/getTextColor';
import { List } from 'components/utils/list/list'

export default function EditorTags({ task })
{
  const { activeProject } = useContext(ProjectsContext);
  
  const taskTagsList = structuredClone(activeProject.tasks).filter(listTask => listTask.id === task.id)[0].tags ?? [];
  const filteredTags = structuredClone(activeProject.tags).filter(tag => taskTagsList.includes(tag.id));
  
  function TaskTag({ itemData: tag })
  {
    const style = 
    {
      backgroundColor: tag.color,
      color: getTextColor(tag.color)
    };

    return (
      <li 
        className='editor__tag' 
        style={ style }
        children={ tag.name }
      />
    )
  }

  if (filteredTags.length < 1)
    return null;

  return (
    <List
      classes='editor__tags'
      ids={`list--:editor-tags`}
      elements={ filteredTags }
      ListItem={ TaskTag }
    />
  )
}