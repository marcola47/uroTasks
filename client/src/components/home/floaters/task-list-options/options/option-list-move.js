import { useState, useContext } from 'react';
import { ProjectsContext, ReducerContext } from 'app';
import axios, { setResponseError } from 'utils/axiosConfig';

import repositionLists from 'operations/lists-reposition';

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
    if (activeProject.id === newProject.id)
    {
      const result =
      {
        draggableId: type.id,
        source: { index: type.position },
        destination: { index: newPosition }
      }

      const projectsContext = { projects, setProjects, activeProject };
      const opContext = { dispatch, result, axios, setResponseError };

      repositionLists(projectsContext, opContext);
    }
    
    else
    {
      const sourceTypeList = structuredClone(activeProject.types);
      const destinationTypeList = structuredClone(newProject.types);
      const positions = { old: type.position, new: newPosition };

      const sourceTaskList = structuredClone(activeProject.tasks)
        .filter(listTask => listTask.type === type.id)
        .map(listTask => ({ ...listTask, project: newProject.id }));

      const filteredSourceTypeList = sourceTypeList.filter(listType => listType.id !== type.id);
      filteredSourceTypeList.forEach(listType => 
      { 
        if (listType.position > positions.old) 
          listType.position-- 
      });
      
      destinationTypeList.push(type);
      destinationTypeList.forEach(listType => 
      { 
        if (listType.id !== type.id && listType.position >= positions.new) 
          listType.position++ 

        else if (listType.id === type.id)
          listType.position = positions.new;
      });

      const projectsOld = structuredClone(projects);
      const projectsCopy = structuredClone(projects).map(project =>
      {
        if (project.id === activeProject.id)
        {
          project.tasks = project.tasks.filter(task => task.type !== type.id);
          project.types = filteredSourceTypeList;
          project.updated_at = Date.now();
        }

        else if (project.id === newProject.id)
        {
          project.tasks.push(...sourceTaskList);
          project.types = destinationTypeList;
          project.updated_at = Date.now();
        }

        return project;
      })
      
      setProjects(projectsCopy);
      axios.patch('/a/list/update/position', 
      {
        typeID: type.id,
        params: 
        {
          sourceID: activeProject.id,
          sourcePosition: positions.old,
          destinationID: newProject.id,
          destinationPosition: positions.new,
        }
      })
      .catch(err =>
      {
        setResponseError(err, dispatch);
        setProjects(projectsOld);
      })
    }

    setParamsShown(false);
    setProjListShown(false);
    setPosListShown(false);
    dispatch(
    { 
      type: 'setTaskListOptions', 
      payload: { params: null, data: null } 
    })
  }

  function iterateListPosition(mode)
  {
    const lastPos = Math.max(...activeProject.types.map(type => type.position))

    if (mode === 'increment' && newPosition < lastPos)
      setNewPosition(newPosition + 1);

    else if (mode === 'decrement' && newPosition > 1)
      setNewPosition(newPosition - 1);
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
      setNewProject(project);
      setNewPosition(project.types.length);
      setProjListShown(false);
    }

    return (
      <li 
        className='move__list__item' 
        onClick={ updateListProject }
        children={ project.name }
      />
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
      <li 
        className='move__list__item' 
        onClick={ updateListPosition }
        children={ position }
      />
    )
  }

  return (
    <div 
      className="option" 
      onClick={ () => {setParamsShown(!paramsShown)} }
    >
      <FontAwesomeIcon icon={ faArrowsLeftRight }/>
      <span>Move list</span>

      <div 
        className={`move ${paramsShown ? 'move--shown' : 'move--hidden'}`} 
        onClick={ e => { e.stopPropagation() }}
      >
        <div className="move__param move__project">
          <div 
            className='move__container' 
            onClick={ () => {showList('proj')} }
          >
            <div 
              className="move__header"
              children="Project"
            />
            
            <div
              className="move__content"
              children={ newProject.name }
            />
          </div>

          {
            projListShown &&
            <ul className="move__list move__list--proj">
              { projects.map(project => { return <ListProject key={ project.id } project={ project }/> }) }
            </ul>
          }
        </div>
        
        <div className="move__param move__position">
          <div 
            className='move__container' 
            onClick={ () => {showList('pos')} }
          >
            <div 
              className="move__header"
              children="Position"
            />

            <div 
              className="move__content"
              children={ newPosition }
            />
          </div>

          {
            posListShown &&
            <ul className="move__list move__list--pos">
            { 
              newProject.types
                .sort((a, b) => { return a.position - b.position })
                .map(type => { return <ListPosition key={ type.id } position={ type.position }/> }) 
            }
            
            {
              newProject.id !== activeProject.id &&
              <ListPosition 
                key={ 'last' } 
                position={ newProject.types.length }
              />
            }
            </ul>
          }
        </div>

        <div className="move__btns">
          <div 
            className="move__btn" 
            onClick={ () => {iterateListPosition('decrement')} }
            children={ <FontAwesomeIcon icon={ faArrowLeft }/> }
          />

          <div 
            className="move__btn" 
            onClick={ () => {iterateListPosition('increment')} }
            children={ <FontAwesomeIcon icon={ faArrowRight }/> }
          />

          <div 
            className="move__submit" 
            onClick={ moveList }
            children="MOVE"
          />
        </div>
      </div>
    </div>
  )
}