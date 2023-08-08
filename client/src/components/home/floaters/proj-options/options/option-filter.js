import { useState, useContext, useEffect, useRef } from "react"
import { ProjectsContext, ReducerContext } from "app"

import getTextColor from "utils/getTextColor";
import List from 'components/utils/list/list'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock } from '@fortawesome/free-regular-svg-icons';

export default function ProjFilter()
{
  const { projects, setProjects, activeProject } = useContext(ProjectsContext);
  const { state, dispatch } = useContext(ReducerContext);
  const [filters, setFilters] = useState({});

  const tagsList = structuredClone(activeProject.tags);

  function setFilter(filter)
  {
    const filtersCopy = structuredClone(filters);

    if (filter.type === 'tag')
    {
      if (filtersCopy.tags)
      {
        const tagIndex = filtersCopy.tags.findIndex(tag => tag === filter.tag);

        if (tagIndex !== -1)
          filtersCopy.tags.splice(tagIndex, 1)

        else
          filtersCopy.tags.push(filter.tag);
      }

      else
      {
        filtersCopy.tags = [];
        filtersCopy.tags.push(filter.tag);
      }
    }

    else if (filtersCopy[filter])
      filtersCopy[filter] = null;

    else
      filtersCopy[filter] = filter

    setFilters(filtersCopy);
  }

  useEffect(() => { console.log(filters) }, [filters])

  function Tag({ itemData })
  {
    const filter = 
    {
      type: 'tag',
      tag: itemData.id
    }

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
          onClick={ () => {setFilter(filter)} }
        />
        
        <div className="tag__name" style={ colors } onClick={ () => {setFilter(filter)} }>
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
        />
      </div>

      <div className="dates">
        <p className="filter__header">Dates</p>

        <div className="date date__overdue">
          <div className="filter__check"/>
          <FontAwesomeIcon icon={ faClock }/>
          <span>Overdue</span>
        </div>

        <div className="date date__today">
          <div className="filter__check"/>
          <FontAwesomeIcon icon={ faClock }/>
          <span>Due today</span>
        </div>

        <div className="date date__tomorrow">
          <div className="filter__check"/>
          <FontAwesomeIcon icon={ faClock }/>
          <span>Due tomorrow</span>
        </div>

        <div className="date date__next-week">
          <div className="filter__check"/>
          <FontAwesomeIcon icon={ faClock }/>
          <span>Due next week</span>
        </div>

        <div className="date date__next-month">
          <div className="filter__check"/>
          <FontAwesomeIcon icon={ faClock }/>
          <span>Due next month</span>
        </div>
      </div>

      <div className="tags">
        <p className="filter__header">Tags</p>
        <List
          classes='tags__list'
          ids={`list--proj-options:tags`} 
          elements={ tagsList } 
          ListItem={ Tag }
        />
      </div>
    </div>
  )
}

// due dates, tags, keywords