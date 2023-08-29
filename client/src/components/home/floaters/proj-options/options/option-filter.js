import { useContext } from "react"
import { ProjectsContext, ReducerContext } from "app"

import getTextColor from "utils/getTextColor";
import { List } from 'components/utils/list/list'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock } from '@fortawesome/free-solid-svg-icons';

export default function ProjFilter()
{
  const { activeProject } = useContext(ProjectsContext);
  const { state, dispatch } = useContext(ReducerContext);
  const tagsList = structuredClone(activeProject.tags);

  const datesList = 
  [
    { type: 'overdue' , name: 'Overdue'        },
    { type: 'today'   , name: 'Due today'      },
    { type: 'tomorrow', name: 'Due tomorrow'   },
    { type: 'week'    , name: 'Due next week'  },
    { type: 'month'   , name: 'Due next month' }
  ]

  function setDateFilter(dateType)
  { 
    if (state.filters.date && state.filters.date === dateType)
      dispatch({ type: 'setFilters', payload: { ...state.filters, date: null } })

    else
      dispatch({ type: 'setFilters', payload: { ...state.filters, date: dateType } })
  }

  function setTagFilter(tag)
  {
    const filtersCopy = structuredClone(state.filters);

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

    dispatch({ type: 'setFilters', payload: filtersCopy })
  }

  function Date({ itemData: date })
  {
    const isChecked = state.filters.date
      ? state.filters.date === date.type
      : false

    return (
      <div 
        className={`date date__${date.type}`} 
        onClick={ () => {setDateFilter(date.type)} }
      >
        <div className={`filter__check ${isChecked && 'filter__check--checked'}`}/>
        <FontAwesomeIcon icon={ faClock }/>
        <span>{ date.name }</span>
      </div>
    )
  }

  function Tag({ itemData: tag })
  {
    const colors =
    {
      backgroundColor: tag.color, 
      color: getTextColor(tag.color)
    }

    const isChecked = state.filters.tags 
      ? state.filters.tags.includes(tag.id) ? true : false
      : false

    return (
      <li className='tags__tag'>
        <div 
          className={`filter__check ${isChecked && 'filter__check--checked'}`}
          onClick={ () => {setTagFilter(tag.id)} }
        />
        
        <div 
          className="tag__name" 
          style={ colors } 
          onClick={ () => {setTagFilter(tag.id)} }
          children={ tag.name }
        />
      </li>
    )
  }

  return (
    <div className="filter">
      <h3 
        className="filter__header"
        children="FILTER TASKS"
      />

      <div className="keyword">
        <label 
          className="filter__option__header" 
          htmlFor="keyword__input"
          children="Search for keywords"
        />

        <input 
          className="keyword__input" 
          id="keyword__input" 
          type="text"
          value={ state.filters.keywords }
          onChange={ e => dispatch({ type: 'setFilters', payload: { ...state.filters, keywords: e.target.value } }) }
          autoFocus
        />
      </div>

      <div className="dates">
        <p 
          className="filter__option__header" 
          children="Dates"
        />

        <List
          classes="dates__list"
          ids={`list-proj-options:filter:dates`}
          elements={ datesList }
          ListItem={ Date }
        />
      </div>

      <div className="tags">
        <p 
          className="filter__option__header" 
          children="Tags"
        />
        
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