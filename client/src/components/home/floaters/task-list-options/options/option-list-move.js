import { useState, useContext } from 'react';
import { ProjectsContext, ReducerContext } from 'app';
import axios, { setResponseError } from 'utils/axiosConfig';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowsLeftRight, faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons';

export default function OptionMoveList({ type })
{
  const { projects, setProjects, activeProject } = useContext(ProjectsContext)
  const { dispatch } = useContext(ReducerContext);
  
  const [paramsShown, setParamsShown] = useState(false);
  const [projListShown, setProjListShown] = useState(false);
  const [posListShown, setPosListShown] = useState(false);

  const [newProject, setNewProject] = useState(activeProject);
  const [newPosition, setNewPosition] = useState(type.position);

  function moveList()
  {
    // implement cross project moving
    const positions = { old: type.position, new: newPosition };
    const typesList = structuredClone(activeProject.types);

    if (positions.new > positions.old)
    {
      typesList.map(listType => 
      {
        if (listType.id !== type.id && listType.position >= positions.old && listType.position <= positions.new)
          listType.position--;

        else if (listType.id === type.id)
          listType.position = positions.new

        return listType;
      })
    }

    else if (positions.new < positions.old)
    {
      typesList.map(listType => 
      {
        if (listType.id !== type.id && listType.position <= positions.old && listType.position >= positions.new)
          listType.position++;

        else if (listType.id === type.id)
          listType.position = positions.new

        return listType;
      })
    }

    const projectsOld = structuredClone(projects);
    const projectsCopy = structuredClone(projects).map(project => 
    {
      if (project.id === activeProject.id)
      {
        project.types = typesList;
        project.updated_at = Date.now();
      }

      return project;
    })

    setProjects(projectsCopy);
    axios.post('/a/list/update/position', 
    {
      curProjectID: activeProject.id,
      newProjectID: newProject.id,
      typeID: type.id,
      positions: positions
    })
    .catch(err =>
    {
      setResponseError(err, dispatch);
      setProjects(projectsOld);
    })

    setParamsShown(false);
    setProjListShown(false);
    setPosListShown(false);
    dispatch({ type: 'setTaskListOptions', payload: { params: null, data: null } })
  }

  function iterateListPosition(mode)
  {
    const lastPos = Math.max(...activeProject.types.map(type => type.position))

    if (mode === 'increment')
      return newPosition >= lastPos ? null : setNewPosition(newPosition + 1);

    else if (mode === 'decrement')
      return newPosition <= 1 ? null : setNewPosition(newPosition - 1);
  }

  function showList(show)
  {
    if (show === 'proj')
    {
      setPosListShown(false)
      
      if (projListShown)
        setProjListShown(false)
      
      else 
        setProjListShown(true)
    }

    if (show === 'pos')
    {
      setProjListShown(false)

      if (posListShown)
        setPosListShown(false)
      
      else 
        setPosListShown(true)
    }
  }

  function ListProject({ project })
  {
    function updateListProject()
    {
      setNewProject(project)
      setProjListShown(false);
    }

    return (
      <li className='move__list__item' onClick={ updateListProject }>
        { project.name }
        { project.name === activeProject.name ? ' (current)' : null }
      </li>
    )
  }

  function ListPosition({ position })
  {
    function updateListPosition()
    {
      setNewPosition(position)
      setPosListShown(false);
    }

    return (
      <li className='move__list__item' onClick={ updateListPosition }>
        { position }
        { position === type.position ? ' (current)' : null }
      </li>
    )
  }

  return (
    <div className="option" onClick={ () => {setParamsShown(!paramsShown)} }>
      <FontAwesomeIcon icon={ faArrowsLeftRight }/>
      <span>Move list</span>

      <div className={`move ${paramsShown ? 'move--shown' : 'move--hidden'}`} onClick={ e => { e.stopPropagation() }}>
        <div className="move__param move__project">
          <div className='move__container' onClick={ () => {showList('proj')} }>
            <div className="move__header">Project</div>
            <div className="move__content">{ newProject.name }</div>
          </div>

          {
            projListShown &&
            <ul className="move__list move__list--proj">
              { projects.map(project => { return <ListProject key={ project.id } project={ project }/> }) }
            </ul>
          }
        </div>
        
        <div className="move__param move__position">
          <div className='move__container' onClick={ () => {showList('pos')} }>
            <div className="move__header">Position</div>
            <div className="move__content">{ newPosition }</div>
          </div>

          {
            posListShown &&
            <ul className="move__list move__list--pos">
              { activeProject.types.map(type => { return <ListPosition key={ type.id } position={ type.position }/> }) }
            </ul>
          }
        </div>

        <div className="move__btns">
          <div className="move__btn" onClick={ () => {iterateListPosition('decrement')} }>
            <FontAwesomeIcon icon={ faArrowLeft }/>
          </div>

          <div className="move__btn" onClick={ () => {iterateListPosition('increment')} }>
          <FontAwesomeIcon icon={ faArrowRight }/>
          </div>

          <div className="move__submit" onClick={ moveList }>MOVE</div>
        </div>
      </div>
    </div>
  )
}