import { useContext } from 'react';
import { ProjectsContext, ReducerContext } from 'app';
import { SubMenusContext } from '../editor';
import axios, { setResponseError } from 'utils/axiosConfig';

import { TransitionOpacity, AnimateTransit } from 'components/utils/transitions/transitions';
import { List } from 'components/utils/list/list';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowsLeftRight, faArrowTurnDown  } from '@fortawesome/free-solid-svg-icons';

export default function OptionType({ task })
{
  const { projects, setProjects, activeProject } = useContext(ProjectsContext);
  const { state, dispatch } = useContext(ReducerContext);
  const { subMenus, setSubMenus } = useContext(SubMenusContext);
  
  const taskTypes = structuredClone(activeProject.types).filter(type => type.id !== task.type);

  function updateTaskType(newType)
  { 
    const taskList = structuredClone(activeProject.tasks);
    const taskToMove = taskList.find(listTask => listTask.id === task.id);
    
    const tasksFiltered = taskList.filter(listTask => listTask.type === newType.id);
    let lastTaskPos = Math.max(...tasksFiltered.map(listTask => listTask.position));

    if (lastTaskPos === -Infinity)
      lastTaskPos = 0;

    const types = { old: task.type, new: newType.id };
    const positions = { old: taskToMove.position, new: lastTaskPos + 1 };
    
    taskList.map(listTask => 
    {
      if (listTask.id === taskToMove.id)
      {
        listTask.type = types.new;
        listTask.position = positions.new;
      }

      else if (listTask.type === types.old && listTask.position > positions.old)
        listTask.position = listTask.position - 1;
        
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

    dispatch(
    { 
      type: 'setEditor', 
      payload: { params: null, data: null } 
    })

    setProjects(projectsCopy);
    axios.patch('/a/task/update/type', 
    {
      projectID: activeProject.id, 
      taskID: task.id, 
      types: types, 
      positions: positions
    })
    .catch(err =>
    {
      setResponseError(err, dispatch);
      setProjects(projectsOld)
    })
  }

  function TypeLocation({ itemData: type })
  {
    return (
      <div 
        key={ type.id } 
        className='type__location' 
        onClick={ () => {updateTaskType(type)} }
      > { type.name.toUpperCase() }
      </div>
    )
  }

  function toggleSubMenus()
  {
    const newSubMenus = 
    {
      tags: false,
      types: !subMenus.types,
      dates: false
    }

    setSubMenus(newSubMenus);
  }
  
  return (
    <>
      <div 
        className={`option option--type ${subMenus.types && 'option--selected'}`} 
        onClick={ toggleSubMenus }
      >
      {
        subMenus.types
        ? <div 
        className='option__icon' 
        children={ <FontAwesomeIcon icon={ faArrowTurnDown }/> }
          />
        
        : <div 
            className='option__icon' 
            children={ <FontAwesomeIcon icon={ faArrowsLeftRight }/> }
          />
      }
      </div>

      <AnimateTransit>
      {
        subMenus.types &&
        <TransitionOpacity className="sub-menu type">
          <div 
            className="sub-menu__wrapper" 
            style={{ width: state.editor.params.w }}
          >
            <div className="sub-menu__header">
              TYPES
            </div>
            
            <List
              classes='type__locations'
              ids={`list--${task.id}:types`} 
              elements={ taskTypes }
              ListItem={ TypeLocation }
            />
          </div>
        </TransitionOpacity>
      }
      </AnimateTransit>
    </>
  )
}