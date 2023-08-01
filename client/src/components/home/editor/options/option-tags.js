import { useContext } from 'react';
import { ProjectsContext, ReducerContext } from 'app';

import getTextColor from 'utils/getTextColor';
import List from 'components/utils/list/list';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTag, faPencil, faXmark } from '@fortawesome/free-solid-svg-icons';

export default function OptionTags({ task })
{
  const { projects, setProjects, activeProject, setActiveProject } = useContext(ProjectsContext);
  const { state, dispatch } = useContext(ReducerContext);

  const orderedTagsList = activeProject.tags.length > 0
    ? activeProject.tags.sort((a, b) => { return a.position - b.position })
    : null

  function Tag({ itemData })
  {
    const colors =
    {
      backgroundColor: itemData.color, 
      color: getTextColor(itemData.color)
    }

    const operationClasses = task.tags.includes(itemData.id)
      ? `tag__operation tag__operation--checked`
      : `tag__operation`

    return (
      <li className='tags__tag'>
        <div className={ operationClasses }></div>
        <div className="tag__name" style={ colors }>{ itemData.name }</div>
        <div className="tag__edit"><FontAwesomeIcon icon={ faPencil }/></div>
      </li>
    )
  }

  return (
    <>
      <div className='option option--tags'>
        <div className='option__icon'><FontAwesomeIcon icon={ faTag }/></div>
      </div>

      <div className="tags__settings">
        {
          orderedTagsList 
          ? <List
              classes='tags__list'
              ids={`list--${task.id}:tags`}
              elements={ orderedTagsList }
              ListItem={ Tag }
            />

          : <div className="tags__empty">No tags found.<br/>Create some!</div>
        }
        <div className="tags__create">CREATE NEW TAG</div>
      </div>
    </>
  )
}
