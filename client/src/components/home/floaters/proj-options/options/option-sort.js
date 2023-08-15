import { useContext } from "react";
import { ProjectsContext, UserContext, ReducerContext } from "app";
import axios, { setResponseConfirmation, setResponseError } from "utils/axiosConfig";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUpAZ, faArrowDownAZ, faArrowUp, faArrowDown, faClock, faFile, faFilePen } from '@fortawesome/free-solid-svg-icons';

export default function ProjSort()
{
  const { projects, setProjects, activeProject } = useContext(ProjectsContext);
  const { user } = useContext(UserContext);
  const { dispatch } = useContext(ReducerContext);

  function sortAllTasks(method)
  {
    const taskList = structuredClone(activeProject.tasks);
    const groupedTasks = {};
    const sortedTasks = [];

    taskList.forEach(listTask => 
    {
      if (!groupedTasks[listTask.type])
        groupedTasks[listTask.type] = [];

      groupedTasks[listTask.type].push(listTask);
    })

    for (const type in groupedTasks)
    {
      groupedTasks[type].sort((a, b) => 
      {
        if (method === 'alpha_asc')
          return a.content.localeCompare(b.content)
        
        else if (method === 'alpha_desc')
          return b.content.localeCompare(a.content)

        else if (method === 'due_close')
          return new Date(a.due_date).getTime() - new Date(b.due_date).getTime()

        else if (method === 'due_far')
          return  new Date(b.due_date).getTime() - new Date(a.due_date).getTime()

        else if (method === 'creation_close')
          return new Date(a.created_at).getTime() - new Date(b.created_at).getTime()

        else if (method === 'creation_far')
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()

        else if (method === 'update_close')
          return new Date(a.updated_at).getTime() - new Date(b.updated_at).getTime()

        else if (method === 'update_far')
          return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()

        else 
          return groupedTasks[type];
      })

      for (let i = 0; i < groupedTasks[type].length; i++)
      {
        groupedTasks[type][i].position = i + 1;
        sortedTasks.push(groupedTasks[type][i])
      }
    }

    const projectsOld = structuredClone(projects);
    const projectsCopy = structuredClone(projects).map(project =>
    {
      if (project.id === activeProject.id)
        project.tasks = sortedTasks;
      
      return project;
    })

    setProjects(projectsCopy)
    if (user.settings.save_general_ordering)
    {
      axios.post('/a/task/order', 
      {
        projectID: activeProject.id,
        typeID: 'all',
        method: method
      })
      .then(() => setResponseConfirmation("Successfully sorted tasks", "", dispatch))
      .catch(err => 
      {
        setResponseError(err, dispatch);
        setProjects(projectsOld);
      })
    }
  }

  return (
    <div className="sort">
      <h3 className="sort__header">SORT TASKS</h3>

      <div className="sort__alpha">
        <p className="sort__option__header">Alphabetically</p>
        
        <div className="sort__option" onClick={ () => {sortAllTasks('alpha_asc')} }>
          <FontAwesomeIcon icon={ faArrowDownAZ }/>
          <span>Sort alphabetically from A to Z</span>
        </div>

        <div className="sort__option" onClick={ () => {sortAllTasks('alpha_desc')} }>
          <FontAwesomeIcon icon={ faArrowUpAZ }/>
          <span>Sort alphabetically from Z to A</span>
        </div>
      </div>

      <div className="sort__dates">
        <p className="sort__option__header">Due Date</p>

        <div className="sort__option sort__option--danger" onClick={ () => {sortAllTasks('due_close')} }>
          <FontAwesomeIcon icon={ faClock }/>
          <span>Sort by closest to due date</span>
        </div>

        <div className="sort__option sort__option--safe" onClick={ () => {sortAllTasks('due_far')} }>
          <FontAwesomeIcon icon={ faClock }/>
          <span>Sort by farthest to due date</span>
        </div>
      </div>

      <div className="sort__creation">
        <p className="sort__option__header">Creation Date</p>

        <div className="sort__option" onClick={ () => {sortAllTasks('creation_close')} }>
          <div className="sort__option__icons">
            <FontAwesomeIcon icon={ faArrowUp }/>
            <FontAwesomeIcon icon={ faFile }/>
          </div>
          <span>Sort by creation date ascending</span>
        </div>

        <div className="sort__option" onClick={ () => {sortAllTasks('creation_far')} }>
          <div className="sort__option__icons">
            <FontAwesomeIcon icon={ faArrowDown }/>
            <FontAwesomeIcon icon={ faFile }/>
          </div>
          <span>Sort by creation date descending</span>
        </div>
      </div>

      <div className="sort__update">
        <p className="sort__option__header">Update Date</p>

        <div className="sort__option" onClick={ () => {sortAllTasks('update_close')} }>
          <div className="sort__option__icons">
            <FontAwesomeIcon icon={ faArrowUp }/>
            <FontAwesomeIcon icon={ faFilePen }/>
          </div>
          <span>Sort by last update ascending</span>
        </div>

        <div className="sort__option" onClick={ () => {sortAllTasks('update_far')} }>
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