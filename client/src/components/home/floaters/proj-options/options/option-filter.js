import { useContext, useRef } from "react"
import { ProjectsContext, ReducerContext } from "app"

import getTextColor from "utils/getTextColor";
import List from 'components/utils/list/list'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock } from '@fortawesome/free-regular-svg-icons';

export default function ProjFilter()
{
  const { projects, setProjects, activeProject } = useContext(ProjectsContext);
  const { state, dispatch } = useContext(ReducerContext);

  const tagsList = structuredClone(activeProject.tags);

  function Tag({ itemData })
  {
    const colors =
    {
      backgroundColor: itemData.color, 
      color: getTextColor(itemData.color)
    }

    return (
      <li className='tags__tag'>
        <div 
          className='filter__check'
          onClick={ () => {} }
        />
        
        <div className="tag__name" style={ colors } onClick={ () => {} }>
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