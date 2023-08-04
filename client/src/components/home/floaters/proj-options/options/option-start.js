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

  function callDeleteProject()
  {
    const projectsContext = { projects, setProjects, activeProject, setActiveProject }
    const userContext = { user, setUser };
    const reducerContext = { state, dispatch };

    deleteProject(projectsContext, userContext, reducerContext)
  }

  function callCloneProject()
  {
    const projectsContext = { projects, setProjects, activeProject }
    const userContext = { user, setUser };
    const reducerContext = { state, dispatch };

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
      
      <div className="start__option" onClick={ callCloneProject }>
        <FontAwesomeIcon icon={ faClone }/>
        <span>CLONE PROJECT</span>
      </div>

      <div className="start__option start__option--danger" onClick={ callDeleteProject }>
        <FontAwesomeIcon icon={ faTrash }/>
        <span>DELETE PROJECT</span>
      </div>
    </div>
  )
}