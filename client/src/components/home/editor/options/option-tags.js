import { useContext } from 'react';
import { ProjectsContext, ReducerContext } from 'app';
import { SubMenusContext } from '../editor';
import axios, { setResponseError } from 'utils/axiosConfig';

import { TransitionOpacity, AnimateTransit } from 'components/utils/transitions/transitions';
import getTextColor from 'utils/getTextColor';
import List from 'components/utils/list/list';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTag, faPencil, faArrowTurnDown } from '@fortawesome/free-solid-svg-icons';

export default function OptionTags({ task })
{
  const { projects, setProjects, activeProject, setActiveProject } = useContext(ProjectsContext);
  const { state, dispatch } = useContext(ReducerContext);
  const { subMenus, setSubMenus } = useContext(SubMenusContext);

  const orderedTagsList = activeProject.tags.length > 0
    ? activeProject.tags.sort((a, b) => { return a.position - b.position })
    : null

  function toggleTag(tag)
  {
    let method = 'push';
    let tagsList = [];

    if (task.tags.includes(tag.id))
    {
      method = 'pull';
      tagsList = task.tags.filter(listTag => listTag !== tag.id)
    }

    else
    {
      tagsList = task.tags;
      tagsList.push(tag.id)
    }

    const taskList = activeProject.tasks.map(listTask => 
      {
        if (listTask.id === task.id)
          listTask.tags = tagsList;

        return listTask;
      })
    
      const projectsCopy = projects.map(project => 
      {
        if (project.id === activeProject.id)
          project.tasks = taskList

        return project;
      })

    axios.post(`/a/task/update?type=tags&method=${method}`,
    {
      taskID: task.id,
      tagID: tag.id,
      method: method
    })
    .then(() => 
    {
      setActiveProject((prevActiveProject) => ({ ...prevActiveProject, tasks: taskList }))
      setProjects(projectsCopy)
    })
    .catch(err => setResponseError(err, dispatch))
  }

  function Tag({ itemData })
  {
    const colors =
    {
      backgroundColor: itemData.color, 
      color: getTextColor(itemData.color)
    }

    return (
      <li className='tags__tag'>
        <div 
          className={`tag__operation ${task.tags.includes(itemData.id) ? 'tag__operation--checked' : ''}` }
          onClick={() => {toggleTag(itemData)}}
        />
        
        <div className="tag__name" style={ colors } onClick={() => {toggleTag(itemData)}}>
          { itemData.name }
        </div>
        
        <div className="tag__edit">
          <FontAwesomeIcon icon={ faPencil }/>
        </div>
      </li>
    )
  }

  return (
    <>
      <div className='option option--tags' onClick={ () => {setSubMenus({ tags:!subMenus.tags, types: false })} }>
      {
        subMenus.tags
        ? <div className='option__icon'><FontAwesomeIcon icon={ faArrowTurnDown }/></div>
        : <div className='option__icon'><FontAwesomeIcon icon={ faTag }/></div>
      }
      </div>

      <AnimateTransit>
      {
        subMenus.tags &&
        <TransitionOpacity className="tags__settings">
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
        </TransitionOpacity>
      }
      </AnimateTransit>
    </>
  )
}
