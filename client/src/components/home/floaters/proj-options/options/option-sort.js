import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUpAZ, faArrowDownAZ, faArrowUp, faArrowDown, faClock, faFile, faFilePen } from '@fortawesome/free-solid-svg-icons';

export default function ProjSort()
{
  return (
    <div className="sort">
      <h3 className="sort__header">SORT TASKS</h3>

      <div className="sort__alpha">
        <p className="sort__option__header">Alphabetically</p>
        
        <div className="sort__option">
          <FontAwesomeIcon icon={ faArrowDownAZ }/>
          <span>Sort alphabetically from A to Z</span>
        </div>

        <div className="sort__option">
          <FontAwesomeIcon icon={ faArrowUpAZ }/>
          <span>Sort alphabetically from Z to A</span>
        </div>
      </div>

      <div className="sort__dates">
        <p className="sort__option__header">Due Date</p>

        <div className="sort__option sort__option--danger">
          <FontAwesomeIcon icon={ faClock }/>
          <span>Sort by closest to due date</span>
        </div>

        <div className="sort__option sort__option--safe">
          <FontAwesomeIcon icon={ faClock }/>
          <span>Sort by farthest to due date</span>
        </div>
      </div>

      <div className="sort__creation">
        <p className="sort__option__header">Creation Date</p>

        <div className="sort__option">
          <div className="sort__option__icons">
            <FontAwesomeIcon icon={ faArrowUp }/>
            <FontAwesomeIcon icon={ faFile }/>
          </div>
          <span>Sort by creation date ascending</span>
        </div>

        <div className="sort__option">
          <div className="sort__option__icons">
            <FontAwesomeIcon icon={ faArrowDown }/>
            <FontAwesomeIcon icon={ faFile }/>
          </div>
          <span>Sort by creation date descending</span>
        </div>
      </div>

      <div className="sort__update">
        <p className="sort__option__header">Update Date</p>

        <div className="sort__option">
          <div className="sort__option__icons">
            <FontAwesomeIcon icon={ faArrowUp }/>
            <FontAwesomeIcon icon={ faFilePen }/>
          </div>
          <span>Sort by last update ascending</span>
        </div>

        <div className="sort__option">
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