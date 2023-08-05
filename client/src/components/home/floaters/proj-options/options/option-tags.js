import { useState, useContext } from "react"
import { ProjectsContext, ReducerContext } from "app"
import axios, { setResponseError } from 'utils/axiosConfig';
import { v4 as uuid } from 'uuid';

import { ChromePicker } from 'react-color';
import getTextColor from "utils/getTextColor";
import List from 'components/utils/list/list';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencil, faXmark } from '@fortawesome/free-solid-svg-icons';

export function ProjTagsDisplay()
{
  const { activeProject } = useContext(ProjectsContext);
  const { dispatch } = useContext(ReducerContext);
  
  const orderedTagsList = activeProject.tags.length > 0
    ? structuredClone(activeProject.tags).sort((a, b) => { return a.position - b.position })
    : null

  function showTagsEditor(tag)
  {
    if (!tag)
    {
      dispatch(
      {
        type: 'setProjTagsEditor',
        payload: 
        { 
          id: null, 
          name: null, 
          color: null, 
          position: null 
        }
      })
    }

    else
    {
      dispatch(
      {
        type: 'setProjTagsEditor',
        payload: tag
      })
    }

    dispatch(
    {
      type: 'setProjOptions',
      payload: 'tags-editor'
    })
  }

  function Tag({ itemData })
  {
    const colors =
    {
      backgroundColor: itemData.color, 
      color: getTextColor(itemData.color)
    }

    return (
      <li className='tags__tag' onClick={ () => { showTagsEditor(itemData) } }>
        <div className="tag__name" style={ colors }>
          { itemData.name }
        </div>
        
        <div className="tag__edit">
          <FontAwesomeIcon icon={ faPencil }/>
        </div>
      </li>
    )
  }

  return (
    <div className="tags__display">
      <h3 className="tags__header">TAGS</h3>
      {
        orderedTagsList 
        ? <List
            classes='tags__list'
            ids={`list--${activeProject.id}:tags`}
            elements={ orderedTagsList }
            ListItem={ Tag }
          />

        : <div className="tags__empty">No tags found.<br/>Create some!</div>
      }
      <div className="tags__create" onClick={ () => { showTagsEditor(null) } }>CREATE NEW TAG</div>
    </div>
  )
}

