import { useContext } from 'react';
import { ProjectsContext, ReducerContext } from 'app';
import { SubMenusContext } from '../editor';
import axios, { setResponseError } from 'utils/axiosConfig';

import { TransitionOpacity, AnimateTransit } from 'components/utils/transitions/transitions';
import List from 'components/utils/list/list';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowsLeftRight, faArrowTurnDown  } from '@fortawesome/free-solid-svg-icons';

export default function OptionType({ task })
{
  const { projects, setProjects, activeProject, setActiveProject } = useContext(ProjectsContext);
  const { state, dispatch } = useContext(ReducerContext);
  const { subMenus, setSubMenus } = useContext(SubMenusContext);
  
  const taskTypes = activeProject.types.filter(type => type.id !== task.type);

  function updateTaskType(newType)
  { 
    const taskList = activeProject.tasks;
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

    const projectsCopy = [...projects].map(project => 
    {
      if (project.id === activeProject.id)
        project.tasks = taskList;

      return project;
    })

    axios.post(`/a/task/update?type=type`, 
    {
      projectID: activeProject.id, 
      taskID: task.id, 
      types: types, 
      positions: positions
    })
    .then(() => 
    { 
      dispatch(
      { 
        type: 'setEditor', 
        payload: { params: null, data: null } 
      })

      setActiveProject(prevActiveProject => ({ ...prevActiveProject, tasks: taskList }));
      setProjects(projectsCopy);
    })
    .catch(err => setResponseError(err, dispatch))
  }

  function TypeLocation({ itemData })
  {
    return (
      <div key={ itemData.id } className='type__location' onClick={ () => {updateTaskType(itemData)} }>
        { itemData.name.toUpperCase() }
      </div>
    )
  }

  return (
    <>
      <div className={`option option--type ${subMenus.types && 'option--selected'}`} onClick={ () => {setSubMenus({ tags: false, types: !subMenus.types })} }>
      {
        subMenus.types
        ? <div className='option__icon'><FontAwesomeIcon icon={ faArrowTurnDown }/></div>
        : <div className='option__icon'><FontAwesomeIcon icon={ faArrowsLeftRight }/></div>
      }
      </div>

      <AnimateTransit>
      {
        subMenus.types &&
        <TransitionOpacity className="type__select">
          <div className="type__select__wrapper" style={{ width: state.editorParams.w }}>
            <div className="type__header">Suggested</div>
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