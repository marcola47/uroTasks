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
  const { projects, setProjects, activeProject } = useContext(ProjectsContext);
  const { state, dispatch } = useContext(ReducerContext);
  const { subMenus, setSubMenus } = useContext(SubMenusContext);

  const orderedTagsList = activeProject.tags.length > 0
    ? structuredClone(activeProject.tags).sort((a, b) => { return a.position - b.position })
    : null

  function toggleTag(tag)
  {
    let method = 'push';
    let tagsList = [];
    let tagsOld = structuredClone(task.tags);

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

    const taskList = structuredClone(activeProject.tasks).map(listTask => 
    {
      if (listTask.id === task.id)
        listTask.tags = tagsList;

      return listTask;
    })
  
    const projectsOld = structuredClone(projects);
    const projectsCopy = structuredClone(projects).map(project => 
    {
      if (project.id === activeProject.id)
      {
        project.tasks = taskList;
        project.updated_at = Date.now();
      }

      return project;
    })

    task.tags = tagsList;
    setProjects(projectsCopy)
    axios.post(`/a/task/update/tags?method=${method}`,
    {
      projectID: activeProject.id,
      taskID: task.id,
      tagID: tag.id,
      method: method
    })
    .catch(err => 
    {
      setResponseError(err, dispatch);
      setProjects(projectsOld)
      task.tags = tagsOld;
    })
  }

  function createTag()
  {
    dispatch(
    {
      type: 'setProjTagsEditor',
      payload: { id: null, name: null, color: null, position: null }
    })

    dispatch(
    { 
      type: 'setProjOptions', 
      payload: 'tags-editor' 
    })

    dispatch(
    {
      type: 'setEditor',
      payload: { params: null, data: null }
    })
  }

  function Tag({ itemData })
  {
    const colors =
    {
      backgroundColor: itemData.color, 
      color: getTextColor(itemData.color)
    }

    function editTag()
    {
      dispatch(
      {
        type: 'setProjTagsEditor',
        payload: itemData  
      })

      dispatch(
      { 
        type: 'setProjOptions', 
        payload: 'tags-editor' 
      })

      dispatch(
      {
        type: 'setEditor',
        payload: { params: null, data: null }
      })
    }

    return (
      <li className='tags__tag'>
        <div 
          className={`tag__operation ${task.tags.includes(itemData.id) && 'tag__operation--checked'}` }
          onClick={() => {toggleTag(itemData)}}
        />
        
        <div className="tag__name" style={ colors } onClick={() => {toggleTag(itemData)}}>
          { itemData.name }
        </div>
        
        <div className="tag__edit" onClick={ editTag }>
          <FontAwesomeIcon icon={ faPencil }/>
        </div>
      </li>
    )
  }

  function toggleSubMenus()
  {
    const newSubMenus = 
    {
      tags: !subMenus.tags,
      types: false,
      dates: false
    }

    setSubMenus(newSubMenus);
  }

  return (
    <>
      <div className={`option option--tags ${subMenus.tags && 'option--selected'}`} onClick={ toggleSubMenus }>
      {
        subMenus.tags
        ? <div className='option__icon'><FontAwesomeIcon icon={ faArrowTurnDown }/></div>
        : <div className='option__icon'><FontAwesomeIcon icon={ faTag }/></div>
      }
      </div>

      <AnimateTransit>
      {
        subMenus.tags &&
        <TransitionOpacity className="sub-menu tags">
          <div className='sub-menu__wrapper' style={{ width: state.editor.params.w }}>
            <div className="sub-menu__header">TAGS</div>
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
            <div className="tags__create" onClick={ createTag }>CREATE NEW TAG</div>
          </div>
        </TransitionOpacity>
      }
      </AnimateTransit>
    </>
  )
}
