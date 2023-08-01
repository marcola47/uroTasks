import { useContext } from 'react';
import { ProjectsContext, ReducerContext } from 'app';
import { SubMenusContext } from '../editor';
import axios, { setResponseError } from 'utils/axiosConfig';

import { TransitionOpacity, AnimateTransit } from 'components/utils/transitions/transitions';
import List from 'components/utils/list/list';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowsLeftRight } from '@fortawesome/free-solid-svg-icons';

export default function OptionType({ task })
{
  const { projects, setProjects, activeProject, setActiveProject } = useContext(ProjectsContext);
  const { dispatch } = useContext(ReducerContext);
  const { subMenus, setSubMenus } = useContext(SubMenusContext);
  
  const taskTypes = activeProject.types.filter(type => type.id !== task.type);

  function updateTaskType(newType)
  { 
    const taskList = activeProject.tasks;
    const taskToMove = taskList.find(taskItem => taskItem.id === task.id);
    
    const tasksFiltered = taskList.filter(taskObj => taskObj.type === newType.id);
    let lastTaskPos = Math.max(...tasksFiltered.map(taskObj => taskObj.position));

    if (lastTaskPos === -Infinity)
      lastTaskPos = 0;

    const types = { old: task.type, new: newType.id };
    const positions = { old: taskToMove.position, new: lastTaskPos + 1 };
    
    taskList.map(taskObj => 
    {
      if (taskObj.id === taskToMove.id)
      {
        taskObj.type = types.new;
        taskObj.position = positions.new;
      }

      else if (taskObj.type === task.type && taskObj.position > positions.old)
        taskObj.position = taskObj.position - 1;
        
      return taskObj;
    })

    const projectsCopy = [...projects].map(project => 
    {
      if (project.id === activeProject.id)
      {
        if (types.new === 'done')
          project.activeTasks = project.activeTasks - 1;

        else if (types.old === 'done')
          project.activeTasks = project.activeTasks + 1;

        project.tasks = taskList;
      }

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
      <div className='option option--type' onClick={ () => {setSubMenus({ tags: false, types: !subMenus.types })} }>
        <div className='option__icon'><FontAwesomeIcon icon={ faArrowsLeftRight }/></div>
      </div>

      <AnimateTransit>
      {
        subMenus.types &&
        <TransitionOpacity className="type__select">
          <div className="type__header">Suggested</div>
          <List
            classes='type__locations'
            ids={`list--${task.id}:types`} 
            elements={ taskTypes }
            ListItem={ TypeLocation }
          />
        </TransitionOpacity>
      }
      </AnimateTransit>
    </>
  )
}