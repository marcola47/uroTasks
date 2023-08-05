import { useContext } from "react"
import { ProjectsContext, UserContext, ReducerContext } from "app"

import cloneProject from 'functions/project-clone'
import deleteProject from 'functions/project-delete';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilter, faArrowDownWideShort, faTag, faClone, faTrash } from '@fortawesome/free-solid-svg-icons';

export default function ProjStart()
{
  const { user, setUser } = useContext(UserContext);
  const { projects, setProjects, activeProject, setActiveProject } = useContext(ProjectsContext);
  const { state, dispatch } = useContext(ReducerContext);

  function callFunction(func)
  {
    const projectsContext = { projects, setProjects, activeProject, setActiveProject }
    const userContext = { user, setUser };
    const reducerContext = { state, dispatch };

    if (func === 'delete')
      deleteProject(projectsContext, userContext, reducerContext)

    else if (func === 'clone')
      cloneProject(projectsContext, userContext, reducerContext)
  }

  return (
    <div className="start">
      <div className="start__option" onClick={ () => {dispatch({ type: 'setProjOptions', payload: 'filter' })} }>
        <FontAwesomeIcon icon={ faFilter }/>
        <span>FILTER</span>
      </div>

      <div className="start__option" onClick={ () => {dispatch({ type: 'setProjOptions', payload: 'sort' })} }>
        <FontAwesomeIcon icon={ faArrowDownWideShort }/>
        <span>SORT</span>
      </div>

      <div className="start__option" onClick={ () => {dispatch({ type: 'setProjOptions', payload: 'tags-display' })} }>
        <FontAwesomeIcon icon={ faTag }/>
        <span>TAGS</span>
      </div>
      
      <div className="start__option" onClick={ () => {callFunction('clone')} }>
        <FontAwesomeIcon icon={ faClone }/>
        <span>CLONE PROJECT</span>
      </div>

      <div className="start__option start__option--danger" onClick={ () => {callFunction('delete')} }>
        <FontAwesomeIcon icon={ faTrash }/>
        <span>DELETE PROJECT</span>
      </div>
    </div>
  )
}