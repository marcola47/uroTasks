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
    const typesList = structuredClone(activeProject.types);
    const taskList = structuredClone(activeProject.tasks);
    const filteredTasks = taskList.filter(listTask => listTask.type === state.cardOptions.data.id);

    const newType = 
    {
      id: uuid(),
      name: state.cardOptions.data.name + ' copy',
      position: activeProject.types.length + 1,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  
    typesList.push(newType);

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

        project.types = typesList;
      }

      return project;
    })

    setProjects(projectsCopy);
    axios.post('/a/project/update?type=types&crud=cloneList', 
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
    dispatch({ type: 'setCardOptions', payload: { params: null, data: null } })
  }

  return (
    <div className="option" onClick={ showConfirmation }>
      <FontAwesomeIcon icon={ faClone }/>
      <span>Clone list</span>
    </div>
  )
}