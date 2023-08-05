import { useContext } from 'react'
import { ProjectsContext } from 'app'

import getTextColor from 'utils/getTextColor';
import List from 'components/utils/list/list'

export default function EditorTags({ task })
{
  const { activeProject } = useContext(ProjectsContext);
  
  const taskTagsList = structuredClone(activeProject.tasks).filter(listTask => listTask.id === task.id)[0].tags ?? [];
  const filteredTags = structuredClone(activeProject.tags).filter(tag => taskTagsList.includes(tag.id));
  
  function TaskTag({ itemData })
  {
    const style = 
    {
      backgroundColor: itemData.color,
      color: getTextColor(itemData.color)
    };

    return <li className='editor__tag' style={ style }>{ itemData.name }</li>
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