import { useContext } from 'react';
import { ProjectsContext, ReducerContext } from 'app';
import axios, { setResponseConfirmation, setResponseError } from 'utils/axiosConfig'
import { v4 as uuid } from 'uuid';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClone } from '@fortawesome/free-solid-svg-icons';

export default function OptionCloneList()
{
  const { projects, setProjects, activeProject } = useContext(ProjectsContext);
  const { state, dispatch } = useContext(ReducerContext);

  function cloneList()
  {
    const typeList = structuredClone(activeProject.types);
    const taskList = structuredClone(activeProject.tasks);
    const filteredTasks = taskList.filter(listTask => listTask.type === state.taskListOptions.data.id);

    const newType = 
    {
      id: uuid(),
      name: state.taskListOptions.data.name + ' copy',
      position: activeProject.types.length,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  
    typeList.push(newType);

    filteredTasks.map(listTask => 
    {
      listTask.id = uuid();
      listTask.type = newType.id;

      return listTask;
    })

    const projectsOld = structuredClone(projects);
    const projectsCopy = structuredClone(projects).map(project => 
    {
      if (project.id === activeProject.id)
      {
        for (let i = 0; i < filteredTasks.length; i ++)
          project.tasks.push(filteredTasks[i]);

        project.types = typeList;
      }

      return project;
    })

    setProjects(projectsCopy);
    axios.post('/a/list/clone', 
    {
      projectID: activeProject.id,
      newType: newType,
      taskList: filteredTasks
    })
    .then(() => setResponseConfirmation("Successfully cloned list", "", dispatch))
    .catch(err => 
    {
      setResponseError(err, dispatch);
      setProjects(projectsOld);
    })

    dispatch({ type: 'confirmationShown', payload: false })
  }

  function showConfirmation()
  {
    dispatch(
    { 
      type: 'setConfirmation',
      payload: 
      {
        header: "Are you sure you want to clone this list?",
        message: "",
        className: 'btn--confirmation--positive',
        confirmation: "Yes, I want to clone this list",
        rejection: "No, I'm not cloning this list",
        function: cloneList
      } 
    })

    dispatch({ type: 'confirmationShown', payload: true })
    dispatch({ type: 'setTaskListOptions', payload: { params: null, data: null } })
  }

  return (
    <div className="option" onClick={ showConfirmation }>
      <FontAwesomeIcon icon={ faClone }/>
      <span>Clone list</span>
    </div>
  )
}