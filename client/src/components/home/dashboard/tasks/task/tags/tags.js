import { useContext } from 'react'
import { ProjectsContext, ReducerContext } from 'app'

import getTextColor from 'utils/getTextColor';
import { List } from 'components/utils/list/list'

export default function TaskTags({ task })
{
  const { activeProject } = useContext(ProjectsContext);
  const { state, dispatch } = useContext(ReducerContext);

  const taskTagIDs = structuredClone(activeProject.tasks)
    .filter(listTask => listTask.id === task.id)[0].tags ?? [];
  
  const orderedTags = structuredClone(activeProject.tags)
    .filter(listTag => taskTagIDs.includes(listTag.id))
    .sort((a, b) => { return a.position - b.position })

  function TaskTag({ itemData: tag })
  {
    const style = 
    {
      backgroundColor: tag.color,
      color: getTextColor(tag.color)
    };

    if (state.tagsNameShown)
      return <li className='task__tag' style={ style }>{ tag.name }</li>

    else
      return <li className='task__tag task__tag--hidden' style={ style }/>
  }

  if (orderedTags.length < 1)
    return null;

  return (
    <List
      classes='task__tags'
      ids={`list--${task.id}:display-tags`}
      elements={ orderedTags }
      ListItem={ TaskTag }
      onClick={ () => {dispatch({ type: 'tagsNameShown', payload: !state.tagsNameShown })} }
    />
  )
}