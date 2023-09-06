import { useContext } from 'react';
import { ProjectsContext, ReducerContext, UserContext } from 'app';
import axios, { setResponseError } from 'utils/axiosConfig';
import { DragDropContext, Draggable } from 'react-beautiful-dnd';

import { ButtonGlow } from 'components/utils/buttons/buttons';
import { DroppableList } from 'components/utils/list/list';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronUp, faPlus, faSquare } from '@fortawesome/free-solid-svg-icons';
  
function MenuProject({ itemData: project })
{ 
  const { user, setUser } = useContext(UserContext);
  const { state, dispatch } = useContext(ReducerContext);

  function activateProject()
  {
    if (project.id !== user.activeProject)
    {
      if (window.innerWidth < 1337 && state.menuShown === true)
        dispatch({ type: 'menuShown', payload: false });
  
      axios.patch('/a/user/update/activeProject', 
      {
        userID: user.id, 
        projectID: project.id
      })
      .then(() => setUser(prevUser => ({ ...prevUser, activeProject: project.id })))
      .catch(err => setResponseError(err, dispatch))
    }
  }

  return (
    <Draggable draggableId={ project.id } index={ project.position }>
    {
      (provided) =>
      (
        <li 
          className='project' 
          onClick={ activateProject } 
          ref={ provided.innerRef }
          { ...provided.draggableProps }
          { ...provided.dragHandleProps }
        >
          <div className='project__data'>
            <span style={{ color: project?.color }}><FontAwesomeIcon icon={ faSquare }/></span> 
            <div className='project__name'>{ project?.name }</div>
          </div> 
        </li>
      )
    }
    </Draggable>
  )
}

export default function MenuProjects()
{
  const { projects, setProjects } = useContext(ProjectsContext);
  const { dispatch } = useContext(ReducerContext);
  const { user, setUser } = useContext(UserContext);
  const sortedProjects = structuredClone(projects).sort((a, b) => a.position - b.position);

  function toggleProjectList()
  {
    const chevronElement = document.querySelectorAll('.fa-chevron-up')[0];
    chevronElement.classList.toggle('chevron-rotate');
  
    const projectsListElement = document.getElementById('list--projects');
    projectsListElement.classList.toggle('projects__list--hidden')
  }

  const onDragEnd = result => 
  {
    if (!result.destination || (result.destination.droppableId === result.source.droppableId && result.destination.index === result.source.index))
      return;
  
    const userProjectsOld = structuredClone(user.projects);
    const userProjectsCopy = structuredClone(user.projects);
    const project = userProjectsCopy.find(listProject => listProject.id === result.draggableId);
    const positions = { old: result.source.index, new: result.destination.index };
  
    userProjectsCopy.forEach(listProject => 
    {
      const isBetween =
        listProject.position >= Math.min(positions.old, positions.new) && 
        listProject.position <= Math.max(positions.old, positions.new)
  
      if (listProject.id === project.id) 
        listProject.position = positions.new;
      
      else if (listProject.id !== project.id && isBetween)
        listProject.position += positions.new > positions.old ? -1 : 1;
    });
  
    let projectPositions = {};
    userProjectsCopy.forEach(project => projectPositions[project.id] = project.position);

    const projectsOld = structuredClone(projects);
    const projectsCopy = structuredClone(projects).map(project =>
    {
      if (project.id === result.draggableId)
        project.position = result.destination.index;
      
      else if (project.id !== result.draggableId && projectPositions[project.id] !== undefined)
        project.position = projectPositions[project.id];

      return project;
    });
  
    setUser(prevUser => ({ ...prevUser, projects: userProjectsCopy }));
    setProjects(projectsCopy)
    axios.patch('/a/project/update/position', 
    {
      projectID: project.id,
      userID: user.id,
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
      setUser(prevUser => ({ ...prevUser, projects: userProjectsOld }));
    });
  }

  return (
    <div className='projects'>
      <h2 
        className='projects__header' 
        onClick={ toggleProjectList }
      >
        <span>Projects</span>
        <FontAwesomeIcon icon={ faChevronUp }
      />
      </h2>
      
      <ButtonGlow 
        onClick={ () => {dispatch({ type: 'projCreatorShown', payload: true })} } 
        icon={ faPlus } 
        fontSize='1.5rem'
      />
      
      <DragDropContext onDragEnd={ onDragEnd }>
        <DroppableList
          droppableId={`list--${user.id}:projects}`}
          direction='vertical'
          type="user-type-list"
          elements={ sortedProjects }
          ListItem={ MenuProject }
          className='projects__list'
        />
      </DragDropContext>
    </div>
  ) 
}