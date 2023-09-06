import { useState, useContext } from 'react';
import { ProjectsContext, ReducerContext } from 'app';
import { SubMenusContext } from '../editor';
import axios, { setResponseError } from 'utils/axiosConfig';

import { TransitionOpacity, AnimateTransit } from 'components/utils/transitions/transitions';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock, faArrowTurnDown } from '@fortawesome/free-solid-svg-icons';

export default function OptionDates({ task })
{
  const { projects, setProjects, activeProject } = useContext(ProjectsContext);
  const { state, dispatch } = useContext(ReducerContext);
  const { subMenus, setSubMenus } = useContext(SubMenusContext);

  const [datesEnabled, setDatesEnabled] = useState({ start: task.start_date ? true : false, due: task.due_date ? true : false })
  const [startDate, setStartDate] = useState(task.start_date ? task.start_date.slice(0, 10) : null);
  const [dueDate, setDueDate] = useState(task.due_date ? task.due_date.slice(0, 10) : null);

  function toggleSubMenus()
  {
    const newSubMenus = 
    {
      tags: false,
      types: false,
      dates: !subMenus.dates
    }

    setSubMenus(newSubMenus);
  }

  function toggleDates(date)
  {
    if (date === 'start')
      setDatesEnabled({ start: !datesEnabled.start, due: datesEnabled.due })

    else if (date === 'due')
      setDatesEnabled({ start: datesEnabled.start, due: !datesEnabled.due })
  }

  function saveDates()
  {
    const taskList = structuredClone(activeProject.tasks).map(listTask => 
    {
      if (listTask.id === task.id)
      {
        listTask.start_date = datesEnabled.start ? startDate : null;
        listTask.due_date = datesEnabled.due ? dueDate : null;
        task.start_date = datesEnabled.start ? startDate : null;
        task.due_date = datesEnabled.due ? dueDate : null;
      }

      return listTask;
    })

    const projectsOld = structuredClone(projects);
    const projectsCopy = structuredClone(projects).map(project => 
    {
      if (project.id === activeProject.id)
        project.tasks = taskList;

      return project;
    })

    toggleSubMenus();
    setProjects(projectsCopy);
    axios.patch('/a/task/update/dates', 
    {
      taskID: task.id,
      startDate: datesEnabled.start ? startDate : null,
      dueDate: datesEnabled.due ? dueDate : null
    })
    .catch(err => 
    {
      setResponseError(err, dispatch);
      setProjects(projectsOld)
    })
  }

  return (
    <>
      <div 
        className={`option option--type ${subMenus.dates && 'option--selected'}`} 
        onClick={ toggleSubMenus }
      >
        {
          subMenus.dates
          ? <div 
              className='option__icon' 
              children={ <FontAwesomeIcon icon={ faArrowTurnDown }/> }
            />
          
          : <div 
              className='option__icon' 
              children={ <FontAwesomeIcon icon={ faClock }/> }
            />
        }
      </div>

      <AnimateTransit>
      {
        subMenus.dates &&
        <TransitionOpacity className="sub-menu dates">
          <div 
            className="sub-menu__wrapper" 
            style={{ width: state.editor.params.w }}
          >
            <div className="sub-menu__header">
              DATES
            </div>

            <div className="dates__input">
              <label htmlFor="start-date">
                Start Date
              </label>

              <div className='dates__input__wrapper'>
                <div 
                  className={`dates__input__toggle ${datesEnabled.start && 'dates__input__toggle--checked'}`} 
                  onClick={ () => {toggleDates('start')} }
                />
              
                <input 
                  type="date" 
                  name="start-date" 
                  id="start-date" 
                  value={ startDate ?? '' } 
                  onChange={ e => setStartDate(e.target.value) }
                  disabled={ !datesEnabled.start }
                  style={{ opacity: datesEnabled.start ? 1 : 0.5 }}
                />
              </div>
            </div>

            <div className="dates__input">
              <label htmlFor="due-date">
                Due Date
              </label>

              <div className='dates__input__wrapper'>
                <div 
                  className={`dates__input__toggle ${datesEnabled.due && 'dates__input__toggle--checked'}`} 
                  onClick={ () => {toggleDates('due')} }
                />
                
                <input 
                  type="date" 
                  name="due-date" 
                  id="due-date" 
                  value={ dueDate ?? '' } 
                  onChange={ e => setDueDate(e.target.value) }
                  disabled={ !datesEnabled.due }
                  style={{ opacity: datesEnabled.due ? 1 : 0.5 }}
                />
              </div>
            </div>

            <div className="dates__save" onClick={ saveDates }>
              SAVE DATES
            </div>
          </div>
        </TransitionOpacity>
      }
      </AnimateTransit>
    </>
  )
}