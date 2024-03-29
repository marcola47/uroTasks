import { useState, useContext } from "react"
import { ProjectsContext, ReducerContext } from "app"
import axios, { setResponseError } from 'utils/axiosConfig';
import { v4 as uuid } from 'uuid';
import { DragDropContext, Draggable } from "react-beautiful-dnd";

import { ChromePicker } from 'react-color';
import getTextColor from "utils/getTextColor";
import { DroppableList } from 'components/utils/list/list';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencil, faXmark } from '@fortawesome/free-solid-svg-icons';

export function ProjTagsDisplay()
{
  const { projects, setProjects, activeProject } = useContext(ProjectsContext);
  const { dispatch } = useContext(ReducerContext);
  
  const orderedTagsList = activeProject.tags.length > 0
    ? structuredClone(activeProject.tags).sort((a, b) => { return a.position - b.position })
    : null

  function showTagsEditor(tag)
  {
    if (!tag)
      dispatch({ type: 'setProjTagsEditor', payload: { id: null, name: null, color: null, position: null } })

    else
      dispatch({ type: 'setProjTagsEditor', payload: tag })

    dispatch({ type: 'setProjOptions', payload: 'tags-editor' })
  }

  function Tag({ itemData: tag })
  {
    const colors =
    {
      backgroundColor: tag.color, 
      color: getTextColor(tag.color)
    }

    return (
      <Draggable draggableId={ tag.id } index={ tag.position }>
      {
        (provided) =>
        (
          <li 
            className='tags__tag' 
            onClick={ () => { showTagsEditor(tag) } }
            ref={ provided.innerRef }
            { ...provided.draggableProps }
            { ...provided.dragHandleProps }
          >
            <div className="tag__name" style={ colors }>{ tag.name }</div>
            <div className="tag__edit"><FontAwesomeIcon icon={ faPencil }/></div>
          </li>
        )
      }
      </Draggable>
    )
  }

  const onDragEnd = result =>
  {
    if (!result.destination || (result.destination.droppableId === result.source.droppableId && result.destination.index === result.source.index))
      return;

    const tagsList = structuredClone(activeProject.tags);
    const tag = tagsList.find(listTag => listTag.id === result.draggableId);
    const positions = { old: result.source.index, new: result.destination.index };

    tagsList.forEach(listTag =>
    {
      const isBetween =
        listTag.position >= Math.min(positions.old, positions.new) &&
        listTag.position <= Math.max(positions.old, positions.new)

      if (listTag.id === tag.id)
        listTag.position = positions.new;

      else if (listTag.id !== tag.id && isBetween)
        listTag.position += positions.new > positions.old ? -1 : 1;
    });

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

    setProjects(projectsCopy);
    axios.post('/a/tag/update/position', 
    {
      projectID: activeProject.id,
      tagID: tag.id,
      params:
      {
        sourcePosition: result.source.index,
        destinationPosition: result.destination.index,
      }
    })
    .catch(err => 
    {
      setResponseError(err, dispatch);
      setProjects(projectsOld);
    })
  }

  return (
    <div className="tags__display">
      <h3 className="tags__header">TAGS</h3>
      {
        orderedTagsList 
        ? <DragDropContext onDragEnd={ onDragEnd }>
            <DroppableList
              droppableId={`list--${activeProject.id}:tags`}
              direction='vertical'
              type="options-tag-list"
              elements={ orderedTagsList }
              ListItem={ Tag }
              className='tags__list'
            />
          </DragDropContext>
        
        : <div className="tags__empty">
            No tags found.
            <br/>
            Create some!
          </div>
      }

      <div 
        className="tags__create" 
        onClick={ () => { showTagsEditor(null) } }
        children="CREATE NEW TAG"
      />
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
      position: tagsList.length
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
    axios.post('/a/tag/create', 
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
    axios.post('/a/tag/update/content',
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
    axios.delete(`/a/tag/delete/${activeProject.id}/${state.projTagsEditor.id}`)
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
      <h3 
        className="tags__header"
        children={ state.projTagsEditor.name ? 'EDIT TAG' : 'CREATE TAG' }
      />

      <div className="tags__tag">
        <div 
          style={ colors }
          children={ newName }
        />
      </div>

      <div className="tags__input">
        <label htmlFor="tagsEditor--input--name">
          TAG NAME
        </label>

        <input 
          className="tags__input__name" 
          id="tagsEditor--input--name" 
          value={ newName } 
          onChange={ e => setNewName(e.target.value) }  
          autoComplete="off"
        />
      </div>
      
      <div className="tags__color-picker">
        <ChromePicker 
          color={ newColor } 
          onChange={ color => {setNewColor(color.hex)} }
        />
        
        <div 
          className="tags__rem-color" 
          onClick={ () => {setNewColor('#21262b')} }
        >
          <FontAwesomeIcon icon={ faXmark }/>
          <span>REMOVE COLOR</span>
        </div>
      </div>

      <div className="tags__submit">
        <div 
          className="tags__create" 
          onClick={ state.projTagsEditor.id ? updateTag : createTag }
          children={ state.projTagsEditor.name ? 'UPDATE TAG' : 'CREATE TAG' }
        />

        {
          state.projTagsEditor.id &&
          <div 
            className="tags__delete" 
            onClick={ showConfirmation }
            children="DELETE TAG"
          />
        }
      </div>
    </div>
  )
}