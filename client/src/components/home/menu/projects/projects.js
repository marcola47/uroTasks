import { useContext } from 'react';
import { ProjectsContext, ReducerContext, UserContext } from 'app';
import axios, { setResponseError } from 'utils/axiosConfig';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';

import { ButtonGlow } from 'components/utils/buttons/buttons';
import List from 'components/utils/list/list';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronUp, faPlus, faSquare } from '@fortawesome/free-solid-svg-icons';

function MenuProject({ itemData })
{ 
  const { user, setUser } = useContext(UserContext);
  const { state, dispatch } = useContext(ReducerContext);

  function activateProject()
  {
    if (itemData.id !== user.activeProject)
    {
      if (window.innerWidth < 1337 && state.menuShown === true)
        dispatch({ type: 'menuShown', payload: false });
  
      axios.post('/a/user/update/activeProject', 
      {
        userID: user.id, 
        projectID: itemData.id
      })
      .then(() => setUser(prevUser => ({ ...prevUser, activeProject: itemData.id })))
      .catch(err => setResponseError(err, dispatch))
    }
  }

  return (
    <Draggable draggableId={ itemData.id } index={ itemData.position }>
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
            <span style={{ color: itemData?.color }}><FontAwesomeIcon icon={ faSquare }/></span> 
            <div className='project__name'>{ itemData?.name }</div>
          </div> 
        </li>
      )
    }
    </Draggable>
  )
}

export default function MenuProjects()
{
  const { projects } = useContext(ProjectsContext);
  const { dispatch } = useContext(ReducerContext);

  function toggleProjectList()
  {
    const chevronElement = document.querySelectorAll('.fa-chevron-up')[0];
    chevronElement.classList.toggle('chevron-rotate');
  
    const projectsListElement = document.getElementById('list--projects');
    projectsListElement.classList.toggle('projects__list--hidden')
  }

  const onDragEnd = result => 
  {
    console.log(result)
  }

  // implement drag and drop
  // wrap list in the context
  // make the list a droppable
  // make the list items draggable 

  return (
    <div className='projects'>
      <h2 className='projects__header' onClick={ toggleProjectList }>Projects <FontAwesomeIcon icon={ faChevronUp }/></h2>
      <ButtonGlow onClick={ () => {dispatch({ type: 'projCreatorShown', payload: true })} } icon={ faPlus } fontSize='1.5rem'/>
      <DragDropContext onDragEnd={ onDragEnd }>
        <Droppable droppableId='user-project-list' type="user-type-list">
          { 
            (provided) => 
            (
              <ul className='projects__list' ref={ provided.innerRef } { ...provided.droppableProps }>
                { projects.map(project => <MenuProject key={ project.id } itemData={ project } index={ project.position }/>) }
                { provided.placeholder }
              </ul>
            )
          }
        </Droppable>
      </DragDropContext>
    </div>
  ) 
}