export function ProjTagsEditor()
{
  const { projects, setProjects, activeProject } = useContext(ProjectsContext);
  const { state, dispatch } = useContext(ReducerContext);
  const [newColor, setNewColor] = useState(state.projTagsEditor.color ?? '#ffffff');
  const [newName, setNewName] = useState(state.projTagsEditor.name ?? 'new tag');

  const colors =
  {
    backgroundColor: newColor, 
    color: getTextColor(newColor)
  }

  function createTag()
  {
    const tagsList = structuredClone(activeProject.tags);

    const newTag = 
    { 
      id: uuid(), 
      name: newName, 
      color: newColor, 
      position: tagsList.length + 1
    }
    
    tagsList.push(newTag)

    const projectsOld = structuredClone(projects);
    const projectsCopy = structuredClone(projects).map(project => 
    {
      if (project.id === activeProject.id)
      {
        project.tags = tagsList;
        project.updated_at = Date.now();
      }

      return project;
    })

    dispatch({ type: 'setProjOptions', payload: 'tags-display' })
    dispatch({ type: 'setProjTagsEditor', payload: null })

    setProjects(projectsCopy);
    axios.post('/a/project/update?type=tags&crud=create', 
    {
      projectID: activeProject.id, 
      newTag: newTag 
    })
    .catch(err => 
    {
      setResponseError(err, dispatch);
      setProjects(projectsOld);
    })
  }

  function updateTag()
  {
    const tagsList = structuredClone(activeProject.tags);

    tagsList.map(listTag => 
    {
      if (listTag.id === state.projTagsEditor.id)
      {
        listTag.name = newName;
        listTag.color = newColor;
      }

      return listTag;
    })
    
    const projectsOld = structuredClone(projects);
    const projectsCopy = structuredClone(projects).map(project => 
    {
      if (project.id === activeProject.id)
      {
        project.tags = tagsList;
        project.updated_at = Date.now();
      }

      return project;
    })

    dispatch({ type: 'setProjOptions', payload: 'tags-display' })
    dispatch({ type: 'setProjTagsEditor', payload: null })

    setProjects(projectsCopy);
    axios.post('/a/project/update?type=tags&crud=update',
    {
      projectID: activeProject.id,
      tagID: state.projTagsEditor.id,
      tagName: newName,
      tagColor: newColor
    })
    .catch(err => 
    {
      setResponseError(err, dispatch);
      setProjects(projectsOld);
    })
  }

  function deleteTag()
  {
    dispatch({ type: 'confirmationShown', payload: false })

    const filteredTagsList = structuredClone(activeProject.tags).filter(listTag => listTag.id !== state.projTagsEditor.id)
    const taskList = structuredClone(activeProject.tasks).map(listTask => 
    {
      if (listTask.tags.includes(state.projTagsEditor.id))
        listTask.tags = listTask.tags.filter(listTag => listTag !== state.projTagsEditor.id);
      
        return listTask;
    })
    
    const projectsOld = structuredClone(projects);
    const projectsCopy = structuredClone(projects).map(project => 
    {
      if (project.id === activeProject.id)
      {
        project.tags = filteredTagsList;
        project.tasks = taskList;
        project.updated_at = Date.now();
      }

      return project;
    })

    dispatch({ type: 'setProjOptions', payload: 'tags-display' })
    dispatch({ type: 'setProjTagsEditor', payload: null })

    setProjects(projectsCopy);
    axios.post('/a/project/update?type=tags&crud=delete',
    {
      projectID: activeProject.id,
      tagID: state.projTagsEditor.id
    })
    .catch(err => 
    {
      setResponseError(err, dispatch);
      setProjects(projectsOld);
    })
  }

  function showConfirmation()
  {
    dispatch(
    { 
      type: 'setConfirmation',
      payload: 
      {
        header: "Are you sure you want to delete this tag?",
        message: "This action is not reversible and the tag will be removed from every task that has it.",
        className: 'btn--confirmation--danger',
        confirmation: "Yes, I want to delete this tag",
        rejection: "No, I'm keeping this tag",
        function: deleteTag
      } 
    })

    dispatch({ type: 'confirmationShown', payload: true })
  }

  return (
    <div className="tags__editor">
      <h3 className="tags__header">
        { state.projTagsEditor.name ? 'EDIT TAG' : 'CREATE TAG' }
      </h3>

      <div className="tags__tag">
        <div style={ colors }>{ newName }</div>
      </div>

      <div className="tags__input">
        <label htmlFor="tagsEditor--input--name">TAG NAME</label>
        <input 
          className="tags__input__name" 
          id="tagsEditor--input--name" 
          value={ newName } 
          onChange={ e => {setNewName(e.target.value)} }  
          autoComplete="off"
        />
      </div>
      
      <div className="tags__color-picker">
        <ChromePicker color={ newColor } onChange={ color => {setNewColor(color.hex)} }/>
        
        <div className="tags__rem-color" onClick={ () => {setNewColor('#21262b')} }>
          <FontAwesomeIcon icon={ faXmark }/>
          <span>REMOVE COLOR</span>
        </div>
      </div>

      <div className="tags__submit">
        <div className="tags__create" onClick={ state.projTagsEditor.id ? updateTag : createTag }>
          { state.projTagsEditor.name ? 'UPDATE TAG' : 'CREATE TAG' }
        </div>

        {
          state.projTagsEditor.id &&
          <div className="tags__delete" onClick={ showConfirmation }>
            DELETE TAG
          </div>
        }
      </div>
    </div>
  )
}