import { useContext } from "react";
import { ReducerContext } from "app";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUpAZ, faArrowDownAZ, faArrowUp, faArrowDown, faClock, faFile, faFilePen } from '@fortawesome/free-solid-svg-icons';

export default function ProjSort()
{
  const { dispatch } = useContext(ReducerContext);

  return (
    <div className="sort">
      <h3 className="sort__header">SORT TASKS</h3>

      <div className="sort__alpha">
        <p className="sort__option__header">Alphabetically</p>
        
        <div className="sort__option" onClick={ () => { dispatch({ type: 'setSort', payload: 'alpha-asc' })} }>
          <FontAwesomeIcon icon={ faArrowDownAZ }/>
          <span>Sort alphabetically from A to Z</span>
        </div>

        <div className="sort__option" onClick={ () => { dispatch({ type: 'setSort', payload: 'alpha-desc' })} }>
          <FontAwesomeIcon icon={ faArrowUpAZ }/>
          <span>Sort alphabetically from Z to A</span>
        </div>
      </div>

      <div className="sort__dates">
        <p className="sort__option__header">Due Date</p>

        <div className="sort__option sort__option--danger" onClick={ () => { dispatch({ type: 'setSort', payload: 'due-close' })} }>
          <FontAwesomeIcon icon={ faClock }/>
          <span>Sort by closest to due date</span>
        </div>

        <div className="sort__option sort__option--safe" onClick={ () => { dispatch({ type: 'setSort', payload: 'due-far' })} }>
          <FontAwesomeIcon icon={ faClock }/>
          <span>Sort by farthest to due date</span>
        </div>
      </div>

      <div className="sort__creation">
        <p className="sort__option__header">Creation Date</p>

        <div className="sort__option" onClick={ () => { dispatch({ type: 'setSort', payload: 'creation-close' })} }>
          <div className="sort__option__icons">
            <FontAwesomeIcon icon={ faArrowUp }/>
            <FontAwesomeIcon icon={ faFile }/>
          </div>
          <span>Sort by creation date ascending</span>
        </div>

        <div className="sort__option" onClick={ () => { dispatch({ type: 'setSort', payload: 'creation-far' })} }>
          <div className="sort__option__icons">
            <FontAwesomeIcon icon={ faArrowDown }/>
            <FontAwesomeIcon icon={ faFile }/>
          </div>
          <span>Sort by creation date descending</span>
        </div>
      </div>

      <div className="sort__update">
        <p className="sort__option__header">Update Date</p>

        <div className="sort__option" onClick={ () => { dispatch({ type: 'setSort', payload: 'update-close' })} }>
          <div className="sort__option__icons">
            <FontAwesomeIcon icon={ faArrowUp }/>
            <FontAwesomeIcon icon={ faFilePen }/>
          </div>
          <span>Sort by last update ascending</span>
        </div>

        <div className="sort__option" onClick={ () => { dispatch({ type: 'setSort', payload: 'update-far' })} }>
          <div className="sort__option__icons">
            <FontAwesomeIcon icon={ faArrowDown }/>
            <FontAwesomeIcon icon={ faFilePen }/>
          </div>
          <span>Sort by last update descending</span>
        </div>
      </div>
    </div>
  )
}

// alphabetical, created_at, updated_at, due date, start date 