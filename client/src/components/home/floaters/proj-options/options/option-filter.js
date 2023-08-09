import { useState, useContext, useEffect, useRef } from "react"
import { ProjectsContext, ReducerContext } from "app"

import filterTasks from "functions/tasks-filter";
import getTextColor from "utils/getTextColor";
import List from 'components/utils/list/list'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock } from '@fortawesome/free-regular-svg-icons';

export default function ProjFilter()
{
  const { projects, setProjects, activeProject } = useContext(ProjectsContext);
  const { state, dispatch } = useContext(ReducerContext);
  const [filters, setFilters] = useState({ keywords: '', date: null, tags: [] });

  const tagsList = structuredClone(activeProject.tags);

  const datesList = 
  [
    { type: 'overdue' , className: 'date__overdue' , name: 'overdue'        },
    { type: 'today'   , className: 'date__today'   , name: 'Due today'      },
    { type: 'tomorrow', className: 'date__tomorrow', name: 'Due tomorrow'   },
    { type: 'week'    , className: 'date__week'    , name: 'Due next week'  },
    { type: 'month'   , className: 'date__month'   , name: 'Due next month' }
  ]

  useEffect(() => { filterTasks({ projects, setProjects, activeProject }, filters, 'all') }, [filters])

  function setDateFilter(dateType)
  { 
    if (filters.date && filters.date === dateType)
      setFilters((prevFilters) => ({ ...prevFilters, date: null }))

    else
      setFilters((prevFilters) => ({ ...prevFilters, date: dateType }))
  }

  function setTagFilter(tag)
  {
    const filtersCopy = structuredClone(filters);

    if (filtersCopy.tags)
    {
      const tagIndex = filtersCopy.tags.findIndex(listTag => listTag === tag);

      if (tagIndex !== -1)
        filtersCopy.tags.splice(tagIndex, 1)

      else
        filtersCopy.tags.push(tag);
    }

    else
    {
      filtersCopy.tags = [];
      filtersCopy.tags.push(tag);
    }

    setFilters(filtersCopy);
  }

  function Date({ itemData })
  {
    const isChecked = filters.date
    ? filters.date === itemData.type
    : false

    return (
      <div className={`date ${itemData.className}`} onClick={ () => {setDateFilter(itemData.type)} }>
        <div className={`filter__check ${isChecked && 'filter__check--checked'}`}/>
        <FontAwesomeIcon icon={ faClock }/>
        <span>{ itemData.name }</span>
      </div>
    )
  }

  function Tag({ itemData })
  {
    const colors =
    {
      backgroundColor: itemData.color, 
      color: getTextColor(itemData.color)
    }

    const isChecked = filters.tags 
    ? filters.tags.includes(itemData.id) ? true : false
    : false

    return (
      <li className='tags__tag'>
        <div 
          className={`filter__check ${isChecked && 'filter__check--checked'}`}
          onClick={ () => {setTagFilter(itemData.id)} }
        />
        
        <div className="tag__name" style={ colors } onClick={ () => {setTagFilter(itemData.id)} }>
          { itemData.name }
        </div>
      </li>
    )
  }

  return (
    <div className="filter">
      <div className="keyword">
        <label className="filter__header" htmlFor="keyword__input">Search for keywords</label>
        <input 
          className="keyword__input" 
          id="keyword__input" 
          type="text"
          value={ filters.keywords }
          onChange={ e => setFilters((prevFilters) => ({ ...prevFilters, keywords: e.target.value })) }
        />
      </div>

      <div className="dates">
        <p className="filter__header">Dates</p>
        <List
          classes="dates__list"
          ids={`list-proj-options:filter:dates`}
          elements={ datesList }
          ListItem={ Date }
        />
      </div>

      <div className="tags">
        <p className="filter__header">Tags</p>
        <List
          classes='tags__list'
          ids={`list--proj-options:filter:tags`} 
          elements={ tagsList } 
          ListItem={ Tag }
        />
      </div>
    </div>
  )
}

// due dates, tags, keywords